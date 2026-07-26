import Config from 'react-native-config';
import EventSource from 'react-native-sse';

import type { ApiResponse, QrTokenData } from '@/types';

import instance from './instance';

export type QrLoginSseEvent = 'INIT' | 'LOGIN_SUCCESS';

export const issueQrToken = async (): Promise<ApiResponse<QrTokenData>> => {
  const response = await instance.post<ApiResponse<QrTokenData>>('/api/v1/auth/qr/token');

  return response.data;
};

export const connectQrLogin = (qrToken: string): EventSource<QrLoginSseEvent> => {
  const apiBaseUrl = Config.API_BASE_URL?.replace(/\/$/, '');

  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const encodedQrToken = encodeURIComponent(qrToken);
  const qrLoginConnectionUrl = `${apiBaseUrl}/api/v1/auth/qr/connect/${encodedQrToken}`;

  return new EventSource<QrLoginSseEvent>(qrLoginConnectionUrl, {
    headers: {
      Accept: 'text/event-stream',
    },
    pollingInterval: 0,
  });
};

export const approveQrLogin = async (qrToken: string): Promise<ApiResponse<unknown>> => {
  const response = await instance.post<ApiResponse<unknown>>('/api/v1/auth/qr/login', {
    qrToken,
  });

  return response.data;
};
