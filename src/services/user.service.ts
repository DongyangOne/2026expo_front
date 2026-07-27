import type { ApiResponse, UpdateProfileRequest, UpdateProfileData } from '@/types';

import instance from './instance';

export const sendVerificationEmail = () => {
  return instance.post('/api/v1/user/verification/email');
};

export const confirmVerificationEmail = (verificationCode: string) => {
  return instance.post('/api/v1/user/verification/email/confirm', {
    verificationCode,
  });
};

export const updateProfile = (
  payload: UpdateProfileRequest,
): Promise<ApiResponse<UpdateProfileData>> =>
  instance
    .patch<ApiResponse<UpdateProfileData>>('/api/v1/user/profile', payload)
    .then((res) => res.data);
