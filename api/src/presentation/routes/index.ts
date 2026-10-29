import { Router } from 'express';
import alightMotionRoutes from './alightMotion.routes.js';
import { alightMotionController } from '../controllers/alightMotion.controller.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'alight-motion-premium-api',
  });
});

// Alias langsung untuk stats di root /api/stats
router.get('/stats', alightMotionController.getStats.bind(alightMotionController));

// Rute Alight Motion Premium
router.use('/am', alightMotionRoutes);

export default router;
