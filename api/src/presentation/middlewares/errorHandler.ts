import { Request, Response, NextFunction } from 'express';
import { config } from '../../infrastructure/config/index.js';

/**
 * Membersihkan pesan error dari kemungkinan bocornya API key atau endpoint internal
 */
export const sanitizeErrorMessage = (msg: string): string => {
  if (!msg || typeof msg !== 'string') return 'Internal Server Error';

  let sanitized = msg;
  if (config.firebase.apiKey) {
    sanitized = sanitized.split(config.firebase.apiKey).join('[REDACTED_API_KEY]');
  }
  if (config.alightMotion.purchaseToken) {
    sanitized = sanitized.split(config.alightMotion.purchaseToken).join('[REDACTED_TOKEN]');
  }
  if (config.firebase.instanceIdToken) {
    sanitized = sanitized.split(config.firebase.instanceIdToken).join('[REDACTED_TOKEN]');
  }

  return sanitized;
};

export interface ErrorDetail {
  statusCode: number;
  message: string;
  error: string;
}

/**
 * Mengklasifikasikan error menjadi status code HTTP yang sesuai (400, 429, 500)
 */
export function classifyError(err: any, fallbackStatus = 500): ErrorDetail {
  const rawMsg = err?.message || (typeof err === 'string' ? err : 'Internal Server Error');
  const safeMsg = sanitizeErrorMessage(rawMsg);
  const lower = rawMsg.toLowerCase();

  // 1. Explicit status code bila sudah diset sebelumnya
  if (err?.statusCode && typeof err.statusCode === 'number') {
    return {
      statusCode: err.statusCode,
      message: safeMsg,
      error: err.error || (err.statusCode >= 500 ? 'Internal Server Error' : safeMsg),
    };
  }

  if (err?.status && typeof err.status === 'number' && err.status >= 400 && err.status <= 599) {
    return {
      statusCode: err.status,
      message: safeMsg,
      error: err.error || (err.status >= 500 ? 'Internal Server Error' : safeMsg),
    };
  }

  // 2. Status 429 Too Many Requests (Rate limit / Quota exceeded / Spammed)
  if (
    lower.includes('rate limit') ||
    lower.includes('too many') ||
    lower.includes('terlalu banyak') ||
    lower.includes('quota') ||
    lower.includes('kuota') ||
    lower.includes('attempts') ||
    lower.includes('limit reached')
  ) {
    return {
      statusCode: 429,
      message: safeMsg,
      error: 'Rate limit exceeded',
    };
  }

  // 3. Status 400 Bad Request (Validasi input, link expired/invalid, missing argument)
  if (
    lower.includes('tidak valid') ||
    lower.includes('invalid') ||
    lower.includes('format') ||
    lower.includes('wajib') ||
    lower.includes('required') ||
    lower.includes('kadaluarsa') ||
    lower.includes('expired') ||
    lower.includes('belum lengkap') ||
    lower.includes('sertakan') ||
    lower.includes('tidak didukung') ||
    lower.includes('unsupported') ||
    lower.includes('unknown') ||
    lower.includes('tidak ditemukan') ||
    lower.includes('terlalu panjang')
  ) {
    return {
      statusCode: 400,
      message: safeMsg,
      error: err?.error || safeMsg,
    };
  }

  // 4. Default ke fallback status (misal 500 Internal Server Error)
  const is5xx = fallbackStatus >= 500;
  return {
    statusCode: fallbackStatus,
    message: is5xx ? 'Terjadi kendala pada internal server atau gateway layanan.' : safeMsg,
    error: err?.error || (is5xx ? 'Internal Server Error' : safeMsg),
  };
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error di console server untuk debugging
  console.error('[Unhandled Error]', err);

  const detail = classifyError(err, err.statusCode || err.status || 500);

  res.status(detail.statusCode).json({
    success: false,
    message: detail.message,
    error: detail.error,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: 'Not Found',
  });
};
