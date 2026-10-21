import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './presentation/routes/index.js';
import { config } from './infrastructure/config/index.js';
import { generalLimiter } from './presentation/middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler.js';
import { renderDashboardHtml } from './presentation/views/dashboardHtml.js';

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

  // Web Dashboard & Generator Route
  app.get('/dashboard', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDashboardHtml());
  });

  // Sajikan static public assets (misal logo.jpg)
  app.use(express.static('public'));
  app.get('/logo.jpg', (_req: Request, res: Response) => {
    res.sendFile('public/logo.jpg', { root: process.cwd() });
  });

  // Root welcome & info endpoint (HTML untuk browser, JSON untuk API client)
  app.get('/', (req: Request, res: Response) => {
    // Deteksi apakah request berasal dari navigasi browser yang meminta halaman HTML
    const isBrowserHtmlRequest = req.headers['accept']?.includes('text/html');

    if (isBrowserHtmlRequest && !req.xhr) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(renderDashboardHtml());
      return;
    }

    res.status(200).json({
      name: 'Alight Motion Premium Generator & API by Justdhif',
      version: '1.0.0',
      author: 'Justdhif',
      repository: 'https://github.com/Justdhif/am_prem-api',
      description: 'Web Generator & TypeScript REST API Service for Alight Motion Pro VIP Activation & Verification',
      architecture: 'Clean Architecture (Domain, Application, Infrastructure, Presentation)',
      environment: config.nodeEnv,
      security: {
        rateLimiting: 'Active',
        payloadLimit: '10kb',
        helmetHeaders: 'Active',
        apiKeyProtected: 'All VIP generation endpoints guarded by active expiring Access Keys',
      },
      webApp: '/dashboard',
      endpoints: {
        dashboard: 'GET /dashboard',
        health: 'GET /health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me',
        },
        billing: {
          plans: 'GET /api/billing/plans',
          subscribe: 'POST /api/billing/subscribe',
          regenerateKey: 'POST /api/billing/regenerate-key',
        },
        alightMotion: {
          sendLink: 'POST /api/am/send-link (Requires x-api-key)',
          verifyLink: 'POST /api/am/verify (Requires x-api-key)',
          command: 'POST /api/am/command (Requires x-api-key)',
          stats: 'GET /api/am/stats',
          help: 'GET /api/am/help',
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
