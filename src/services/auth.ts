import type {
  ApiResponse,
  FindIdCheckRequest,
  FindIdCheckResponse,
  FindIdSendRequest,
  FindIdSendResponse,
  LoginRequest,
  LoginResponse,
  NaverLoginRequest,
  NaverLoginResponse,
  ReissueTokenResponse,
  WithdrawalRequest,
  WithdrawalResponse,
} from '@/types';

import apiInstance from './instance';

export const login = (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
  apiInstance
    .post<ApiResponse<LoginResponse>>('/api/v1/auth/login', payload)
    .then((res) => res.data);

export const naverLogin = (payload: NaverLoginRequest): Promise<ApiResponse<NaverLoginResponse>> =>
  apiInstance
    .post<ApiResponse<NaverLoginResponse>>('/api/v1/auth/naver', payload)
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

// 아이디 찾기 - 인증번호 발송
export const sendFindIdVerificationCode = (
  payload: FindIdSendRequest,
): Promise<ApiResponse<FindIdSendResponse>> =>
  apiInstance
    .post<ApiResponse<FindIdSendResponse>>('/api/v1/auth/find-id/send', payload)
    .then((res) => res.data);

// 아이디 찾기 - 인증번호 검증 및 ID 반환
export const checkFindIdVerificationCode = (
  payload: FindIdCheckRequest,
): Promise<ApiResponse<FindIdCheckResponse>> =>
  apiInstance
    .post<ApiResponse<FindIdCheckResponse>>('/api/v1/auth/find-id/check', payload)
    .then((res) => res.data);

// 회원탈퇴
export const withdrawUser = (
  payload: WithdrawalRequest,
): Promise<ApiResponse<WithdrawalResponse>> =>
  apiInstance
    .patch<ApiResponse<WithdrawalResponse>>('/api/v1/user/withdrawal', payload)
    .then((res) => res.data);
