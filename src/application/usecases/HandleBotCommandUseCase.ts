import { SendVerificationLinkUseCase } from './SendVerificationLinkUseCase.js';
import { VerifyMagicLinkUseCase } from './VerifyMagicLinkUseCase.js';
import { GetStatsUseCase } from './GetStatsUseCase.js';
import { FindAlightPresetUseCase } from './FindAlightPresetUseCase.js';
import { IFirebaseAuthGateway } from '../../domain/gateways/IFirebaseAuthGateway.js';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository.js';
import { BotCommandInputDto, BotCommandOutputDto } from '../dto/alightMotion.dto.js';
import { MessagePresenter } from '../../presentation/presenters/messagePresenter.js';

export class HandleBotCommandUseCase {
  constructor(
    private readonly sendVerificationLinkUseCase: SendVerificationLinkUseCase,
    private readonly verifyMagicLinkUseCase: VerifyMagicLinkUseCase,
    private readonly getStatsUseCase: GetStatsUseCase,
    private readonly findAlightPresetUseCase: FindAlightPresetUseCase,
    private readonly firebaseAuthGateway: IFirebaseAuthGateway,
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async execute(input: BotCommandInputDto): Promise<BotCommandOutputDto> {
    const text = input.text.trim();
    const senderId = input.senderId || input.jid || input.clientIp || 'unknown_sender';

    const parts = text.split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';

    // 1. !amhelp
    if (command === '!amhelp') {
      return {
        success: true,
        command: 'amhelp',
        replyText: MessagePresenter.formatHelpText(),
      };
    }

    // 2. !amstats
    if (command === '!amstats') {
      const stats = await this.getStatsUseCase.execute();
      return {
        success: true,
        command: 'amstats',
        replyText: stats.formattedText,
        data: {
          total: stats.totalPremium,
          today: stats.todayPremium,
          status: stats.status,
        },
      };
    }

    // 3. !ampreset / !findpreset / !preset <tiktok_url>
    if (command === '!ampreset' || command === '!findpreset' || command === '!preset') {
      const tiktokUrl = parts.slice(1).join(' ').trim();
      if (!tiktokUrl) {
        return {
          success: false,
          command: 'ampreset',
          replyText:
            '⚠️ *Format Perintah Belum Lengkap*\n\nSilakan sertakan URL video TikTok.\nContoh:\n`!ampreset https://vt.tiktok.com/xxxx/`\n`!ampreset https://www.tiktok.com/@user/video/xxxx`',
        };
      }

      try {
        const result = await this.findAlightPresetUseCase.execute({ url: tiktokUrl });
        return {
          success: true,
          command: 'ampreset',
          replyText: result.data.formattedText,
          data: result.data,
        };
      } catch (err: any) {
        return {
          success: false,
          command: 'ampreset',
          replyText: `❌ *Gagal Mencari Preset TikTok*\n\n${err.message || err}`,
          error: err.message || String(err),
        };
      }
    }

    // 4. !amprem / !amlink / !ampremium <email>
    if (
      command === '!amprem' ||
      command === '!amlink' ||
      command === '!ampremium'
    ) {
      const email = parts[1]?.trim().toLowerCase();

      if (!email) {
        return {
          success: false,
          command: 'amprem',
          replyText: MessagePresenter.formatSendLinkUsageHelpText(),
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          command: 'amprem',
          replyText: `❌ Format email *${email}* tidak valid. Pastikan penulisan email sudah benar.`,
        };
      }

      try {
        const result = await this.sendVerificationLinkUseCase.execute({
          email,
          senderId,
          clientIp: input.clientIp,
        });

        return {
          success: true,
          command: 'amprem',
          replyText: result.formattedText,
          data: {
            email: result.email,
            sessionId: result.sessionId,
          },
        };
      } catch (err: any) {
        return {
          success: false,
          command: 'amprem',
          replyText: `❌ *Gagal Mengirim Link Verifikasi*\n\n${err.message || err}`,
          error: err.message || String(err),
        };
      }
    }

    // 5. !amverify / !amverif <email?> <link>
    if (command === '!amverify' || command === '!amverif') {
      let email = '';
      let magicLink = '';

      if (parts.length >= 3) {
        const candidateEmail = parts[1].trim().toLowerCase();
        if (candidateEmail.includes('@') && candidateEmail.includes('.')) {
          email = candidateEmail;
          magicLink = parts.slice(2).join(' ').trim();
        } else {
          magicLink = parts.slice(1).join(' ').trim();
        }
      } else if (parts.length === 2) {
        const arg = parts[1].trim();
        if (
          arg.includes('://') ||
          arg.includes('oobCode') ||
          this.firebaseAuthGateway.extractOobCode(arg)
        ) {
          magicLink = arg;
          email = this.sessionRepository.getSession(senderId) || '';
        } else if (arg.includes('@')) {
          email = arg.toLowerCase();
        }
      }

      if (!email) {
        email = this.sessionRepository.getSession(senderId) || '';
      }

      if (!email || !magicLink) {
        return {
          success: false,
          command: 'amverify',
          replyText: MessagePresenter.formatVerifyUsageHelpText(),
        };
      }

      try {
        const result = await this.verifyMagicLinkUseCase.execute({
          email,
          link: magicLink,
          senderId,
          clientIp: input.clientIp,
        });

        return {
          success: result.isPremium,
          command: 'amverify',
          replyText: result.formattedText,
          data: result.userData,
          error: result.premiumError || undefined,
        };
      } catch (err: any) {
        return {
          success: false,
          command: 'amverify',
          replyText: MessagePresenter.formatVerifyErrorText(err.message || String(err)),
          error: err.message || String(err),
        };
      }
    }

    // Perintah tidak dikenal
    return {
      success: false,
      command: command || 'unknown',
      replyText: MessagePresenter.formatUnknownCommandText(command),
    };
  }
}
