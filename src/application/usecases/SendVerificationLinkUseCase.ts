import { IFirebaseAuthGateway } from '../../domain/gateways/IFirebaseAuthGateway.js';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository.js';
import { SendLinkInputDto, SendLinkOutputDto } from '../dto/alightMotion.dto.js';
import { MessagePresenter } from '../../presentation/presenters/messagePresenter.js';

export class SendVerificationLinkUseCase {
  constructor(
    private readonly firebaseAuthGateway: IFirebaseAuthGateway,
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async execute(input: SendLinkInputDto): Promise<SendLinkOutputDto> {
    const email = input.email.trim().toLowerCase();
    const result = await this.firebaseAuthGateway.requestMagicLink(email);

    if (!result.ok) {
      throw new Error(this.firebaseAuthGateway.friendlyFirebaseError(result.why || ''));
    }

    const sessionId = input.sessionId || this.sessionRepository.generateSessionId();

    // Simpan session ke repository
    this.sessionRepository.setSession(sessionId, email);
    if (input.senderId && input.senderId !== sessionId) {
      this.sessionRepository.setSession(input.senderId, email);
    }
    if (input.clientIp) {
      this.sessionRepository.setSession(input.clientIp, email);
    }

    const message = `Link verifikasi Alight Motion berhasil dikirim ke ${email}. Periksa inbox atau folder spam email Anda.`;
    const formattedText = MessagePresenter.formatSendLinkSuccessText(email);

    return {
      email,
      sessionId,
      message,
      formattedText,
    };
  }
}
