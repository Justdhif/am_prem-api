import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './presentation/routes/index.js';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler.js';

export function createApp(): Application {
  const app: Application = express();

  // Basic security and utility middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Health check endpoint
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
