import { Router } from 'express';
import alightMotionRoutes from './alightMotion.routes.js';
import authRoutes from './auth.routes.js';
import billingRoutes from './billing.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'alight-motion-premium-api',
  });
});

router.use('/auth', authRoutes);
router.use('/billing', billingRoutes);
router.use('/am', alightMotionRoutes);

export default router;
