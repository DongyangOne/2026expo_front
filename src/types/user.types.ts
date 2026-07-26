export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ConfirmVerificationEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ConfirmVerificationEmailData {
  verified: boolean;
  message?: string;
}

export interface SendVerificationEmailData {
  maskedEmail: string;
  expiresInSeconds: number;
}
