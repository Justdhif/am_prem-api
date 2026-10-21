import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { PasswordHasher } from '../../../infrastructure/security/passwordHasher.js';
import { UserProfileResponse } from '../../../domain/entities/Billing.js';
import { formatUserProfile } from '../auth/GetProfileUseCase.js';

export class RegenerateApiKeyUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: string): Promise<UserProfileResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan.');
    }

    const newApiKey = PasswordHasher.generateApiKey();

    const updatedUser = await this.userRepository.update(user.id, {
      apiKey: newApiKey,
    });

    if (!updatedUser) {
      throw new Error('Gagal memperbarui API Key.');
    }

    return formatUserProfile(updatedUser);
  }
}
