import { Request, Response, NextFunction } from 'express';
import { config } from '../../infrastructure/config/index.js';

/**
 * Membersihkan pesan error dari kemungkinan bocornya API key atau endpoint internal
 */
const sanitizeErrorMessage = (msg: string): string => {
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

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error di console server untuk debugging
  console.error('[Unhandled Error]', err);

  const statusCode = err.statusCode || err.status || 500;
  const rawMessage = err.message || 'Internal Server Error';
  const safeMessage = sanitizeErrorMessage(rawMessage);

  res.status(statusCode).json({
    success: false,
    message: safeMessage,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
