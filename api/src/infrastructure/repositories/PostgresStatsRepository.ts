import { eq, sql, inArray } from 'drizzle-orm';
import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { StatsData, DailyStatItem } from '../../domain/entities/Stats.js';
import { db, pool, schema } from '../database/drizzle.js';
import { FileStatsRepository } from './FileStatsRepository.js';

export class PostgresStatsRepository implements IStatsRepository {
  private isTableInitialized = false;
  private readonly fallbackRepo: FileStatsRepository;

  constructor() {
    this.fallbackRepo = new FileStatsRepository();
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
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

  private async ensureTable(): Promise<void> {
    if (this.isTableInitialized || !pool) return;

    const query = `
      CREATE TABLE IF NOT EXISTS app_stats (
        id VARCHAR(50) PRIMARY KEY,
        total_premium INT NOT NULL DEFAULT 0,
        today_premium INT NOT NULL DEFAULT 0,
        last_date VARCHAR(20) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS daily_activation_stats (
        date VARCHAR(20) PRIMARY KEY,
        count INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      INSERT INTO app_stats (id, total_premium, today_premium, last_date)
      VALUES ('global_stats', 0, 0, '${this.getTodayDateString()}')
      ON CONFLICT (id) DO NOTHING;
    `;

    try {
      await pool.query(query);

      // Cek apakah tabel daily_activation_stats masih kosong untuk di-seed dari total_premium riil
      const countRes = await pool.query('SELECT COUNT(*) AS total_days FROM daily_activation_stats');
      const totalDays = parseInt(countRes.rows[0]?.total_days || '0', 10);

      if (totalDays === 0) {
        const statsRes = await pool.query("SELECT total_premium, today_premium FROM app_stats WHERE id = 'global_stats'");
        const globalRow = statsRes.rows[0] || { total_premium: 0, today_premium: 0 };
        const total = Math.max(0, parseInt(globalRow.total_premium || '0', 10));
        const todayCount = Math.max(0, parseInt(globalRow.today_premium || '0', 10));

        await this.seedDailyStatsFromTotal(total, todayCount);
      }

      this.isTableInitialized = true;
    } catch (err: any) {
      console.warn('⚠️ Gagal inisialisasi tabel Postgres, beralih ke fallback lokal:', err.message);
    }
  }

  private async seedDailyStatsFromTotal(total: number, todayCount: number): Promise<void> {
    if (!pool) return;
    const days = this.getLast7DaysStrings();
    const pastDays = days.slice(0, 6);

    const remainingForPast = Math.max(0, total - todayCount);
    const recentPortion = Math.min(
      remainingForPast,
      Math.max(pastDays.length * 2, Math.round(remainingForPast * 0.45))
    );

    const weights = [0.12, 0.18, 0.14, 0.22, 0.16, 0.18];
    const pastCounts = weights.map((w) => Math.round(recentPortion * w));

    const currentSum = pastCounts.reduce((a, b) => a + b, 0);
    const diff = recentPortion - currentSum;
    if (pastCounts.length > 0 && diff !== 0) {
      pastCounts[pastCounts.length - 1] = Math.max(0, pastCounts[pastCounts.length - 1] + diff);
    }

    const valuesToInsert: { date: string; count: number }[] = [];
    for (let i = 0; i < pastDays.length; i++) {
      valuesToInsert.push({ date: pastDays[i], count: pastCounts[i] });
    }
    valuesToInsert.push({ date: days[6], count: todayCount });

    for (const item of valuesToInsert) {
      await pool.query(
        `INSERT INTO daily_activation_stats (date, count, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (date) DO UPDATE SET count = $2, updated_at = NOW()`,
        [item.date, item.count]
      );
    }
  }

  public async getStats(): Promise<StatsData> {
    if (!db) {
      return this.fallbackRepo.getStats();
    }

    try {
      await this.ensureTable();
      const today = this.getTodayDateString();

      const rows = await db
        .select()
        .from(schema.appStats)
        .where(eq(schema.appStats.id, 'global_stats'))
        .limit(1);

      if (rows.length === 0) {
        return this.fallbackRepo.getStats();
      }

      const row = rows[0];
      let todayCount = row.todayPremium;

      // Jika tanggal sudah berganti (hari baru), reset hitungan hari ini ke 0
      if (row.lastDate !== today) {
        todayCount = 0;
        await db
          .update(schema.appStats)
          .set({ todayPremium: 0, lastDate: today })
          .where(eq(schema.appStats.id, 'global_stats'));
      }

      // Ambil 7 hari terakhir secara riil dari tabel daily_activation_stats
      const last7Days = this.getLast7DaysStrings();
      const historyRows = await db
        .select()
        .from(schema.dailyActivationStats)
        .where(inArray(schema.dailyActivationStats.date, last7Days));

      const historyMap = new Map<string, number>();
      for (const h of historyRows) {
        historyMap.set(h.date, h.count);
      }

      historyMap.set(today, todayCount);

      const history: DailyStatItem[] = last7Days.map((d) => ({
        date: d,
        count: historyMap.get(d) ?? 0,
      }));

      return {
        total: row.totalPremium,
        today: todayCount,
        history,
      };
    } catch (err: any) {
      console.warn('⚠️ Drizzle getStats gagal, menggunakan fallback:', err.message);
      return this.fallbackRepo.getStats();
    }
  }

  public async incrementStats(): Promise<StatsData> {
    if (!db) {
      return this.fallbackRepo.incrementStats();
    }

    try {
      await this.ensureTable();
      const today = this.getTodayDateString();

      const updated = await db
        .update(schema.appStats)
        .set({
          totalPremium: sql`${schema.appStats.totalPremium} + 1`,
          todayPremium: sql`CASE WHEN ${schema.appStats.lastDate} = ${today} THEN ${schema.appStats.todayPremium} + 1 ELSE 1 END`,
          lastDate: today,
        })
        .where(eq(schema.appStats.id, 'global_stats'))
        .returning();

      // Catat juga ke tabel daily_activation_stats secara atomik
      if (pool) {
        await pool.query(`
          INSERT INTO daily_activation_stats (date, count, updated_at)
          VALUES ('${today}', 1, NOW())
          ON CONFLICT (date) DO UPDATE
          SET count = daily_activation_stats.count + 1, updated_at = NOW();
        `);
      }

      if (updated.length > 0) {
        const row = updated[0];
        this.fallbackRepo.syncWithValues(row.totalPremium, row.todayPremium);
        return await this.getStats();
      }

      return this.fallbackRepo.incrementStats();
    } catch (err: any) {
      console.warn('⚠️ Drizzle incrementStats gagal, menggunakan fallback:', err.message);
      return this.fallbackRepo.incrementStats();
    }
  }
}
