import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './presentation/routes/index.js';
import { config } from './infrastructure/config/index.js';
import { generalLimiter } from './presentation/middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler.js';

import { container } from './infrastructure/container.js';

export function createApp(): Application {
  const app: Application = express();

  // Matikan header server signature X-Powered-By
  app.disable('x-powered-by');

  // Keamanan HTTP Headers dengan Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false,
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
      author: 'Justdhif',
      timestamp: new Date().toISOString(),
    });
  });

  // Web Dashboard info endpoint (mengarahkan ke frontend Next.js)
  app.get('/dashboard', async (_req: Request, res: Response) => {
    const stats = await container.statsRepository.getStats().catch(() => undefined);
    res.status(200).json({
      service: 'alight-motion-premium-api',
      name: 'Alight Motion Pro API Dashboard',
      author: 'Justdhif',
      webUrl: process.env.WEB_URL || 'http://localhost:3001',
      stats: stats || { totalPremium: 0, todayPremium: 0 },
      message: 'Frontend dashboard Next.js dapat diakses di http://localhost:3001',
    });
  });

  // Sajikan static public assets (misal logo.jpg)
  app.use(express.static('public'));
  app.get('/logo.jpg', (_req: Request, res: Response) => {
    res.sendFile('public/logo.jpg', { root: process.cwd() });
  });

  app.get('/logo.svg', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.sendFile('public/logo.svg', { root: process.cwd() });
  });

  // Root welcome & info endpoint
  app.get('/', async (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Alight Motion Premium Generator & API by Justdhif',
      version: '1.0.0',
      author: 'Justdhif',
      repository: 'https://github.com/Justdhif/am_prem-api',
      description: 'Web Generator & TypeScript REST API Service for Alight Motion Pro VIP Activation & Verification',
      architecture: 'Clean Architecture (Domain, Application, Infrastructure, Presentation)',
      environment: config.nodeEnv,
      webApp: process.env.WEB_URL || 'http://localhost:3001',
      security: {
        rateLimiting: 'Active',
        payloadLimit: '10kb',
        helmetHeaders: 'Active',
        apiKeyProtected: Boolean(config.security.apiSecretKey),
      },
      endpoints: {
        dashboard: 'GET /dashboard',
        health: 'GET /health',
        alightMotion: {
          sendLink: 'POST /api/am/send-link',
          verifyLink: 'POST /api/am/verify',
          command: 'POST /api/am/command',
          findPreset: 'POST /api/am/preset/find',
        },
      },
    });
  });

  // Pasang rute API utama
  app.use('/api', routes);

  // 404 Handler untuk route yang tidak ditemukan
  app.use(notFoundHandler);

  // Centralized Error Handler (dengan sanitasi kredensial)
  app.use(errorHandler);

  return app;
}
