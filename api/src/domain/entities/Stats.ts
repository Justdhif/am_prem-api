export interface DailyStatItem {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface StatsData {
  total: number;
  today: number;
  history?: DailyStatItem[];
}

export interface StoredStats {
  totalPremium: number;
  todayPremium: number;
  lastDate: string;
  history?: Record<string, number>;
}
