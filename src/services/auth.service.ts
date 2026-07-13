import type {
  AdminExistsData,
  AdminExistsRequest,
  AdminLoginData,
  AdminLoginRequest,
  AdminReissueData,
  AdminReissueRequest,
  AdminSignupRequest,
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

export const signupAdmin = async (
  signupRequest: AdminSignupRequest,
): Promise<ApiResponse<null>> => {
  const response = await instance.post<ApiResponse<null>>('/api/v1/admin/signup', signupRequest);

  return response.data;
};

export const checkAdminIdExists = async (
  existsRequest: AdminExistsRequest,
): Promise<ApiResponse<AdminExistsData>> => {
  const response = await instance.get<ApiResponse<AdminExistsData>>('/api/v1/admin/exists', {
    params: existsRequest,
  });

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
