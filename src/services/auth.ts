import type {
  ApiResponse,
  KakaoLoginRequest,
  KakaoLoginResponse,
  LoginRequest,
  LoginResponse,
  ReissueTokenResponse,
  WithdrawalRequest,
  WithdrawalResponse,
} from '@/types';

import apiInstance from './instance';

export const login = (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
  apiInstance
    .post<ApiResponse<LoginResponse>>('/api/v1/auth/login', payload)
    .then((res) => res.data);

export const kakaoLogin = (
  payload: KakaoLoginRequest,
): Promise<ApiResponse<KakaoLoginResponse>> =>
  apiInstance
    .post<ApiResponse<KakaoLoginResponse>>('/api/v1/auth/kakao', payload)
    .then((res) => res.data);

export const logout = (): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance
    .post<ApiResponse<{ message: string }>>('/api/v1/auth/logout')
    .then((res) => res.data);
};

export const reissueToken = (refreshToken: string): Promise<ApiResponse<ReissueTokenResponse>> =>
  apiInstance
    .post<ApiResponse<ReissueTokenResponse>>('/api/v1/auth/token', { refreshToken })
    .then((res) => res.data);

// 회원탈퇴
export const withdrawUser = (
  payload: WithdrawalRequest,
): Promise<ApiResponse<WithdrawalResponse>> =>
  apiInstance
    .patch<ApiResponse<WithdrawalResponse>>('/api/v1/user/withdrawal', payload)
    .then((res) => res.data);
