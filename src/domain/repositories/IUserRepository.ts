import { UserAccount } from '../entities/Billing.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserAccount | null>;
  findByUsername(username: string): Promise<UserAccount | null>;
  findById(id: string): Promise<UserAccount | null>;
  findByApiKey(apiKey: string): Promise<UserAccount | null>;
  create(user: Omit<UserAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserAccount>;
  update(id: string, updates: Partial<UserAccount>): Promise<UserAccount | null>;
  getAll(): Promise<UserAccount[]>;
}
