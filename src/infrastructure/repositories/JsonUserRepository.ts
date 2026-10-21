import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserAccount } from '../../domain/entities/Billing.js';
import { config } from '../config/index.js';

export class JsonUserRepository implements IUserRepository {
  private memoryUsers: Map<string, UserAccount> = new Map();
  private isLoaded = false;

  private ensureDirectoryExists(filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadUsers(): void {
    if (this.isLoaded) return;

    try {
      if (fs.existsSync(config.usersFilePath)) {
        const raw = fs.readFileSync(config.usersFilePath, 'utf8').trim();
        if (raw) {
          const list = JSON.parse(raw) as UserAccount[];
          this.memoryUsers.clear();
          for (const user of list) {
            this.memoryUsers.set(user.id, user);
          }
          this.isLoaded = true;
          return;
        }
      }
    } catch {
      // Fallback to in-memory
    }

    this.isLoaded = true;
    this.saveUsers();
  }

  private saveUsers(): void {
    try {
      this.ensureDirectoryExists(config.usersFilePath);
      const list = Array.from(this.memoryUsers.values());
      fs.writeFileSync(config.usersFilePath, JSON.stringify(list, null, 2), 'utf8');
    } catch {
      // Keep in memory if write fails (e.g. Vercel read-only filesystem)
    }
  }

  public async findByEmail(email: string): Promise<UserAccount | null> {
    this.loadUsers();
    const normalized = email.trim().toLowerCase();
    for (const user of this.memoryUsers.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  }

  public async findByUsername(username: string): Promise<UserAccount | null> {
    this.loadUsers();
    const normalized = username.trim().toLowerCase();
    for (const user of this.memoryUsers.values()) {
      if (user.username.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  }

  public async findById(id: string): Promise<UserAccount | null> {
    this.loadUsers();
    return this.memoryUsers.get(id) || null;
  }

  public async findByApiKey(apiKey: string): Promise<UserAccount | null> {
    this.loadUsers();
    const normalized = apiKey.trim();
    for (const user of this.memoryUsers.values()) {
      if (user.apiKey === normalized) {
        return user;
      }
    }
    return null;
  }

  public async create(
    userData: Omit<UserAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<UserAccount> {
    this.loadUsers();
    const now = new Date().toISOString();
    const newUser: UserAccount = {
      ...userData,
      id: 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      createdAt: now,
      updatedAt: now,
    };

    this.memoryUsers.set(newUser.id, newUser);
    this.saveUsers();
    return newUser;
  }

  public async update(id: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
    this.loadUsers();
    const existing = this.memoryUsers.get(id);
    if (!existing) return null;

    const updatedUser: UserAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.memoryUsers.set(id, updatedUser);
    this.saveUsers();
    return updatedUser;
  }

  public async getAll(): Promise<UserAccount[]> {
    this.loadUsers();
    return Array.from(this.memoryUsers.values());
  }
}
