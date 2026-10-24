export interface AuthenticateResult {
  ok: boolean;
  email?: string;
  idToken?: string;
  refreshToken?: string;
  localId?: string;
  isNewUser?: boolean;
  user?: any;
  why?: string;
}

export interface IFirebaseAuthGateway {
  requestMagicLink(email: string): Promise<{ ok: boolean; why?: string }>;
  authenticateEmailLink(email: string, rawLinkOrCode: string): Promise<AuthenticateResult>;
  extractOobCode(raw: string): string | null;
  extractEmail(raw: string): string | null;
  friendlyFirebaseError(errStr: string): string;
}
