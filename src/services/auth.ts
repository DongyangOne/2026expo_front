import type {
  ApiResponse,
  FindPasswordCheckRequest,
  FindPasswordCheckResponse,
  FindPasswordResetRequest,
  FindPasswordSendRequest,
  FindPasswordSendResponse,
  FindIdCheckRequest,
  FindIdCheckResponse,
  FindIdSendRequest,
  FindIdSendResponse,
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

export const logout = (): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance
    .post<ApiResponse<{ message: string }>>('/api/v1/auth/logout')
    .then((res) => res.data);
};

export const reissueToken = (refreshToken: string): Promise<ApiResponse<ReissueTokenResponse>> =>
  apiInstance
    .post<ApiResponse<ReissueTokenResponse>>('/api/v1/auth/token', { refreshToken })
    .then((res) => res.data);

// 비밀번호 찾기 - 인증번호 발송
export const sendFindPasswordVerificationCode = (
  payload: FindPasswordSendRequest,
): Promise<ApiResponse<FindPasswordSendResponse>> =>
  apiInstance
    .post<ApiResponse<FindPasswordSendResponse>>('/api/v1/auth/find-password/send', payload)
    .then((res) => res.data);

// 비밀번호 찾기 - 인증번호 검증 및 임시 권한 토큰 발급
export const checkFindPasswordVerificationCode = (
  payload: FindPasswordCheckRequest,
): Promise<ApiResponse<FindPasswordCheckResponse>> =>
  apiInstance
    .post<ApiResponse<FindPasswordCheckResponse>>('/api/v1/auth/find-password/check', payload)
    .then((res) => res.data);

// 비밀번호 찾기 - 비밀번호 변경
export const resetFindPassword = (
  payload: FindPasswordResetRequest,
): Promise<ApiResponse<string>> =>
  apiInstance
    .post<ApiResponse<string>>('/api/v1/auth/find-password/reset', payload)
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
