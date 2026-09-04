import type {
  ApiResponse,
  ConfirmVerificationEmailData,
  ConfirmVerificationEmailRequest,
  SendVerificationEmailData,
  UpdateProfileRequest,
  UpdateProfileData,
} from '@/types';
import instance from './instance';

export const getProfile = () => {
  return instance.get('/api/v1/user/profile');
};

export const sendVerificationEmail = (): Promise<ApiResponse<SendVerificationEmailData>> =>
  instance
    .post<ApiResponse<SendVerificationEmailData>>('/api/v1/user/verification/email')
    .then((res) => res.data);

export const confirmVerificationEmail = (
  email: string,
  verificationCode: string,
): Promise<ApiResponse<ConfirmVerificationEmailData>> =>
  instance
    .post<ApiResponse<ConfirmVerificationEmailData>>('/api/v1/user/verification/email/confirm', {
      email,
      verificationCode,
    } satisfies ConfirmVerificationEmailRequest)
    .then((res) => res.data);

export const updateProfile = (
  payload: UpdateProfileRequest,
): Promise<ApiResponse<UpdateProfileData>> =>
  instance
    .patch<ApiResponse<UpdateProfileData>>('/api/v1/user/profile', payload)
    .then((res) => res.data);
