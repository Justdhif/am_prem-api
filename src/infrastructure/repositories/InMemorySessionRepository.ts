import crypto from 'crypto';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository.js';
import { PendingSession } from '../../domain/entities/Session.js';

export class InMemorySessionRepository implements ISessionRepository {
  private sessions = new Map<string, PendingSession>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly defaultTtlMs = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);

    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  public generateSessionId(): string {
    return 'am_sess_' + crypto.randomBytes(8).toString('hex');
  }

  public setSession(key: string, email: string, ttlMs = this.defaultTtlMs): void {
    if (!key || !email) return;
    const normalizedKey = key.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const now = Date.now();

    this.sessions.set(normalizedKey, {
      email: normalizedEmail,
      createdAt: now,
      expiresAt: now + ttlMs,
    });
  }

  public getSession(key: string): string | null {
    if (!key) return null;
    const normalizedKey = key.trim().toLowerCase();
    const session = this.sessions.get(normalizedKey);

    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(normalizedKey);
      return null;
    }

    return session.email;
  }

  public deleteSession(key: string): boolean {
    if (!key) return false;
    return this.sessions.delete(key.trim().toLowerCase());
  }

  public cleanupExpired(): void {
    const now = Date.now();
    for (const [key, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(key);
      }
    }
  }

  public clearAll(): void {
    this.sessions.clear();
  }

  public count(): number {
    return this.sessions.size;
  }
}
