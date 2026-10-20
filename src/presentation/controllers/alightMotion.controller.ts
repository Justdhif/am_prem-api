import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/container.js';
import { MessagePresenter } from '../presenters/messagePresenter.js';
import { ApiResponseDto } from '../../application/dto/alightMotion.dto.js';

export class AlightMotionController {
  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || '127.0.0.1';
  }

  public async sendLink(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const email: string = req.body.email;
      const clientIp = this.getClientIp(req);
      const sessionId: string | undefined =
        req.body.sessionId ||
        (req.headers['x-session-id'] as string) ||
        undefined;
      const senderId: string | undefined =
        req.body.senderId ||
        (req.headers['x-sender-id'] as string) ||
        undefined;

      const result = await container.sendVerificationLinkUseCase.execute({
        email,
        sessionId,
        senderId,
        clientIp,
      });

      const response: ApiResponseDto = {
        success: true,
        message: result.message,
        sessionId: result.sessionId,
        formattedText: result.formattedText,
        data: {
          email: result.email,
          sessionId: result.sessionId,
          nextSteps: [
            '1. Buka email (inbox atau folder spam) dari Alight Motion.',
            '2. Salin tautan pada tombol "Sign in to Alight Motion".',
            '3. Kirim permintaan POST ke /api/am/verify dengan email dan link yang disalin.',
          ],
        },
      };

      res.status(200).json(response);
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Gagal mengirim link verifikasi',
        error: err.message || String(err),
      });
    }
  }

  public async verifyLink(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const email: string | undefined = req.body.email?.trim()?.toLowerCase();
      const rawLink: string =
        req.body.link || req.body.magicLink || req.body.oobCode || '';

      const clientIp = this.getClientIp(req);
      const sessionId: string | undefined =
        req.body.sessionId ||
        (req.headers['x-session-id'] as string) ||
        undefined;
      const senderId: string | undefined =
        req.body.senderId ||
        (req.headers['x-sender-id'] as string) ||
        undefined;

      const result = await container.verifyMagicLinkUseCase.execute({
        email,
        link: rawLink,
        sessionId,
        senderId,
        clientIp,
      });

      res.status(200).json({
        success: result.isPremium,
        isPremium: result.isPremium,
        message: result.message,
        formattedText: result.formattedText,
        data: result.userData,
        error: result.premiumError || undefined,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Verifikasi link gagal',
        formattedText: MessagePresenter.formatVerifyErrorText(err.message || String(err)),
        error: err.message || String(err),
      });
    }
  }

  public async getStats(_req: Request, res: Response): Promise<void> {
    const stats = container.getStatsUseCase.execute();
    res.status(200).json({
      success: true,
      message: 'Statistik Alight Motion Pro',
      formattedText: stats.formattedText,
      data: {
        totalPremium: stats.totalPremium,
        todayPremium: stats.todayPremium,
        status: stats.status,
      },
    });
  }

  public async getHelp(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Panduan Alight Motion Pro VIP API',
      formattedText: MessagePresenter.formatHelpText(),
      data: {
        description:
          'Layanan REST API untuk aktivasi lisensi Alight Motion Pro VIP 1 Tahun secara otomatis.',
        endpoints: [
          {
            method: 'POST',
            path: '/api/am/send-link',
            description: 'Mengirimkan magic link verifikasi ke email target.',
            body: {
              email: 'string (wajib, contoh: user@gmail.com)',
              sessionId: 'string (opsional, untuk mengikat sesi verifikasi)',
              senderId: 'string (opsional, misal ID user / JID bot)',
            },
          },
          {
            method: 'POST',
            path: '/api/am/verify',
            description: 'Memverifikasi magic link dan mengaktifkan lisensi Pro VIP 1 Tahun.',
            body: {
              link: 'string (wajib, tautan dari tombol "Sign in to Alight Motion")',
              email: 'string (opsional jika sudah session-tracked dari send-link)',
              sessionId: 'string (opsional, sessionId dari response send-link)',
              senderId: 'string (opsional, ID pengirim dari send-link)',
            },
          },
          {
            method: 'GET',
            path: '/api/am/stats',
            description: 'Mengambil data statistik lisensi aktif total dan harian.',
          },
          {
            method: 'GET',
            path: '/api/am/help',
            description: 'Menampilkan panduan penggunaan dan dokumentasi endpoint.',
          },
          {
            method: 'POST',
            path: '/api/am/command',
            description:
              'Adapter untuk integrasi bot pesan instan (WhatsApp/Telegram/Discord) dengan format perintah teks langsung (!amprem, !amverify, !amstats, !amhelp).',
            body: {
              text: 'string (contoh: "!amprem user@gmail.com" atau "!amverify <link>")',
              senderId: 'string (opsional, ID pengirim)',
            },
          },
          {
            method: 'GET',
            path: '/health',
            description: 'Mengecek ketersediaan dan status server.',
          },
        ],
        workflow: [
          {
            step: 1,
            title: 'Kirim Permintaan Magic Link',
            method: 'POST',
            endpoint: '/api/am/send-link',
            body: {
              email: 'user@example.com',
            },
          },
          {
            step: 2,
            title: 'Salin Tautan dari Email',
            description:
              'Buka email dari Alight Motion di Inbox atau folder Spam. Tekan lama tombol "Sign in to Alight Motion", lalu pilih "Salin tautan".',
          },
          {
            step: 3,
            title: 'Aktivasi Lisensi Pro VIP',
            method: 'POST',
            endpoint: '/api/am/verify',
            body: {
              email: 'user@example.com (opsional jika request dari client/session yang sama)',
              link: 'https://alightcreative.com/?link=...&oobCode=xxxx',
            },
          },
          {
            step: 4,
            title: 'Login di Aplikasi Alight Motion',
            description:
              'Buka aplikasi Alight Motion di smartphone dan login menggunakan email di atas. Akun otomatis Pro VIP tanpa watermark!',
          },
        ],
      },
    });
  }

  public async handleCommand(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const text: string = req.body.text?.trim() || '';
      const senderId: string =
        req.body.senderId ||
        req.body.jid ||
        this.getClientIp(req);
      const clientIp = this.getClientIp(req);

      const result = await container.handleBotCommandUseCase.execute({
        text,
        senderId,
        clientIp,
      });

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        replyText: `⚠️ Terjadi kesalahan saat memproses perintah Alight Motion.\n\n${err.message || err}`,
        error: err.message || String(err),
      });
    }
  }
}

export const alightMotionController = new AlightMotionController();
