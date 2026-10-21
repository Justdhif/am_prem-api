import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../infrastructure/security/tokenService.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
  userRole?: 'user' | 'admin';
}

export const userAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Sesi login tidak ditemukan. Harap login terlebih dahulu.',
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = TokenService.verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Sesi login telah berakhir atau token tidak valid. Silakan login kembali.',
    });
    return;
  }

  req.userId = payload.userId;
  req.userEmail = payload.email;
  req.userRole = payload.role;

  next();
};
