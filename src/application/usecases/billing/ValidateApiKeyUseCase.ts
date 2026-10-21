import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { UserAccount } from '../../../domain/entities/Billing.js';
import { config } from '../../../infrastructure/config/index.js';

export interface ValidateApiKeyResult {
  valid: boolean;
  isAdmin: boolean;
  user?: UserAccount;
  error?: string;
  expiresAtFormatted?: string;
}

export class ValidateApiKeyUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(apiKey: string): Promise<ValidateApiKeyResult> {
    const key = apiKey.trim();

    // 1. Cek apakah cocok dengan Master API Secret Key (Admin Master Key)
    if (config.security.apiSecretKey && key === config.security.apiSecretKey) {
      return {
        valid: true,
        isAdmin: true,
      };
    }

    // 2. Cari di database user berdasarkan Access Key
    const user = await this.userRepository.findByApiKey(key);
    if (!user) {
      return {
        valid: false,
        isAdmin: false,
        error: 'Access Key tidak valid atau tidak terdaftar.',
      };
    }

    // 3. Cek apakah user belum berlangganan sama sekali
    if (user.plan === 'none' || !user.planExpiresAt) {
      return {
        valid: false,
        isAdmin: false,
        user,
        error: 'Akun Anda belum memiliki paket langganan aktif. Silakan pilih paket di dashboard billing.',
      };
    }

    // 4. Cek apakah masa berlaku paket langganan sudah habis
    const now = Date.now();
    if (user.planExpiresAt < now) {
      const expiredDateStr = new Date(user.planExpiresAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return {
        valid: false,
        isAdmin: false,
        user,
        expiresAtFormatted: expiredDateStr,
        error: `Masa aktif paket langganan Anda telah habis pada ${expiredDateStr}. Silakan perpanjang paket untuk mengaktifkan kembali Access Key Anda.`,
      };
    }

    return {
      valid: true,
      isAdmin: user.role === 'admin',
      user,
    };
  }
}
