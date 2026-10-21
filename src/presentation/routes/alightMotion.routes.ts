import { Router } from 'express';
import { alightMotionController } from '../controllers/alightMotion.controller.js';
import { validateBody } from '../middlewares/validateRequest.js';
import {
  sendLinkLimiter,
  verifyLimiter,
  commandLimiter,
} from '../middlewares/rateLimiter.js';
import { requireApiKey, optionalApiKey } from '../middlewares/apiKeyAuth.js';
import {
  sendLinkSchema,
  verifyMagicLinkSchema,
  commandSchema,
} from '../schemas/alightMotion.schema.js';

const router = Router();

// Kirim Magic Link ke Email (WAJIB ACCESS KEY & RATE LIMITER)
router.post(
  '/send-link',
  requireApiKey,
  sendLinkLimiter,
  validateBody(sendLinkSchema),
  alightMotionController.sendLink.bind(alightMotionController)
);

// Alias untuk send-link (WAJIB ACCESS KEY & RATE LIMITER)
router.post(
  '/request-link',
  requireApiKey,
  sendLinkLimiter,
  validateBody(sendLinkSchema),
  alightMotionController.sendLink.bind(alightMotionController)
);

// Verifikasi Magic Link & Aktivasi Lisensi Pro (WAJIB ACCESS KEY & RATE LIMITER)
router.post(
  '/verify',
  requireApiKey,
  verifyLimiter,
  validateBody(verifyMagicLinkSchema),
  alightMotionController.verifyLink.bind(alightMotionController)
);

// Alias untuk verify (WAJIB ACCESS KEY & RATE LIMITER)
router.post(
  '/verify-link',
  requireApiKey,
  verifyLimiter,
  validateBody(verifyMagicLinkSchema),
  alightMotionController.verifyLink.bind(alightMotionController)
);

// Endpoint bot command handler (WAJIB ACCESS KEY & RATE LIMITER)
router.post(
  '/command',
  requireApiKey,
  commandLimiter,
  validateBody(commandSchema),
  alightMotionController.handleCommand.bind(alightMotionController)
);

// Ambil Statistik Aktivasi (Akses Publik / Key Opsional)
router.get('/stats', optionalApiKey, alightMotionController.getStats.bind(alightMotionController));

// Panduan Penggunaan API (Akses Publik / Key Opsional)
router.get('/help', optionalApiKey, alightMotionController.getHelp.bind(alightMotionController));

export default router;
