import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { UserAccount, UserProfileResponse, PLAN_CONFIGS } from '../../../domain/entities/Billing.js';

export function formatUserProfile(user: UserAccount): UserProfileResponse {
  const now = Date.now();
  const isExpired = !user.planExpiresAt || user.planExpiresAt < now;
  const daysRemaining = user.planExpiresAt && user.planExpiresAt > now
    ? Math.ceil((user.planExpiresAt - now) / (1000 * 60 * 60 * 24))
    : 0;

  const planName = user.plan !== 'none' && PLAN_CONFIGS[user.plan]
    ? PLAN_CONFIGS[user.plan].name
    : 'Belum Berlangganan';

  const status = user.plan === 'none'
    ? 'none'
    : isExpired
    ? 'expired'
    : 'active';

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    apiKey: user.apiKey,
    plan: user.plan,
    planName,
    planExpiresAt: user.planExpiresAt ? new Date(user.planExpiresAt).toISOString() : null,
    isExpired,
    daysRemaining,
    status,
  };
}

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: string): Promise<UserProfileResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Akun pengguna tidak ditemukan.');
    }

    return formatUserProfile(user);
  }
}
