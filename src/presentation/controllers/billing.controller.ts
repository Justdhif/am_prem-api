import { Request, Response } from 'express';
import { container } from '../../infrastructure/container.js';
import { PLAN_CONFIGS, PlanType } from '../../domain/entities/Billing.js';
import { AuthenticatedRequest } from '../middlewares/userAuth.js';

export class BillingController {
  public async getPlans(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Daftar paket langganan Alight Motion Pro API',
      data: Object.values(PLAN_CONFIGS),
    });
  }

  public async subscribe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, message: 'Harap login terlebih dahulu.' });
        return;
      }

      const { plan } = req.body;
      if (!plan || !['weekly', 'monthly', 'yearly'].includes(plan)) {
        res.status(400).json({
          success: false,
          message: 'Paket tidak valid. Pilihan paket: weekly, monthly, yearly.',
        });
        return;
      }

      const updatedProfile = await container.subscribePlanUseCase.execute({
        userId: req.userId,
        plan: plan as PlanType,
      });

      res.status(200).json({
        success: true,
        message: `Paket ${updatedProfile.planName} berhasil diaktifkan! Access Key Anda telah aktif.`,
        data: updatedProfile,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Gagal memproses langganan.',
      });
    }
  }

  public async regenerateKey(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, message: 'Harap login terlebih dahulu.' });
        return;
      }

      const updatedProfile = await container.regenerateApiKeyUseCase.execute(req.userId);

      res.status(200).json({
        success: true,
        message: 'Access Key baru berhasil digenerate. Kunci lama sudah tidak berlaku.',
        data: updatedProfile,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Gagal membuat Access Key baru.',
      });
    }
  }
}

export const billingController = new BillingController();
