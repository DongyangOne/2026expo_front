import instance from './instance';

export const getProfile = () => {
  return instance.get('/api/v1/user/profile');
};