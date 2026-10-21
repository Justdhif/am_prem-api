import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { PasswordHasher } from '../../../infrastructure/security/passwordHasher.js';
import { TokenService } from '../../../infrastructure/security/tokenService.js';
import { UserProfileResponse, PLAN_CONFIGS } from '../../../domain/entities/Billing.js';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface AuthOutput {
  token: string;
  user: UserProfileResponse;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: RegisterInput): Promise<AuthOutput> {
    const username = input.username.trim().toLowerCase();
    const email = input.email.trim().toLowerCase();

    // Cek username
    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error(`Username '${username}' sudah digunakan.`);
    }

    // Cek email
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error(`Email '${email}' sudah terdaftar.`);
    }

    const { hash, salt } = PasswordHasher.hashPassword(input.password);
    const apiKey = PasswordHasher.generateApiKey();

    const user = await this.userRepository.create({
      username,
      email,
      passwordHash: hash,
      salt,
      role: 'user',
      apiKey,
      plan: 'none',
      planExpiresAt: null,
    });

    const token = TokenService.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        apiKey: user.apiKey,
        plan: user.plan,
        planName: 'Belum Berlangganan',
        planExpiresAt: null,
        isExpired: true,
        daysRemaining: 0,
        status: 'none',
      },
    };
  }
}
