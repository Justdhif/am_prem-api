import { Router } from 'express';
import alightMotionRoutes from './alightMotion.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'alight-motion-premium-api',
  });
});

router.use('/am', alightMotionRoutes);

export default router;
