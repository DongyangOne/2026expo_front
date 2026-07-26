import type {
  ApiResponse,
  ConfirmVerificationEmailData,
  ConfirmVerificationEmailRequest,
  SendVerificationEmailData,
} from '@/types';

import instance from './instance';

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
