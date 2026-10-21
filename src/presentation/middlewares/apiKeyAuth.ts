import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../../infrastructure/config/index.js';

/**
 * Middleware Autentikasi API Key (Opsional / Global Secret Key):
 * - Jika `API_SECRET_KEY` diatur di environment, request wajib menyertakan kunci yang cocok pada header `x-api-key` atau `Authorization: Bearer <key>`.
 * - Jika `API_SECRET_KEY` tidak diatur (dikosongkan), API dan Web Generator dapat diakses secara publik dan bebas.
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const secretKey = config.security.apiSecretKey;

  // Jika API_SECRET_KEY tidak disetel di .env, lewati pemeriksaan (Akses Publik Bebas)
  if (!secretKey) {
    return next();
  }

  const headerKey = req.headers['x-api-key'];
  let clientKey = typeof headerKey === 'string' ? headerKey.trim() : '';

  if (!clientKey) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      clientKey = authHeader.substring(7).trim();
    }
  }

  if (!clientKey) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Akses ditolak. Harap sertakan API Key pada header x-api-key atau Bearer token.',
    });
    return;
  }

  const clientKeyBuffer = Buffer.from(clientKey);
  const secretKeyBuffer = Buffer.from(secretKey);

  if (
    clientKeyBuffer.length !== secretKeyBuffer.length ||
    !crypto.timingSafeEqual(clientKeyBuffer, secretKeyBuffer)
  ) {
    res.status(403).json({
      success: false,
      message: 'Forbidden: API Key yang diberikan tidak valid.',
    });
    return;
  }

  next();
};

export const requireApiKey = apiKeyAuth;
export const optionalApiKey = (_req: Request, _res: Response, next: NextFunction): void => next();
