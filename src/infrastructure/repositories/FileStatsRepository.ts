import fs from 'fs';
import path from 'path';
import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { StatsData, StoredStats } from '../../domain/entities/Stats.js';
import { config } from '../config/index.js';

export class FileStatsRepository implements IStatsRepository {
  private memoryStats: StoredStats = {
    totalPremium: 143,
    todayPremium: 19,
    lastDate: this.getTodayDateString(),
  };

  private getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
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
            this.saveStats({
              totalPremium: typeof data.totalPremium === 'number' ? data.totalPremium : this.memoryStats.totalPremium,
              todayPremium: 0,
              lastDate: today,
            });
          }

          this.memoryStats = {
            totalPremium: typeof data.totalPremium === 'number' ? data.totalPremium : this.memoryStats.totalPremium,
            todayPremium: typeof data.todayPremium === 'number' ? data.todayPremium : this.memoryStats.todayPremium,
            lastDate: data.lastDate || today,
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

  public getStats(): StatsData {
    const current = this.loadStats();
    return {
      total: current.totalPremium ?? this.memoryStats.totalPremium ?? 0,
      today: current.todayPremium ?? this.memoryStats.todayPremium ?? 0,
    };
  }

  public incrementStats(): StatsData {
    const current = this.loadStats();
    current.totalPremium = (current.totalPremium ?? this.memoryStats.totalPremium ?? 0) + 1;
    current.todayPremium = (current.todayPremium ?? this.memoryStats.todayPremium ?? 0) + 1;
    current.lastDate = this.getTodayDateString();
    this.saveStats(current);
    return {
      total: current.totalPremium,
      today: current.todayPremium,
    };
  }
}
