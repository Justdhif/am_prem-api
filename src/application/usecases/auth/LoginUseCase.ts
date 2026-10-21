import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { PasswordHasher } from '../../../infrastructure/security/passwordHasher.js';
import { TokenService } from '../../../infrastructure/security/tokenService.js';
import { UserProfileResponse, PLAN_CONFIGS } from '../../../domain/entities/Billing.js';
import { formatUserProfile } from './GetProfileUseCase.js';

export interface LoginInput {
  identifier: string; // email atau username
  password: string;
}

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: LoginInput): Promise<{ token: string; user: UserProfileResponse }> {
    const identifier = input.identifier.trim().toLowerCase();

    // Cari by email atau by username
    let user = await this.userRepository.findByEmail(identifier);
    if (!user) {
      user = await this.userRepository.findByUsername(identifier);
    }

    if (!user) {
      throw new Error('Email atau username tidak ditemukan.');
    }

    const isPasswordValid = PasswordHasher.verifyPassword(
      input.password,
      user.passwordHash,
      user.salt
    );

    if (!isPasswordValid) {
      throw new Error('Kata sandi salah.');
    }

    const token = TokenService.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: formatUserProfile(user),
    };
  }
}
