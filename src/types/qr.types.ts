import type { AuthUser } from './auth.types';

export interface QrTokenData {
  qrToken: string;
}

export interface QrLoginData extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface QrLoginSseResponse {
  message: string;
  code: string;
  data: QrLoginData;
  success: boolean;
}
