import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { PlanType, PLAN_CONFIGS, UserProfileResponse } from '../../../domain/entities/Billing.js';
import { formatUserProfile } from '../auth/GetProfileUseCase.js';

export interface SubscribeInput {
  userId: string;
  plan: PlanType;
}

export class SubscribePlanUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: SubscribeInput): Promise<UserProfileResponse> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan.');
    }

    const planConfig = PLAN_CONFIGS[input.plan];
    if (!planConfig) {
      throw new Error(`Paket '${input.plan}' tidak valid. Pilihan: weekly, monthly, yearly.`);
    }

    const durationMs = planConfig.durationDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Jika paket saat ini masih aktif dan belum expired, perpanjang dari tanggal expired lama
    let newExpiresAt: number;
    if (user.planExpiresAt && user.planExpiresAt > now) {
      newExpiresAt = user.planExpiresAt + durationMs;
    } else {
      newExpiresAt = now + durationMs;
    }

    const updatedUser = await this.userRepository.update(user.id, {
      plan: input.plan,
      planExpiresAt: newExpiresAt,
    });

    if (!updatedUser) {
      throw new Error('Gagal memperbarui langganan.');
    }

    return formatUserProfile(updatedUser);
  }
}
