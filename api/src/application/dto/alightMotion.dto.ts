import { AlightMotionUser } from '../../domain/entities/User.js';
import { StatsData } from '../../domain/entities/Stats.js';

export interface SendLinkInputDto {
  email: string;
  sessionId?: string;
  senderId?: string;
  clientIp?: string;
}

export interface SendLinkOutputDto {
  email: string;
  sessionId: string;
  message: string;
  formattedText: string;
}

export interface VerifyLinkInputDto {
  link: string;
  email?: string;
  sessionId?: string;
  senderId?: string;
  clientIp?: string;
}

export interface VerifyLinkOutputDto {
  isPremium: boolean;
  message: string;
  userData: AlightMotionUser;
  formattedText: string;
  premiumError?: string | null;
}

export interface DailyStatItem {
  date: string;
  count: number;
}

export interface GetStatsOutputDto {
  totalPremium: number;
  todayPremium: number;
  status: string;
  formattedText: string;
  history?: DailyStatItem[];
}

export interface BotCommandInputDto {
  text: string;
  senderId?: string;
  jid?: string;
  clientIp?: string;
}

export interface BotCommandOutputDto {
  success: boolean;
  command: string;
  replyText: string;
  data?: any;
  error?: string;
}

export interface ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  formattedText?: string;
  sessionId?: string;
  isPremium?: boolean;
}
