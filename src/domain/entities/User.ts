import { StatsData } from './Stats.js';

export interface AlightMotionUser {
  uid: string;
  email: string;
  displayName: string | null;
  isNewUser: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  membershipStatus: 'PREMIUM_ACTIVE' | 'LOGIN_ONLY';
  tier: string;
  subscription: string;
  orderId: string | null;
  activatedAt: string;
  validUntil: string;
  stats: StatsData;
}
