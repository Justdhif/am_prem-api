import { Router } from 'express';
import { commentController } from '../controllers/comment.controller.js';

const router = Router();

// GET /api/comments -> Dapatkan pohon komentar
router.get('/', commentController.getComments.bind(commentController));

// POST /api/comments -> Kirim komentar baru atau balasan
router.post('/', commentController.addComment.bind(commentController));

export default router;
