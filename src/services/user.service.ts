import type { ApiResponse, UpdateProfileRequest, UpdateProfileData } from '@/types';

import instance from './instance';

export const getProfile = () => {
  return instance.get('/api/v1/user/profile');
};

export const sendVerificationEmail = () => {
  return instance.post('/api/v1/user/verification/email');
};

export const confirmVerificationEmail = (email: string, verificationCode: string) => {
  return instance
    .post('/api/v1/user/verification/email/confirm', { email, verificationCode })
    .then((res) => res.data);
};

export const updateProfile = (
  payload: UpdateProfileRequest,
): Promise<ApiResponse<UpdateProfileData>> =>
  instance
    .patch<ApiResponse<UpdateProfileData>>('/api/v1/user/profile', payload)
    .then((res) => res.data);
