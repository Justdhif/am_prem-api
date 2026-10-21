import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../../infrastructure/config/index.js';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const configuredKey = config.security.apiSecretKey;

  // Jika API_SECRET_KEY tidak disetel di .env, lewati proteksi (mode publik)
  if (!configuredKey) {
    return next();
  }

  // Ambil API key dari header x-api-key atau Authorization: Bearer <key>
  const headerApiKey = req.headers['x-api-key'];
  let providedKey = typeof headerApiKey === 'string' ? headerApiKey.trim() : '';

  if (!providedKey) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      providedKey = authHeader.substring(7).trim();
    }
  }

  if (!providedKey) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Akses ditolak. Harap sertakan API Key pada header x-api-key atau Authorization.',
    });
    return;
  }

  // Gunakan timingSafeEqual untuk mencegah timing attack
  try {
    const providedBuffer = Buffer.from(providedKey);
    const configuredBuffer = Buffer.from(configuredKey);

    if (
      providedBuffer.length !== configuredBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, configuredBuffer)
    ) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: API Key yang Anda gunakan tidak valid.',
      });
      return;
    }
  } catch {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Verifikasi API Key gagal.',
    });
    return;
  }

  next();
};
