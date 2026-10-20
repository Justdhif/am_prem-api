import { StatsData } from '../entities/Stats.js';

export interface IStatsRepository {
  getStats(): StatsData;
  incrementStats(): StatsData;
}
