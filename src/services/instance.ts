import axios from 'axios';
import Config from 'react-native-config';

import { useAuthStore } from '@/store';

const QR_TOKEN_ENDPOINT = '/api/v1/auth/qr/token';

const instance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  if (config.url === QR_TOKEN_ENDPOINT) {
    delete config.headers.Authorization;
    return config;
  }

  const token = useAuthStore.getState().adminAccessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
