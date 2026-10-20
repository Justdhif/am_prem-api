import axios, { AxiosError } from 'axios';
import { IFirebaseAuthGateway, AuthenticateResult } from '../../domain/gateways/IFirebaseAuthGateway.js';
import { config } from '../config/index.js';
import { withSpoofedIpHeaders } from './ipSpoofer.js';

export class FirebaseAuthGateway implements IFirebaseAuthGateway {
  private readonly defaultH1Headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-android-package': config.alightMotion.androidPackage,
    'x-android-cert': config.alightMotion.androidCert,
    'user-agent': config.alightMotion.dalvikUserAgent,
  };

  private extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      const data = axiosErr.response?.data;
      if (data) {
        return typeof data === 'object' ? JSON.stringify(data) : String(data);
      }
      return axiosErr.message || 'Unknown network error';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return String(err);
  }

  public friendlyFirebaseError(errStr: string): string {
    if (!errStr || typeof errStr !== 'string') {
      return 'Terjadi kesalahan autentikasi.';
    }
    if (errStr.includes('INVALID_OOB_CODE') || errStr.includes('INVALID_ACTION_CODE')) {
      return 'Kode magic link tidak valid atau sudah pernah digunakan.';
    }
    if (errStr.includes('EXPIRED_OOB_CODE') || errStr.includes('EXPIRED_ACTION_CODE')) {
      return 'Magic link telah kadaluarsa. Kirim ulang tautan baru.';
    }
    if (errStr.includes('INVALID_EMAIL')) {
      return 'Format email tidak valid.';
    }
    if (errStr.includes('EMAIL_NOT_FOUND')) {
      return 'Email tidak ditemukan. Kirim magic link terlebih dahulu.';
    }
    if (errStr.includes('USER_DISABLED')) {
      return 'Akun dinonaktifkan oleh admin.';
    }
    if (errStr.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
      return 'Terlalu banyak percobaan dari server. Coba lagi beberapa menit kemudian.';
    }
    if (errStr.includes('API_KEY_INVALID') || errStr.includes('API key not valid')) {
      return 'Firebase API Key tidak valid.';
    }
    if (
      errStr.includes('Gagal mengekstrak oobCode') ||
      errStr.includes('code gak ada') ||
      errStr.includes('MISSING_OOB_CODE')
    ) {
      return 'Format magic link tidak dikenali. Pastikan Anda menyalin seluruh tautan dari tombol email.';
    }
    return errStr.length > 500 ? errStr.slice(0, 500) : errStr;
  }

  public extractOobCode(raw: string): string | null {
    if (!raw) return null;

    let s = String(raw).trim();
    // Bersihkan karakter pembungkus seperti < >, [ ], ( ), kutip
    s = s.replace(/^[<"'\(\[]+|[>"'\)\]]+$/g, '').trim();
    s = s.replace(/&amp;/g, '&');

    try {
      s = decodeURIComponent(s);
    } catch {
      // ignore
    }

    // 1. Coba parse sebagai URL langsung
    try {
      const u = new URL(s);
      let c = u.searchParams.get('oobCode');
      if (!c) {
        const nestedParam =
          u.searchParams.get('link') ||
          u.searchParams.get('q') ||
          u.searchParams.get('url') ||
          u.searchParams.get('continueUrl');
        if (nestedParam) {
          try {
            const nestedUrl = new URL(nestedParam);
            c = nestedUrl.searchParams.get('oobCode');
          } catch {
            const mNested = nestedParam.match(/oobCode=([a-zA-Z0-9_-]+)/i);
            if (mNested) c = mNested[1];
          }
        }
      }
      if (c) return c.replace(/[^a-zA-Z0-9_-]/g, '');
    } catch {
      // not a direct standard URL, continue
    }

    // 2. Coba regex oobCode dari teks URL
    const m = s.match(/oobCode=([a-zA-Z0-9_-]+)/i);
    if (m) return m[1];

    // 3. Jika pengguna langsung memasukkan raw token / code
    const t = s.trim();
    if (/^[a-zA-Z0-9_-]{10,}$/.test(t) && !t.includes('://') && !t.includes(' ')) {
      return t;
    }

    return null;
  }

  public extractEmail(raw: string): string | null {
    if (!raw) return null;
    let s = String(raw);
    try {
      s = decodeURIComponent(s);
    } catch {
      // ignore
    }
    const match = s.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0].toLowerCase() : null;
  }

  public async requestMagicLink(email: string): Promise<{ ok: boolean; why?: string }> {
    try {
      // Warmup call
      try {
        await axios.post(
          `${config.firebase.idtUrl}/createAuthUri?key=${config.firebase.apiKey}`,
          { identifier: email, continueUri: 'http://localhost' },
          { headers: withSpoofedIpHeaders(this.defaultH1Headers), timeout: 10000 }
        );
      } catch {
        // warmup call error can be ignored
      }

      await axios.post(
        `${config.firebase.idtUrl}/getOobConfirmationCode?key=${config.firebase.apiKey}`,
        {
          requestType: 6,
          email: email,
          androidInstallApp: true,
          canHandleCodeInApp: true,
          continueUrl: config.alightMotion.continueUrl,
          iosBundleId: config.alightMotion.iosBundleId,
          androidPackageName: config.alightMotion.androidPackage,
          androidMinimumVersion: config.alightMotion.androidMinVersion,
          clientType: 'CLIENT_TYPE_ANDROID',
        },
        { headers: withSpoofedIpHeaders(this.defaultH1Headers), timeout: 15000 }
      );

      return { ok: true };
    } catch (e) {
      return { ok: false, why: this.extractErrorMessage(e) };
    }
  }

  public async authenticateEmailLink(
    email: string,
    rawLinkOrCode: string
  ): Promise<AuthenticateResult> {
    const c = this.extractOobCode(rawLinkOrCode);
    if (!c) {
      return { ok: false, why: 'Gagal mengekstrak oobCode dari tautan email' };
    }

    try {
      const a = await axios.post(
        `${config.firebase.idtUrl}/emailLinkSignin?key=${config.firebase.apiKey}`,
        {
          email: email,
          oobCode: c,
          clientType: 'CLIENT_TYPE_ANDROID',
        },
        { headers: withSpoofedIpHeaders(this.defaultH1Headers), timeout: 15000 }
      );

      let u = null;
      try {
        const b = await axios.post(
          `${config.firebase.idtUrl}/getAccountInfo?key=${config.firebase.apiKey}`,
          { idToken: a.data.idToken },
          { headers: withSpoofedIpHeaders(this.defaultH1Headers), timeout: 10000 }
        );
        u = b.data?.users?.[0] || null;
      } catch {
        // user account info fallback
      }

      return {
        ok: true,
        email: email,
        idToken: a.data.idToken,
        refreshToken: a.data.refreshToken,
        localId: a.data.localId,
        isNewUser: Boolean(a.data.isNewUser),
        user: u,
      };
    } catch (e) {
      return { ok: false, why: this.extractErrorMessage(e) };
    }
  }
}
