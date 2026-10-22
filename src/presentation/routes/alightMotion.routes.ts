import { Router } from 'express';
import { alightMotionController } from '../controllers/alightMotion.controller.js';
import { presetController } from '../controllers/preset.controller.js';
import { validateBody } from '../middlewares/validateRequest.js';
import {
  sendLinkLimiter,
  verifyLimiter,
  commandLimiter,
  generalLimiter,
} from '../middlewares/rateLimiter.js';
import { apiKeyAuth } from '../middlewares/apiKeyAuth.js';
import {
  sendLinkSchema,
  verifyMagicLinkSchema,
  commandSchema,
} from '../schemas/alightMotion.schema.js';
import { findPresetSchema } from '../schemas/preset.schema.js';

const router = Router();

// Pasang proteksi API Key opsional (hanya aktif jika API_SECRET_KEY diatur di .env)
router.use(apiKeyAuth);

// Kirim Magic Link ke Email (dilindungi rate limiter & validasi)
router.post(
  '/send-link',
  sendLinkLimiter,
  validateBody(sendLinkSchema),
  alightMotionController.sendLink.bind(alightMotionController)
);

// Alias untuk send-link
router.post(
  '/request-link',
  sendLinkLimiter,
  validateBody(sendLinkSchema),
  alightMotionController.sendLink.bind(alightMotionController)
);

// Verifikasi Magic Link & Aktivasi Lisensi Pro (dilindungi rate limiter & validasi)
router.post(
  '/verify',
  verifyLimiter,
  validateBody(verifyMagicLinkSchema),
  alightMotionController.verifyLink.bind(alightMotionController)
);

// Alias untuk verify
router.post(
  '/verify-link',
  verifyLimiter,
  validateBody(verifyMagicLinkSchema),
  alightMotionController.verifyLink.bind(alightMotionController)
);

// Endpoint bot command handler
router.post(
  '/command',
  commandLimiter,
  validateBody(commandSchema),
  alightMotionController.handleCommand.bind(alightMotionController)
);

// Temukan Link Preset Alight Motion dari Video TikTok (Caption & Komentar)
router.post(
  '/preset/find',
  generalLimiter,
  validateBody(findPresetSchema),
  presetController.findPresets.bind(presetController)
);

// Alias untuk preset finder
router.post(
  '/find-preset',
  generalLimiter,
  validateBody(findPresetSchema),
  presetController.findPresets.bind(presetController)
);

export default router;
