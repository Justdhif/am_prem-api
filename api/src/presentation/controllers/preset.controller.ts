import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/container.js';
import { classifyError } from '../middlewares/errorHandler.js';

export class PresetController {
  public async findPresets(req: Request, res: Response, _next?: NextFunction): Promise<void> {
    try {
      const { url } = req.body;
      const result = await container.findAlightPresetUseCase.execute({ url });

      res.status(200).json(result);
    } catch (err: any) {
      const errorDetail = classifyError(err, 400);
      res.status(errorDetail.statusCode).json({
        success: false,
        message: errorDetail.message,
        error: errorDetail.error || 'Unsupported video URL format',
      });
    }
  }
}

export const presetController = new PresetController();
