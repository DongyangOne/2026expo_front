export interface LoginRequest {
  loginId: string;
  password: string;
  rememberMe: 'Y' | 'N';
}

export interface AuthUser {
  userId: number;
  loginId: string;
  email: string;
  username: string;
  team: string;
}

export interface LoginResponse extends AuthUser {
  rememberMe: 'Y' | 'N';
  accessToken: string;
  refreshToken: string;
}

export interface ReissueTokenRequest {
  refreshToken: string;
}

export interface ReissueTokenResponse {
  accessToken: string;
  refreshToken: string;
}
