import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';

import { STORAGE_KEYS } from '@/constants';
import { useAuthStore } from '@/store';
import type { AdminReissueData, ApiResponse, ReissueTokenResponse } from '@/types';

import { reissueToken } from './auth';
import { reissueAdminToken } from './auth.service';

import { resetToLogin } from '@/navigation/navigationRef';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const ADMIN_URL_PREFIX = '/api/v1/admin';
const ADMIN_FEEDBACK_LIST_URL = '/api/v1/feedback-detail';
const LOGIN_URL = '/api/v1/auth/login';
const SOCIAL_LOGIN_URLS = ['/api/v1/auth/kakao', '/api/v1/auth/naver', '/api/v1/auth/google'];
const LOGOUT_URL = '/api/v1/auth/logout';
const REISSUE_URL = '/api/v1/auth/token';
const ADMIN_LOGIN_URL = '/api/v1/admin/login';
const ADMIN_REISSUE_URL = '/api/v1/admin/reissue';
const QR_TOKEN_ENDPOINT = '/api/v1/auth/qr/token';

/**
 * 로그인 계열 요청의 401은 액세스 토큰 만료가 아니라 로그인 실패(예: 탈퇴한 회원)이므로
 * 토큰 재발급/강제 로그아웃 대상에서 제외한다. 그렇지 않으면 원인 안내 없이 로그인 화면으로 튕긴다.
 */
const isLoginEndpoint = (url?: string): boolean =>
  !!url && (url === LOGIN_URL || SOCIAL_LOGIN_URLS.includes(url));

const isAdminUrl = (url?: string): boolean =>
  !!url && (url.startsWith(ADMIN_URL_PREFIX) || url === ADMIN_FEEDBACK_LIST_URL);

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

  const { accessToken, adminAccessToken } = useAuthStore.getState();
  const token = isAdminUrl(config.url) ? adminAccessToken : accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

let adminReissuePromise: Promise<AdminReissueData> | null = null;

const reissueAdminAccessToken = (): Promise<AdminReissueData> => {
  if (!adminReissuePromise) {
    adminReissuePromise = (async () => {
      const { adminRefreshToken } = useAuthStore.getState();

      if (!adminRefreshToken) {
        throw new Error('저장된 관리자 refreshToken이 없습니다.');
      }

      const { data } = await reissueAdminToken({ refreshToken: adminRefreshToken });

      useAuthStore.getState().setAdminTokens(data);

      return data;
    })().finally(() => {
      adminReissuePromise = null;
    });
  }

  return adminReissuePromise;
};

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<never>>) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (isAdminUrl(config?.url)) {
      const isAdminLoginRequest = config?.url === ADMIN_LOGIN_URL;
      const isAdminReissueRequest = config?.url === ADMIN_REISSUE_URL;

      if (status === 401 && !isAdminLoginRequest) {
        const canReissue = !isAdminReissueRequest && config !== undefined && !config._retry;

        if (canReissue) {
          try {
            await reissueAdminAccessToken();
            config._retry = true;
            return instance(config);
          } catch {
            useAuthStore.getState().adminLogout();
          }
        } else {
          useAuthStore.getState().adminLogout();
        }
      }

      const adminMessage = error.response?.data?.message ?? error.message;
      return Promise.reject(new Error(adminMessage));
    }

    const isLoginRequest = isLoginEndpoint(config?.url);
    const isLogoutRequest = config?.url === LOGOUT_URL;
    const isReissueRequest = config?.url === REISSUE_URL;

    if (status === 401 && !isLoginRequest && !isLogoutRequest) {
      const canReissue = !isReissueRequest && config !== undefined && !config._retry;

      if (canReissue) {
        try {
          await reissueAccessToken();
          config._retry = true;
          return instance(config);
        } catch {
          await useAuthStore.getState().logout();
          resetToLogin(); // 추가
        }
      } else {
        await useAuthStore.getState().logout();
        resetToLogin(); // 추가
      }
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  },
);

export default instance;
