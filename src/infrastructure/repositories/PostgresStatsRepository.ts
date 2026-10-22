import pg from 'pg';
import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { StatsData } from '../../domain/entities/Stats.js';
import { config } from '../config/index.js';
import { FileStatsRepository } from './FileStatsRepository.js';

export class PostgresStatsRepository implements IStatsRepository {
  private pool: pg.Pool | null = null;
  private isTableInitialized = false;
  private readonly fallbackRepo: FileStatsRepository;

  constructor() {
    this.fallbackRepo = new FileStatsRepository();

    if (config.database.url) {
      this.pool = new pg.Pool({
        connectionString: config.database.url,
        ssl: { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 8000,
      });

      // Tangani error koneksi tak terduga pada pool
      this.pool.on('error', (err) => {
        console.warn('⚠️ Postgres Pool Warning:', err.message);
      });
    }
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private async ensureTable(): Promise<void> {
    if (this.isTableInitialized || !this.pool) return;

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
      await this.pool.query(query);
      this.isTableInitialized = true;
    } catch (err: any) {
      console.warn('⚠️ Gagal inisialisasi tabel Postgres, beralih ke fallback lokal:', err.message);
    }
  }

  public async getStats(): Promise<StatsData> {
    if (!this.pool) {
      return this.fallbackRepo.getStats();
    }

    try {
      await this.ensureTable();
      const today = this.getTodayDateString();

      const result = await this.pool.query(
        'SELECT total_premium, today_premium, last_date FROM app_stats WHERE id = $1',
        ['global_stats']
      );

      if (result.rows.length === 0) {
        return this.fallbackRepo.getStats();
      }

      const row = result.rows[0];
      let todayCount = row.today_premium;

      // Jika tanggal sudah berganti (hari baru), reset hitungan hari ini ke 0
      if (row.last_date !== today) {
        todayCount = 0;
        await this.pool.query(
          'UPDATE app_stats SET today_premium = 0, last_date = $1 WHERE id = $2',
          [today, 'global_stats']
        );
      }

      return {
        total: row.total_premium,
        today: todayCount,
      };
    } catch (err: any) {
      console.warn('⚠️ Postgres getStats gagal, menggunakan fallback:', err.message);
      return this.fallbackRepo.getStats();
    }
  }

  public async incrementStats(): Promise<StatsData> {
    if (!this.pool) {
      return this.fallbackRepo.incrementStats();
    }

    try {
      await this.ensureTable();
      const today = this.getTodayDateString();

      const updateQuery = `
        UPDATE app_stats
        SET 
          total_premium = total_premium + 1,
          today_premium = CASE WHEN last_date = $1 THEN today_premium + 1 ELSE 1 END,
          last_date = $1
        WHERE id = 'global_stats'
        RETURNING total_premium, today_premium;
      `;

      const result = await this.pool.query(updateQuery, [today]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        // Sinkronkan juga ke fallback repository lokal
        this.fallbackRepo.syncWithValues(row.total_premium, row.today_premium);
        return {
          total: row.total_premium,
          today: row.today_premium,
        };
      }

      return this.fallbackRepo.incrementStats();
    } catch (err: any) {
      console.warn('⚠️ Postgres incrementStats gagal, menggunakan fallback:', err.message);
      return this.fallbackRepo.incrementStats();
    }
  }
}


