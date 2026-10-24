import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/container.js';

export class PresetController {
  public async findPresets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { url } = req.body;
      const result = await container.findAlightPresetUseCase.execute({ url });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const presetController = new PresetController();
