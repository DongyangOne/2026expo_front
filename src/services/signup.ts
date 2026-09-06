import type {
  ApiResponse,
  EmailCheckRequest,
  EmailCheckResponse,
  EmailSendRequest,
  EmailSendResponse,
  ExistsCheckResponse,
  SignupRequest,
  SignupResponse,
} from '@/types';

import instance from './instance';

export const sendVerificationEmail = async (
  request: EmailSendRequest,
): Promise<ApiResponse<EmailSendResponse>> => {
  const response = await instance.post<ApiResponse<EmailSendResponse>>(
    '/api/v1/auth/email/send',
    request,
  );

  return response.data;
};

export const verifyEmailCode = async (
  request: EmailCheckRequest,
): Promise<ApiResponse<EmailCheckResponse>> => {
  const response = await instance.post<ApiResponse<EmailCheckResponse>>(
    '/api/v1/auth/email/check',
    request,
  );

  return response.data;
};

export const checkLoginIdDuplicate = async (
  loginId: string,
): Promise<ApiResponse<ExistsCheckResponse>> => {
  const response = await instance.get<ApiResponse<ExistsCheckResponse>>('/api/v1/auth/exists', {
    params: { loginId },
  });

  return response.data;
};

export const signup = async (request: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
  const response = await instance.post<ApiResponse<SignupResponse>>('/api/v1/auth/signup', request);

  return response.data;
};
