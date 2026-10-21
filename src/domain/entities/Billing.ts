export type PlanType = 'weekly' | 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'none';

export interface PlanConfig {
  id: PlanType;
  name: string;
  durationDays: number;
  priceFormatted: string;
  priceNumber: number;
  description: string;
  features: string[];
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  weekly: {
    id: 'weekly',
    name: 'Paket Mingguan',
    durationDays: 7,
    priceFormatted: 'Rp 15.000',
    priceNumber: 15000,
    description: 'Cocok untuk kebutuhan aktivasi cepat atau proyek jangka pendek.',
    features: [
      'Access Key aktif selama 7 hari',
      'Akses penuh seluruh endpoint API',
      'Aktivasi Alight Motion Pro VIP 1 Tahun',
      'Prioritas Rate Limit tinggi',
      'Integrasi Bot WhatsApp & Web',
    ],
  },
  monthly: {
    id: 'monthly',
    name: 'Paket Bulanan',
    durationDays: 30,
    priceFormatted: 'Rp 45.000',
    priceNumber: 45000,
    description: 'Paling populer untuk kreator, bot admin, dan reseller.',
    features: [
      'Access Key aktif selama 30 hari',
      'Akses penuh seluruh endpoint API',
      'Aktivasi Alight Motion Pro VIP 1 Tahun',
      'Prioritas Rate Limit & Fast Gateway',
      'Dukungan Webhook & Multi-Client',
      'Hemat 25% dibanding mingguan',
    ],
  },
  yearly: {
    id: 'yearly',
    name: 'Paket Tahunan',
    durationDays: 365,
    priceFormatted: 'Rp 150.000',
    priceNumber: 15000,
    description: 'Solusi hemat maksimal untuk bisnis dan layanan bot skala besar.',
    features: [
      'Access Key aktif selama 365 hari',
      'Akses tanpa batas seluruh endpoint API',
      'Aktivasi Alight Motion Pro VIP 1 Tahun',
      'Bypass Rate Limit (Akses VIP)',
      'Akses endpoint Admin & Pelaporan',
      'Hemat lebih dari 70%',
    ],
  },
};

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  apiKey: string;
  plan: PlanType | 'none';
  planExpiresAt: number | null; // Unix timestamp ms
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  apiKey: string;
  plan: PlanType | 'none';
  planName: string;
  planExpiresAt: string | null;
  isExpired: boolean;
  daysRemaining: number;
  status: SubscriptionStatus;
}
