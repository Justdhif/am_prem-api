import { Request, Response } from 'express';
import { container } from '../../infrastructure/container.js';
import { AuthenticatedRequest } from '../middlewares/userAuth.js';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Username, email, dan kata sandi wajib diisi.',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Kata sandi minimal 6 karakter.',
        });
        return;
      }

      const result = await container.registerUseCase.execute({
        username,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Registrasi akun berhasil! Silakan pilih paket langganan Anda.',
        token: result.token,
        data: result.user,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Registrasi gagal.',
      });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, email, username, password } = req.body;
      const id = identifier || email || username;

      if (!id || !password) {
        res.status(400).json({
          success: false,
          message: 'Email/Username dan kata sandi wajib diisi.',
        });
        return;
      }

      const result = await container.loginUseCase.execute({
        identifier: id,
        password,
      });

      res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        token: result.token,
        data: result.user,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message || 'Login gagal.',
      });
    }
  }

  public async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await container.getProfileUseCase.execute(req.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (err: any) {
      res.status(404).json({
        success: false,
        message: err.message || 'Akun tidak ditemukan.',
      });
    }
  }
}

export const authController = new AuthController();
