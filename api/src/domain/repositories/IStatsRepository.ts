import { StatsData } from '../entities/Stats.js';

export interface IStatsRepository {
  getStats(): Promise<StatsData>;
  incrementStats(): Promise<StatsData>;
}
