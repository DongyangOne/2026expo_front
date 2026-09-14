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
    // 서버가 스트림을 정상 종료해도 close 이벤트가 오지 않으므로 재연결을 유지한다.
    pollingInterval: 1000,
  });
};

const qrLoginApprovalRequests = new Map<string, Promise<ApiResponse<unknown>>>();

export const approveQrLogin = async (qrToken: string): Promise<ApiResponse<unknown>> => {
  const existingRequest = qrLoginApprovalRequests.get(qrToken);

  if (existingRequest) {
    console.warn('[qr.service] 동일 QR 승인 요청 재사용');
    return existingRequest;
  }

  const request = instance
    .post<ApiResponse<unknown>>('/api/v1/auth/qr/login', { qrToken })
    .then(({ data }) => {
      // QR 토큰은 성공 시 서버에서 즉시 소비되므로, 실패 응답만 재시도 가능하게 둔다.
      if (!data.success && qrLoginApprovalRequests.get(qrToken) === request) {
        qrLoginApprovalRequests.delete(qrToken);
      }

      return data;
    })
    .catch((error: unknown) => {
      if (qrLoginApprovalRequests.get(qrToken) === request) {
        qrLoginApprovalRequests.delete(qrToken);
      }

      throw error;
    });

  qrLoginApprovalRequests.set(qrToken, request);

  return request;
};
