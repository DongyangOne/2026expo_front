export interface EmailSendRequest {
  email: string;
}

export interface EmailSendResponse {
  email: string;
  expiredAt: string;
}

export interface EmailCheckRequest {
  email: string;
  authCode: string;
}

export interface EmailCheckResponse {
  message: string;
  verified: boolean;
}

export interface ExistsCheckResponse {
  exists: 'Y' | 'N';
}

export interface SignupRequest {
  username: string;
  loginId: string;
  password: string;
  email: string;
  team: string;
  agreeTerms: 'Y' | 'N';
  social: 'LOCAL' | 'KAKAO' | 'NAVER' | 'GOOGLE';
  providerId?: string;
}

export interface SignupResponse {
  username: string;
  loginId: string;
  email: string;
  team: string;
  createdDate: string;
}
