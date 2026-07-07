import type {
  AdminLoginData,
  AdminLoginRequest,
  AdminReissueData,
  AdminReissueRequest,
  ApiResponse,
} from '@/types';

import instance from './instance';

export const loginAdmin = async (
  loginRequest: AdminLoginRequest,
): Promise<ApiResponse<AdminLoginData>> => {
  const response = await instance.post<ApiResponse<AdminLoginData>>(
    '/api/v1/admin/login',
    loginRequest,
  );

  return response.data;
};

export const reissueAdminToken = async (
  reissueRequest: AdminReissueRequest,
): Promise<ApiResponse<AdminReissueData>> => {
  const response = await instance.post<ApiResponse<AdminReissueData>>(
    '/api/v1/admin/reissue',
    reissueRequest,
  );

  return response.data;
};
