/// <reference types="jest" />

import EventSource from 'react-native-sse';

import type { ApiResponse } from '@/types';

import instance from './instance';
import { approveQrLogin, connectQrLogin } from './qr.service';

jest.mock('react-native-config', () => ({
  API_BASE_URL: 'https://api.example.com/',
}));
jest.mock('react-native-sse', () => jest.fn());
jest.mock('./instance', () => ({ post: jest.fn() }));

const SUCCESS_RESPONSE: ApiResponse<unknown> = {
  success: true,
  code: 'SUCCESS',
  message: '',
  data: null,
};

describe('QR 로그인 서비스', (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(instance.post).mockReset();
    jest.spyOn(console, 'warn').mockImplementation((): void => undefined);
  });

  afterEach((): void => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('승인 알림 연결이 끊어지면 1초 뒤 다시 연결하도록 설정한다', (): void => {
    connectQrLogin('qr/token+value');

    expect(EventSource).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/auth/qr/connect/qr%2Ftoken%2Bvalue',
      {
        headers: { Accept: 'text/event-stream' },
        pollingInterval: 1000,
      },
    );
  });

  it('서버가 알림 연결을 정상 종료해도 재연결하여 로그인 성공을 수신한다', (): void => {
    const RealEventSource =
      jest.requireActual<typeof import('react-native-sse')>('react-native-sse').default;
    jest.useFakeTimers();
    jest
      .mocked(EventSource)
      .mockImplementationOnce((url, options) => new RealEventSource(url, options));

    const requests: MockXMLHttpRequest[] = [];
    const originalXhrDescriptor = Object.getOwnPropertyDescriptor(global, 'XMLHttpRequest');
    class MockXMLHttpRequest {
      static LOADING = 3;
      static DONE = 4;
      readyState = 0;
      status = 200;
      responseText = '';
      onreadystatechange: (() => void) | null = null;
      open = jest.fn();
      setRequestHeader = jest.fn();
      send = jest.fn();
      abort = jest.fn();

      constructor() {
        requests.push(this);
      }
    }
    Object.defineProperty(global, 'XMLHttpRequest', {
      configurable: true,
      value: MockXMLHttpRequest,
    });

    const connection = connectQrLogin('reconnected-qr');
    const handleInit = jest.fn();
    const handleLoginSuccess = jest.fn();
    const handleClose = jest.fn();
    connection.addEventListener('INIT', handleInit);
    connection.addEventListener('LOGIN_SUCCESS', handleLoginSuccess);
    connection.addEventListener('close', handleClose);

    try {
      jest.advanceTimersByTime(500);
      expect(requests).toHaveLength(1);
      requests[0].readyState = 3;
      requests[0].responseText = 'event: INIT\ndata: connected\n\n';
      requests[0].onreadystatechange?.();
      expect(handleInit).toHaveBeenCalledTimes(1);

      requests[0].readyState = 4;
      requests[0].onreadystatechange?.();
      expect(handleClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(999);
      expect(requests).toHaveLength(1);
      jest.advanceTimersByTime(1);
      expect(requests).toHaveLength(2);
      expect(requests[1].open).toHaveBeenCalledWith(
        'GET',
        'https://api.example.com/api/v1/auth/qr/connect/reconnected-qr',
        true,
      );
      requests[1].readyState = 3;
      requests[1].responseText = 'event: LOGIN_SUCCESS\ndata: {"accessToken":"token"}\n\n';
      requests[1].onreadystatechange?.();
      expect(handleLoginSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'LOGIN_SUCCESS', data: '{"accessToken":"token"}' }),
      );
    } finally {
      connection.close();
      if (originalXhrDescriptor) {
        Object.defineProperty(global, 'XMLHttpRequest', originalXhrDescriptor);
      } else {
        Reflect.deleteProperty(global, 'XMLHttpRequest');
      }
    }
  });

  it('동일 QR의 진행 중 요청과 이미 성공한 결과를 재사용한다', async (): Promise<void> => {
    jest.mocked(instance.post).mockResolvedValueOnce({ data: SUCCESS_RESPONSE });

    const firstApproval = approveQrLogin('successful-qr');
    const repeatedApproval = approveQrLogin('successful-qr');

    await expect(firstApproval).resolves.toBe(SUCCESS_RESPONSE);
    await expect(repeatedApproval).resolves.toBe(SUCCESS_RESPONSE);
    await expect(approveQrLogin('successful-qr')).resolves.toBe(SUCCESS_RESPONSE);
    expect(instance.post).toHaveBeenCalledTimes(1);
    expect(instance.post).toHaveBeenCalledWith('/api/v1/auth/qr/login', {
      qrToken: 'successful-qr',
    });
  });

  it('서버가 승인을 거절한 QR은 실패 응답을 유지하고 다시 요청할 수 있다', async (): Promise<void> => {
    const failedResponse: ApiResponse<unknown> = {
      ...SUCCESS_RESPONSE,
      success: false,
      code: 'QR_LOGIN_FAILED',
      message: '승인할 수 없습니다.',
    };
    jest
      .mocked(instance.post)
      .mockResolvedValueOnce({ data: failedResponse })
      .mockResolvedValueOnce({ data: SUCCESS_RESPONSE });

    await expect(approveQrLogin('rejected-qr')).resolves.toBe(failedResponse);
    await expect(approveQrLogin('rejected-qr')).resolves.toBe(SUCCESS_RESPONSE);
    expect(instance.post).toHaveBeenCalledTimes(2);
  });

  it('요청 예외를 그대로 전달하고 같은 QR로 다시 요청할 수 있다', async (): Promise<void> => {
    const requestError = new Error('네트워크 연결에 실패했습니다.');
    jest
      .mocked(instance.post)
      .mockRejectedValueOnce(requestError)
      .mockResolvedValueOnce({ data: SUCCESS_RESPONSE });

    await expect(approveQrLogin('network-failed-qr')).rejects.toBe(requestError);
    await expect(approveQrLogin('network-failed-qr')).resolves.toBe(SUCCESS_RESPONSE);
    expect(instance.post).toHaveBeenCalledTimes(2);
  });
});
