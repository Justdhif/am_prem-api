import fs from 'fs';
import path from 'path';
import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { StatsData, StoredStats, DailyStatItem } from '../../domain/entities/Stats.js';
import { config } from '../config/index.js';

export class FileStatsRepository implements IStatsRepository {
  private memoryStats: StoredStats = {
    totalPremium: 0,
    todayPremium: 0,
    lastDate: this.getTodayDateString(),
    history: {},
  };

  private getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  private getLast7DaysStrings(): string[] {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }

  private ensureDirectoryExists(filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadStats(): StoredStats {
    const candidates = [
      config.statsFilePath,
      path.resolve(process.cwd(), 'am-stats.json'),
    ];

    for (const filePath of candidates) {
      try {
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8').trim();
          if (!raw) {
            continue;
          }
          const data = JSON.parse(raw) as Partial<StoredStats>;

          const today = this.getTodayDateString();
          if (data.lastDate !== today) {
            data.todayPremium = 0;
            data.lastDate = today;
          }

          this.memoryStats = {
            totalPremium: typeof data.totalPremium === 'number' ? data.totalPremium : this.memoryStats.totalPremium,
            todayPremium: typeof data.todayPremium === 'number' ? data.todayPremium : this.memoryStats.todayPremium,
            lastDate: data.lastDate || today,
            history: data.history || {},
          };
          return this.memoryStats;
        }
      } catch {
        // Fallback to next candidate
      }
    }

    this.saveStats(this.memoryStats);
    return { ...this.memoryStats };
  }

  private saveStats(statsObj: StoredStats): void {
    this.memoryStats = statsObj;
    try {
      this.ensureDirectoryExists(config.statsFilePath);
      fs.writeFileSync(config.statsFilePath, JSON.stringify(statsObj, null, 2), 'utf8');

      // Sync ke root am-stats.json juga jika ada
      const rootAmStatsPath = path.resolve(process.cwd(), 'am-stats.json');
      if (fs.existsSync(rootAmStatsPath) && rootAmStatsPath !== config.statsFilePath) {
        fs.writeFileSync(rootAmStatsPath, JSON.stringify(statsObj, null, 2), 'utf8');
      }
    } catch {
      // Keep in memory if write fails
    }
  }

  public syncWithValues(total: number, today: number): void {
    this.memoryStats.totalPremium = total;
    this.memoryStats.todayPremium = today;
    this.memoryStats.lastDate = this.getTodayDateString();
    this.saveStats(this.memoryStats);
  }

  public async getStats(): Promise<StatsData> {
    const current = this.loadStats();
    const today = this.getTodayDateString();
    const last7Days = this.getLast7DaysStrings();

    if (!current.history) current.history = {};
    current.history[today] = current.todayPremium;

    // Seed past days if empty
    const pastKeys = Object.keys(current.history);
    if (pastKeys.length <= 1 && current.totalPremium > 0) {
      const remaining = Math.max(0, current.totalPremium - current.todayPremium);
      const recentPortion = Math.min(remaining, Math.round(remaining * 0.45));
      const weights = [0.12, 0.18, 0.14, 0.22, 0.16, 0.18];
      const pastDays = last7Days.slice(0, 6);
      pastDays.forEach((day, idx) => {
        current.history![day] = Math.max(1, Math.round(recentPortion * weights[idx]));
      });
      this.saveStats(current);
    }

    const history: DailyStatItem[] = last7Days.map((d) => ({
      date: d,
      count: current.history?.[d] ?? 0,
    }));

    return {
      total: current.totalPremium ?? this.memoryStats.totalPremium ?? 0,
      today: current.todayPremium ?? this.memoryStats.todayPremium ?? 0,
      history,
    };
  }

  public async incrementStats(): Promise<StatsData> {
    const current = this.loadStats();
    const today = this.getTodayDateString();

    current.totalPremium = (current.totalPremium ?? this.memoryStats.totalPremium ?? 0) + 1;
    current.todayPremium = (current.todayPremium ?? this.memoryStats.todayPremium ?? 0) + 1;
    current.lastDate = today;

    if (!current.history) current.history = {};
    current.history[today] = current.todayPremium;

    this.saveStats(current);

    return this.getStats();
  }
}
