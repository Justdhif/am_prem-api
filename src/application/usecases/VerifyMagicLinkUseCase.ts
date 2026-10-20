import { IFirebaseAuthGateway } from '../../domain/gateways/IFirebaseAuthGateway.js';
import { IAlightGateway } from '../../domain/gateways/IAlightGateway.js';
import { IStatsRepository } from '../../domain/repositories/IStatsRepository.js';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository.js';
import { VerifyLinkInputDto, VerifyLinkOutputDto } from '../dto/alightMotion.dto.js';
import { AlightMotionUser } from '../../domain/entities/User.js';
import { MessagePresenter } from '../../presentation/presenters/messagePresenter.js';

export class VerifyMagicLinkUseCase {
  constructor(
    private readonly firebaseAuthGateway: IFirebaseAuthGateway,
    private readonly alightGateway: IAlightGateway,
    private readonly statsRepository: IStatsRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async execute(input: VerifyLinkInputDto): Promise<VerifyLinkOutputDto> {
    let email = input.email?.trim()?.toLowerCase();
    const rawLink = input.link?.trim() || '';

    // Resolusi email dari session jika belum disediakan
    if (!email) {
      if (input.sessionId) {
        email = this.sessionRepository.getSession(input.sessionId) || undefined;
      }
      if (!email && input.senderId) {
        email = this.sessionRepository.getSession(input.senderId) || undefined;
      }
      if (!email && input.clientIp) {
        email = this.sessionRepository.getSession(input.clientIp) || undefined;
      }
      if (!email && rawLink) {
        email = this.firebaseAuthGateway.extractEmail(rawLink) || undefined;
      }
    }

    if (!email) {
      throw new Error(
        'Format verifikasi belum lengkap. Harap sertakan email atau lakukan send-link terlebih dahulu.'
      );
    }

    // 1. Autentikasi email link via Firebase IdentityToolkit
    const authResult = await this.firebaseAuthGateway.authenticateEmailLink(email, rawLink);
    if (!authResult.ok) {
      throw new Error(this.firebaseAuthGateway.friendlyFirebaseError(authResult.why || ''));
    }

    // 2. Aktivasi langganan Pro VIP via Alight Creative Cloud Function
    const licenseResult = await this.alightGateway.activateProSubscription(authResult.idToken || '');

    // 3. Update stats repository
    const stats = licenseResult.ok
      ? this.statsRepository.incrementStats()
      : this.statsRepository.getStats();

    // 4. Hitung masa aktif 1 tahun ke depan
    const now = new Date();
    const until = new Date();
    until.setFullYear(until.getFullYear() + 1);

    const formattedUserData: AlightMotionUser = {
      uid: authResult.localId || authResult.user?.localId || '-',
      email: authResult.user?.email || email,
      displayName: authResult.user?.displayName || null,
      isNewUser: Boolean(authResult.isNewUser),
      status: licenseResult.ok ? 'ACTIVE' : 'INACTIVE',
      membershipStatus: licenseResult.ok ? 'PREMIUM_ACTIVE' : 'LOGIN_ONLY',
      tier: licenseResult.ok ? 'Alight Motion Pro VIP' : 'Alight Motion Member',
      subscription: licenseResult.ok ? 'Yearly VIP License' : 'Login Only',
      orderId: licenseResult.orderId || null,
      activatedAt: now.toISOString(),
      validUntil: until.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      stats,
    };

    // Bersihkan sesi yang aktif
    if (input.sessionId) this.sessionRepository.deleteSession(input.sessionId);
    if (input.senderId) this.sessionRepository.deleteSession(input.senderId);
    if (input.clientIp) this.sessionRepository.deleteSession(input.clientIp);

    const formattedText = licenseResult.ok
      ? MessagePresenter.formatVerifySuccessText(formattedUserData)
      : MessagePresenter.formatVerifyWarningText(email, licenseResult.why);

    return {
      isPremium: licenseResult.ok,
      message: licenseResult.ok
        ? 'Alight Motion Pro VIP berhasil diaktifkan!'
        : 'Login berhasil tetapi lisensi VIP belum aktif. Silakan coba lagi nanti.',
      userData: formattedUserData,
      formattedText,
      premiumError: licenseResult.ok ? null : licenseResult.why,
    };
  }
}
