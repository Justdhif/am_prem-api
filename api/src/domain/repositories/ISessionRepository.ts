export interface ISessionRepository {
  generateSessionId(): string;
  setSession(key: string, email: string, ttlMs?: number): void;
  getSession(key: string): string | null;
  deleteSession(key: string): boolean;
  cleanupExpired(): void;
}
