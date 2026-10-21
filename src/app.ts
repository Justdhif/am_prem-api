import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import routes from './presentation/routes/index.js';
import { config } from './infrastructure/config/index.js';
import { generalLimiter } from './presentation/middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler.js';
import { swaggerSpec } from './presentation/docs/swaggerSpec.js';
import { renderDashboardHtml } from './presentation/views/dashboardHtml.js';

export function createApp(): Application {
  const app: Application = express();

  // Matikan header server signature X-Powered-By
  app.disable('x-powered-by');

  // Keamanan HTTP Headers dengan Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Nonaktifkan CSP agar Swagger UI CDN dapat di-render lancar
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

  // ---------------------------------------------------------------------------
  // Swagger UI Documentation (Aktif di SEMUA environment termasuk PRODUCTION)
  // Menggunakan CDN CSS & JS agar tahan banting di lingkungan serverless seperti Vercel
  // ---------------------------------------------------------------------------
  const swaggerUiOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
    ],
    customSiteTitle: 'Alight Motion Pro VIP API by Justdhif - Swagger Docs',
  };

  // Endpoint raw OpenAPI JSON spec
  app.get('/docs/json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerSpec);
  });
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerSpec);
  });

  // Swagger UI Routes
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

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

  // Web Dashboard Route
  app.get('/dashboard', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDashboardHtml());
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
      name: 'Alight Motion Premium API by Justdhif',
      version: '1.0.0',
      author: 'Justdhif',
      repository: 'https://github.com/Justdhif/am_prem-api',
      description: 'TypeScript REST API Service for Alight Motion Pro VIP Activation & Magic Link Verification',
      architecture: 'Clean Architecture (Domain, Application, Infrastructure, Presentation)',
      environment: config.nodeEnv,
      security: {
        rateLimiting: 'Active',
        payloadLimit: '10kb',
        helmetHeaders: 'Active',
        apiKeyProtected: Boolean(config.security.apiSecretKey),
      },
      dashboard: '/dashboard',
      documentation: {
        swaggerUi: '/docs',
        swaggerJson: '/docs/json',
        manualGuide: '/api/am/help',
      },
      endpoints: {
        dashboard: 'GET /dashboard',
        swaggerDocs: 'GET /docs',
        swaggerJson: 'GET /docs/json',
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
          sendLink: 'POST /api/am/send-link',
          verifyLink: 'POST /api/am/verify',
          command: 'POST /api/am/command',
          stats: 'GET /api/am/stats',
          help: 'GET /api/am/help',
        },
      },
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
