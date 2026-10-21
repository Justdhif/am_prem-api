import crypto from 'crypto';
import { config } from '../config/index.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  exp: number; // timestamp ms
}

export class TokenService {
  private static getSecret(): string {
    return config.security.apiSecretKey || 'justdhif_am_prem_secure_jwt_secret_key_2026';
  }

  public static generateToken(userId: string, email: string, role: 'user' | 'admin', expiresInDays = 30): string {
    const payload: TokenPayload = {
      userId,
      email,
      role,
      exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    };

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', this.getSecret())
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  public static verifyToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, body, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', this.getSecret())
        .update(`${header}.${body}`)
        .digest('base64url');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;

      if (Date.now() > payload.exp) {
        return null; // Expired
      }

      return payload;
    } catch {
      return null;
    }
  }
}
