import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './presentation/routes/index.js';
import { config } from './infrastructure/config/index.js';
import { generalLimiter } from './presentation/middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler.js';

export function createApp(): Application {
  const app: Application = express();

  // Matikan header server signature X-Powered-By
  app.disable('x-powered-by');

  // Keamanan HTTP Headers dengan Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // API biasanya tidak memerlukan CSP browser
      crossOriginEmbedderPolicy: false,
    })
  );

  // Konfigurasi CORS dengan origin yang dapat dibatasi via environment
  const corsOrigin = config.security.corsOrigin;
  app.use(
    cors({
      origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-session-id', 'x-sender-id'],
      maxAge: 86400, // Cache preflight response 24 jam
    })
  );

  // Batasi ukuran payload untuk mencegah Denial of Service (DoS) memory exhaustion
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Logging hanya aktif di luar mode testing
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Terapkan rate limiter umum untuk semua rute
  app.use(generalLimiter);

  // Health check endpoint (bebas auth & rate limiter)
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'ok',
      service: 'alight-motion-premium-api',
      timestamp: new Date().toISOString(),
    });
  });

  // Root welcome & info endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Alight Motion Premium API',
      version: '1.0.0',
      description: 'TypeScript REST API Service for Alight Motion Pro VIP Activation & Magic Link Verification',
      architecture: 'Clean Architecture (Domain, Application, Infrastructure, Presentation)',
      security: {
        rateLimiting: 'Active',
        payloadLimit: '10kb',
        helmetHeaders: 'Active',
        apiKeyProtected: Boolean(config.security.apiSecretKey),
      },
      endpoints: {
        health: 'GET /health',
        sendLink: 'POST /api/am/send-link',
        verifyLink: 'POST /api/am/verify',
        command: 'POST /api/am/command',
        stats: 'GET /api/am/stats',
        help: 'GET /api/am/help',
      },
      documentation: '/api/am/help',
    });
  });

  // Mount API routes under /api
  app.use('/api', routes);

  // Fallback 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}
