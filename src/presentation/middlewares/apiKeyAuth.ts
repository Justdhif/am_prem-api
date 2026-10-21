import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/container.js';
import { config } from '../../infrastructure/config/index.js';

export interface ApiKeyRequest extends Request {
  apiKeyUser?: any;
  isAdmin?: boolean;
}

/**
 * Ekstrak API key dari header x-api-key atau Authorization: Bearer
 */
function extractProvidedKey(req: Request): string {
  const headerApiKey = req.headers['x-api-key'];
  if (typeof headerApiKey === 'string' && headerApiKey.trim()) {
    return headerApiKey.trim();
  }

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token.startsWith('am_live_') || (config.security.apiSecretKey && token === config.security.apiSecretKey)) {
      return token;
    }
  }

  return '';
}

/**
 * Middleware WAJIB Access Key:
 * Menolak request jika Access Key tidak disertakan, tidak valid, atau masa aktif paketnya sudah kadaluarsa.
 */
export const requireApiKey = async (
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const providedKey = extractProvidedKey(req);

  if (!providedKey) {
    res.status(401).json({
      success: false,
      message:
        'Unauthorized: Akses ditolak. Harap sertakan Access Key aktif pada header x-api-key atau Authorization: Bearer <access_key>. Dapatkan Access Key dengan berlangganan paket di web dashboard.',
    });
    return;
  }

  // Validasi kunci (apakah master key atau user access key dengan paket aktif)
  const validation = await container.validateApiKeyUseCase.execute(providedKey);

  if (!validation.valid) {
    res.status(403).json({
      success: false,
      message: validation.error || 'Forbidden: Access Key tidak valid atau telah kadaluarsa. Silakan perpanjang paket langganan Anda.',
      expiresAt: validation.expiresAtFormatted || undefined,
    });
    return;
  }

  req.apiKeyUser = validation.user;
  req.isAdmin = validation.isAdmin;

  next();
};

/**
 * Middleware OPSIONAL Access Key:
 * Jika disertakan, divalidasi. Jika tidak disertakan, request tetap diperbolehkan (misal untuk statistik atau bantuan).
 */
export const optionalApiKey = async (
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const providedKey = extractProvidedKey(req);

  if (!providedKey) {
    return next();
  }

  const validation = await container.validateApiKeyUseCase.execute(providedKey);
  if (validation.valid) {
    req.apiKeyUser = validation.user;
    req.isAdmin = validation.isAdmin;
  }

  next();
};

// Default export untuk backward-compatibility
export const apiKeyAuth = requireApiKey;
