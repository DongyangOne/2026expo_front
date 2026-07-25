import instance from './instance';

export const sendVerificationEmail = () => {
  return instance.post('/api/v1/user/verification/email');
};

export const confirmVerificationEmail = (verificationCode: string) => {
  return instance.post('/api/v1/user/verification/email/confirm', {
    verificationCode,
  });
};
