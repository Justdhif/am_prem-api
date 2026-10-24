import { Router } from 'express';
import alightMotionRoutes from './alightMotion.routes.js';
import commentRoutes from './comment.routes.js';
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

router.use('/am', alightMotionRoutes);
router.use('/comments', commentRoutes);
router.use('/am/comments', commentRoutes);

export default router;
