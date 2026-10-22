import { Request, Response } from 'express';
import { container } from '../../infrastructure/container.js';
import { addCommentSchema } from '../schemas/comment.schema.js';

export class CommentController {
  public async getComments(_req: Request, res: Response): Promise<void> {
    try {
      const result = await container.getCommentsUseCase.execute();
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Gagal mengambil data komentar',
        error: err.message || String(err),
      });
    }
  }

  public async addComment(req: Request, res: Response): Promise<void> {
    try {
      const validation = addCommentSchema.safeParse(req.body);

      if (!validation.success) {
        const errorMessages = validation.error.errors.map((e) => e.message).join(', ');
        res.status(400).json({
          success: false,
          message: errorMessages,
          error: errorMessages,
        });
        return;
      }

      const result = await container.addCommentUseCase.execute(validation.data);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Gagal mengirim komentar',
        error: err.message || String(err),
      });
    }
  }
}

export const commentController = new CommentController();
