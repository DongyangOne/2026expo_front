import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';

import { STORAGE_KEYS } from '@/constants';
import { useAuthStore } from '@/store';
import type { ApiResponse, ReissueTokenResponse } from '@/types';

import { reissueToken } from './auth';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const LOGIN_URL = '/api/v1/auth/login';
const REISSUE_URL = '/api/v1/auth/token';

const instance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let reissuePromise: Promise<ReissueTokenResponse> | null = null;

const reissueAccessToken = (): Promise<ReissueTokenResponse> => {
  if (!reissuePromise) {
    reissuePromise = (async () => {
      const { refreshToken, rememberMe } = useAuthStore.getState();

      if (!refreshToken) {
        throw new Error('저장된 refreshToken이 없습니다.');
      }

      const { data } = await reissueToken(refreshToken);

      useAuthStore.getState().setTokens(data);

      if (rememberMe === 'Y') {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, data.accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken],
        ]);
      }

      return data;
    })().finally(() => {
      reissuePromise = null;
    });
  }

  return reissuePromise;
};

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<never>>) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const isLoginRequest = config?.url === LOGIN_URL;
    const isReissueRequest = config?.url === REISSUE_URL;

    if (status === 401 && !isLoginRequest) {
      const canReissue = !isReissueRequest && config !== undefined && !config._retry;

      if (canReissue) {
        try {
          await reissueAccessToken();
          config._retry = true;
          return instance(config);
        } catch {
          await useAuthStore.getState().logout();
        }
      } else {
        await useAuthStore.getState().logout();
      }
    }

    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  },
);

export default instance;
