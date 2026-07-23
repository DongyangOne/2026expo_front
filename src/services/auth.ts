import type { ApiResponse, LoginRequest, LoginResponse, ReissueTokenResponse } from '@/types';

import apiInstance from './instance';

export const login = (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
  apiInstance.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', payload).then((res) => res.data);

export const reissueToken = (refreshToken: string): Promise<ApiResponse<ReissueTokenResponse>> =>
  apiInstance
    .post<ApiResponse<ReissueTokenResponse>>('/api/v1/auth/token', { refreshToken })
    .then((res) => res.data);
