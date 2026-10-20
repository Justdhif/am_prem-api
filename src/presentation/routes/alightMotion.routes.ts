import { Router } from 'express';
import { alightMotionController } from '../controllers/alightMotion.controller.js';
import { validateBody } from '../middlewares/validateRequest.js';
import {
  sendLinkSchema,
  verifyMagicLinkSchema,
  commandSchema,
} from '../schemas/alightMotion.schema.js';

const router = Router();

// Kirim Magic Link ke Email
router.post(
  '/send-link',
  validateBody(sendLinkSchema),
  alightMotionController.sendLink.bind(alightMotionController)
);

// Alias untuk send-link
router.post(
  '/request-link',
  validateBody(sendLinkSchema),
  alightMotionController.sendLink.bind(alightMotionController)
);

// Verifikasi Magic Link & Aktivasi Lisensi Pro
router.post(
  '/verify',
  validateBody(verifyMagicLinkSchema),
  alightMotionController.verifyLink.bind(alightMotionController)
);

// Alias untuk verify
router.post(
  '/verify-link',
  validateBody(verifyMagicLinkSchema),
  alightMotionController.verifyLink.bind(alightMotionController)
);

// Endpoint bot command handler (kompatibel penuh dengan WhatsApp bot di justbot_v2)
router.post(
  '/command',
  validateBody(commandSchema),
  alightMotionController.handleCommand.bind(alightMotionController)
);

// Ambil Statistik Aktivasi
router.get('/stats', alightMotionController.getStats.bind(alightMotionController));

// Panduan Penggunaan API
router.get('/help', alightMotionController.getHelp.bind(alightMotionController));

export default router;
