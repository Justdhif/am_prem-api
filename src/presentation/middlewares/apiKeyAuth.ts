import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/container.js';
import { config } from '../../infrastructure/config/index.js';

export interface ApiKeyRequest extends Request {
  apiKeyUser?: any;
  isAdmin?: boolean;
}

export const apiKeyAuth = async (
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const headerApiKey = req.headers['x-api-key'];
  let providedKey = typeof headerApiKey === 'string' ? headerApiKey.trim() : '';

  if (!providedKey) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token.startsWith('am_live_') || (config.security.apiSecretKey && token === config.security.apiSecretKey)) {
        providedKey = token;
      }
    }
  }

  // Jika tidak menyertakan Access Key
  if (!providedKey) {
    // Jika sistem mewajibkan API Key (misal konfigurasi API_SECRET_KEY diaktifkan)
    if (config.security.apiSecretKey) {
      res.status(401).json({
        success: false,
        message:
          'Unauthorized: Akses ditolak. Harap sertakan Access Key aktif pada header x-api-key atau Authorization: Bearer <access_key>.',
      });
      return;
    }
    // Jika tidak diwajibkan secara global, lewati
    return next();
  }

  // Validasi kunci (apakah master key atau user access key dengan paket aktif)
  const validation = await container.validateApiKeyUseCase.execute(providedKey);

  if (!validation.valid) {
    res.status(403).json({
      success: false,
      message: validation.error || 'Forbidden: Access Key tidak valid atau telah kadaluarsa.',
      expiresAt: validation.expiresAtFormatted || undefined,
    });
    return;
  }

  req.apiKeyUser = validation.user;
  req.isAdmin = validation.isAdmin;

  next();
};
