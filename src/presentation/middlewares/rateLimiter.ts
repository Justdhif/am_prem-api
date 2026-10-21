import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../../infrastructure/config/index.js';

const isTestEnv = process.env.NODE_ENV === 'test';

const createStandardLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: isTestEnv ? 1000 : options.max,
    standardHeaders: true, // Kembalikan info rate limit di headers `RateLimit-*`
    legacyHeaders: false, // Nonaktifkan headers `X-RateLimit-*` lama
    skip: () => isTestEnv,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message: options.message,
      });
    },
  });
};

/**
 * Rate limiter umum untuk seluruh endpoint API
 */
export const generalLimiter = createStandardLimiter({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMax,
  message: 'Terlalu banyak permintaan ke API. Silakan coba lagi nanti.',
});

/**
 * Rate limiter ketat untuk pengiriman link verifikasi (cegah spam email & aborsi kuota Firebase)
 */
export const sendLinkLimiter = createStandardLimiter({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: config.security.sendLinkLimitMax,
  message: 'Terlalu banyak permintaan pengiriman link ke email ini. Silakan tunggu 5 menit.',
});

/**
 * Rate limiter untuk proses verifikasi (cegah brute-force kode oobCode)
 */
export const verifyLimiter = createStandardLimiter({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: config.security.verifyLimitMax,
  message: 'Terlalu banyak percobaan verifikasi. Silakan tunggu 5 menit.',
});

/**
 * Rate limiter untuk command bot
 */
export const commandLimiter = createStandardLimiter({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 15,
  message: 'Terlalu banyak perintah bot yang dikirim. Mohon beri jeda beberapa saat.',
});
