/// <reference types="jest" />

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { connectQrLogin, createFeedbackDetection, issueQrToken } from '@/services';
import type { QrLoginSseResponse } from '@/types';

import TabletMain from './TabletMain';

jest.mock('@/services', () => ({
  connectQrLogin: jest.fn(),
  createFeedbackDetection: jest.fn(),
  issueQrToken: jest.fn(),
}));
jest.mock('@/store', () => ({
  useAuthStore: (selector: (state: typeof mockAuthState) => unknown) => selector(mockAuthState),
  useQrLoginStore: (selector: (state: typeof mockQrState) => unknown) => selector(mockQrState),
}));
jest.mock('@/constants', () => ({ FONTS: { bold: 'test-font' } }));
jest.mock('@/components/layout', () => ({ TabletBackgroundCircles: () => null }));
jest.mock('@/assets/icons/Logo.svg', () => () => null);
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: 'View' }));
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
  Text: 'Text',
}));
jest.mock('react-native-qrcode-svg', () => {
  const react = jest.requireActual<typeof import('react')>('react');
  return ({ value }: { value: string }) =>
    react.createElement('Text', { testID: 'qr-code' }, value);
});
jest.mock('react-native-css-interop', () => ({
  createInteropElement: jest.requireActual('react').createElement,
}));

const mockAuthState = { logout: jest.fn(), setAuth: jest.fn() };
const mockQrState = { clearLoginResponse: jest.fn(), setLoginResponse: jest.fn() };
const navigation = { navigate: jest.fn(), replace: jest.fn() };
const props: React.ComponentProps<typeof TabletMain> = {
  navigation: navigation as unknown as React.ComponentProps<typeof TabletMain>['navigation'],
  route: { key: 'tablet-main', name: 'TabletMain' },
};
const LOGIN_RESPONSE: QrLoginSseResponse = {
  success: true,
  message: '',
  code: 'SUCCESS',
  data: {
    userId: 1,
    loginId: 'test-user',
    email: 'test@example.com',
    username: 'test',
    team: 'test-team',
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
  },
};
const DETECTION_RESPONSE: Awaited<ReturnType<typeof createFeedbackDetection>> = {
  success: true,
  message: '',
  code: 'SUCCESS',
  data: { clientId: 'test-client' },
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

const createConnection = () => {
  const listeners = new Map<string, (event: { type: string; data: string | null }) => void>();
  return {
    addEventListener: jest.fn(
      (type: string, listener: (event: { type: string; data: string | null }) => void) => {
        listeners.set(type, listener);
      },
    ),
    removeAllEventListeners: jest.fn(() => listeners.clear()),
    close: jest.fn(),
    emit: (type: string, data: string | null = null): void => {
      listeners.get(type)?.({ type, data });
    },
  };
};
let connections: ReturnType<typeof createConnection>[];

const advanceTime = async (milliseconds: number): Promise<void> => {
  await act(async () => {
    jest.advanceTimersByTime(milliseconds);
  });
};

const renderTablet = async () => {
  const result = await render(<TabletMain {...props} />);
  await advanceTime(0);
  return result;
};

const openConnection = async (): Promise<void> => {
  await act(async () => connections[connections.length - 1].emit('open'));
};

describe('TabletMain QR 로그인 복구', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockAuthState.logout.mockResolvedValue(undefined);
    jest
      .mocked(issueQrToken)
      .mockReset()
      .mockImplementation(async () => ({
        success: true,
        code: 'SUCCESS',
        message: '',
        data: { qrToken: `token-${connections.length + 1}` },
      }));
    jest.mocked(createFeedbackDetection).mockReset().mockResolvedValue(DETECTION_RESPONSE);
    connections = [];
    jest.mocked(connectQrLogin).mockImplementation(() => {
      const connection = createConnection();
      connections.push(connection);
      return connection as unknown as ReturnType<typeof connectQrLogin>;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('승인 연결이 열린 뒤에만 QR을 표시한다', async () => {
    await renderTablet();
    expect(screen.queryByTestId('qr-code')).toBeNull();

    await openConnection();

    expect(screen.getByTestId('qr-code')).toHaveTextContent('expo2026://qr-login?qrToken=token-1');
  });

  it('로고를 5번 클릭하면 하드웨어 설정 화면으로 이동한다', async () => {
    await renderTablet();

    const logoButton = screen.getByLabelText('하드웨어 설정');

    await act(async () => {
      fireEvent.press(logoButton);
      fireEvent.press(logoButton);
      fireEvent.press(logoButton);
      fireEvent.press(logoButton);
      fireEvent.press(logoButton);
    });

    expect(navigation.navigate).toHaveBeenCalledWith('TabletSettings');
  });

  it('연결 오류 시 기존 QR을 숨기고 3초 뒤 새 연결이 열린 QR을 표시한다', async () => {
    await renderTablet();
    await openConnection();
    await act(async () => {
      connections[0].emit('error');
      connections[0].emit('error');
    });

    expect(screen.queryByTestId('qr-code')).toBeNull();
    expect(screen.getByLabelText('QR 코드 다시 시도')).toBeTruthy();
    expect(connections[0].close).toHaveBeenCalledTimes(1);
    await advanceTime(2999);
    expect(issueQrToken).toHaveBeenCalledTimes(1);
    await advanceTime(1);
    expect(issueQrToken).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId('qr-code')).toBeNull();
    await openConnection();

    expect(screen.getByTestId('qr-code')).toHaveTextContent('expo2026://qr-login?qrToken=token-2');
  });

  it('연결이 10초 동안 열리지 않으면 안내 후 새 QR 연결을 시도한다', async () => {
    await renderTablet();
    await advanceTime(10000);

    expect(screen.getByText('네트워크 연결을 확인한 후 다시 시도해주세요.')).toBeTruthy();
    expect(screen.queryByTestId('qr-code')).toBeNull();
    expect(connections[0].close).toHaveBeenCalledTimes(1);
    await advanceTime(3000);

    expect(issueQrToken).toHaveBeenCalledTimes(2);
    await openConnection();
    expect(screen.getByTestId('qr-code')).toHaveTextContent('expo2026://qr-login?qrToken=token-2');
  });

  it.each(['LOGIN_SUCCESS', 'message'])(
    '%s 승인 후 QR을 숨기고 중복 승인과 정기 재발급을 막는다',
    async (eventType) => {
      const detection = deferred<typeof DETECTION_RESPONSE>();
      jest.mocked(createFeedbackDetection).mockReturnValue(detection.promise);
      await renderTablet();
      await openConnection();
      await act(async () => {
        connections[0].emit(eventType, JSON.stringify(LOGIN_RESPONSE));
        connections[0].emit('message', JSON.stringify(LOGIN_RESPONSE));
      });

      expect(screen.queryByTestId('qr-code')).toBeNull();
      expect(createFeedbackDetection).toHaveBeenCalledTimes(1);
      expect(mockAuthState.setAuth).toHaveBeenCalledWith({
        ...LOGIN_RESPONSE.data,
        rememberMe: 'N',
      });
      await advanceTime(170000);
      expect(issueQrToken).toHaveBeenCalledTimes(1);
      await act(async () => detection.resolve(DETECTION_RESPONSE));

      expect(navigation.replace).toHaveBeenCalledTimes(1);
      expect(navigation.replace).toHaveBeenCalledWith('TabletTrashFeedback', {
        clientId: 'test-client',
      });
    },
  );

  it('승인 후 분류 준비가 실패해도 새 QR로 재시도할 수 있다', async () => {
    jest.mocked(createFeedbackDetection).mockRejectedValue(new Error('network error'));
    await renderTablet();
    await openConnection();
    await act(async () => connections[0].emit('LOGIN_SUCCESS', JSON.stringify(LOGIN_RESPONSE)));

    expect(screen.getByText('분류 요청을 준비하지 못했습니다.')).toBeTruthy();
    expect(mockAuthState.logout).toHaveBeenCalledTimes(1);
    expect(mockQrState.clearLoginResponse).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByLabelText('QR 코드 다시 시도'));

    expect(issueQrToken).toHaveBeenCalledTimes(2);
    await openConnection();
    expect(screen.getByTestId('qr-code')).toHaveTextContent('expo2026://qr-login?qrToken=token-2');
  });

  it('승인 이벤트의 응답 형식이 잘못되면 새 QR로 복구한다', async () => {
    await renderTablet();
    await openConnection();
    await act(async () => connections[0].emit('LOGIN_SUCCESS', '{invalid-json'));

    expect(screen.queryByTestId('qr-code')).toBeNull();
    expect(screen.getByText('로그인 응답을 처리하지 못해 QR 코드를 새로 발급합니다.')).toBeTruthy();
    expect(createFeedbackDetection).not.toHaveBeenCalled();
    await advanceTime(3000);
    expect(issueQrToken).toHaveBeenCalledTimes(2);
  });

  it('토큰 발급이 진행 중이면 재발급을 겹치지 않고 화면 종료 후 응답을 무시한다', async () => {
    const issuance = deferred<Awaited<ReturnType<typeof issueQrToken>>>();
    jest.mocked(issueQrToken).mockReturnValue(issuance.promise);
    const result = await renderTablet();
    await advanceTime(170000);

    expect(issueQrToken).toHaveBeenCalledTimes(1);
    await result.unmount();
    await act(async () =>
      issuance.resolve({
        success: true,
        code: 'SUCCESS',
        message: '',
        data: { qrToken: 'late-token' },
      }),
    );

    expect(connectQrLogin).not.toHaveBeenCalled();
  });

  it('화면을 떠난 뒤 완료된 분류 준비 요청은 화면을 이동시키지 않는다', async () => {
    const detection = deferred<typeof DETECTION_RESPONSE>();
    jest.mocked(createFeedbackDetection).mockReturnValue(detection.promise);
    const result = await renderTablet();
    await openConnection();
    await act(async () => connections[0].emit('LOGIN_SUCCESS', JSON.stringify(LOGIN_RESPONSE)));
    await result.unmount();
    await act(async () => detection.resolve(DETECTION_RESPONSE));

    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
