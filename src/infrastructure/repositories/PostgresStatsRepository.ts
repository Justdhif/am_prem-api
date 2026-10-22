import { eq, sql } from 'drizzle-orm';
import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { StatsData } from '../../domain/entities/Stats.js';
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

  private async ensureTable(): Promise<void> {
    if (this.isTableInitialized || !pool) return;

    const query = `
      CREATE TABLE IF NOT EXISTS app_stats (
        id VARCHAR(50) PRIMARY KEY,
        total_premium INT NOT NULL DEFAULT 0,
        today_premium INT NOT NULL DEFAULT 0,
        last_date VARCHAR(20) NOT NULL
      );

      INSERT INTO app_stats (id, total_premium, today_premium, last_date)
      VALUES ('global_stats', 0, 0, '${this.getTodayDateString()}')
      ON CONFLICT (id) DO NOTHING;
    `;

    try {
      await pool.query(query);
      this.isTableInitialized = true;
    } catch (err: any) {
      console.warn('⚠️ Gagal inisialisasi tabel Postgres, beralih ke fallback lokal:', err.message);
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

      return {
        total: row.totalPremium,
        today: todayCount,
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

      if (updated.length > 0) {
        const row = updated[0];
        this.fallbackRepo.syncWithValues(row.totalPremium, row.todayPremium);
        return {
          total: row.totalPremium,
          today: row.todayPremium,
        };
      }

      return this.fallbackRepo.incrementStats();
    } catch (err: any) {
      console.warn('⚠️ Drizzle incrementStats gagal, menggunakan fallback:', err.message);
      return this.fallbackRepo.incrementStats();
    }
  }
}
