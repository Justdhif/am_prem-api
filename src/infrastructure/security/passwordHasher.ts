import crypto from 'crypto';

export class PasswordHasher {
  public static hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return { hash, salt };
  }

  public static verifyPassword(password: string, hash: string, salt: string): boolean {
    const calculatedHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash),
      Buffer.from(hash)
    );
  }

  public static generateApiKey(): string {
    return 'am_live_' + crypto.randomBytes(18).toString('hex');
  }
}
