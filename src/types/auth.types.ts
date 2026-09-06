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

export interface GoogleLoginRequest {
  code: string;
  redirectUri: string;
  rememberMe: 'Y' | 'N';
}

export interface GoogleSignupRequiredResponse {
  needsSignup: 'Y';
  socialProviderId: string;
  socialType: 'GOOGLE';
  email: string;
  username: string;
}

export interface GoogleLoginSuccessResponse extends LoginResponse {
  needsSignup: 'N';
  socialProviderId: string;
  socialType: 'GOOGLE';
}

export type GoogleLoginResponse = GoogleSignupRequiredResponse | GoogleLoginSuccessResponse;


export interface ReissueTokenRequest {
  refreshToken: string;
}

export interface ReissueTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface WithdrawalRequest {
  password: string;
  withdrawReason: string;
  withdrawReasonDetail?: string;
}

export interface WithdrawalResponse {
  message: string;
}

export interface Admin {
  adminLoginId: string;
  team: string;
}

export interface AdminLoginRequest {
  adminLoginId: string;
  adminPassword: string;
}

export interface AdminLoginData extends Admin {
  adminAccessToken: string;
  adminRefreshToken: string;
}

export interface AdminSignupRequest {
  adminId: string;
  adminPassword: string;
  team: string;
}

export interface AdminExistsRequest {
  adminId: string;
}

export interface AdminExistsData {
  exists: 'Y' | 'N';
}

export interface AdminReissueRequest {
  refreshToken: string;
}

export interface AdminReissueData {
  accessToken: string;
  refreshToken: string;
}

export interface FindIdSendRequest {
  email: string;
}

export interface FindIdSendResponse {
  email: string;
  expiredAt: string;
}

export interface FindIdCheckRequest {
  email: string;
  authCode: string;
}

export interface FindIdCheckResponse {
  id: number;
  loginId: string;
}
