import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { TabletBackgroundCircles } from '@/components/layout';
import LogoIcon from '@/assets/icons/Logo.svg';
import { FONTS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { connectQrLogin, createFeedbackDetection, issueQrToken } from '@/services';
import { useAuthStore, useQrLoginStore } from '@/store';
import type { QrLoginSseResponse } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletMain'>;

interface QrTapState {
  firstTapAt: number;
  count: number;
}

const QR_SIZE = 440;
const QR_TOKEN_REFRESH_INTERVAL_MS = 2 * 60 * 1000 + 50 * 1000;
const QR_CONNECTION_TIMEOUT_MS = 10000;
const QR_CONNECTION_RETRY_DELAY_MS = 3000;
const LOGIN_TAP_WINDOW_MS = 5000;
const LOGIN_TAP_COUNT = 5;
const SETTINGS_TAP_WINDOW_MS = 5000;
const SETTINGS_TAP_COUNT = 5;
const QR_TOKEN_ERROR_MESSAGE = 'QR 코드를 불러오지 못했습니다.';
const QR_NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 후 다시 시도해주세요.';
const CLIENT_ID_ERROR_MESSAGE = '분류 요청을 준비하지 못했습니다.';
const QR_LOGIN_RESPONSE_ERROR_MESSAGE = '로그인 응답을 처리하지 못해 QR 코드를 새로 발급합니다.';
const QR_LOGIN_DEEP_LINK_PREFIX = 'expo2026://qr-login?qrToken=';

const isRecord = (candidate: unknown): candidate is Record<string, unknown> =>
  typeof candidate === 'object' && candidate !== null;

const parseQrLoginResponse = (eventData: string | null): QrLoginSseResponse | null => {
  if (!eventData) {
    return null;
  }

  try {
    const response: unknown = JSON.parse(eventData);

    if (
      !isRecord(response) ||
      response.success !== true ||
      typeof response.message !== 'string' ||
      typeof response.code !== 'string' ||
      !isRecord(response.data)
    ) {
      return null;
    }

    const loginData = response.data;
    const hasValidLoginData =
      typeof loginData.userId === 'number' &&
      typeof loginData.loginId === 'string' &&
      typeof loginData.email === 'string' &&
      typeof loginData.username === 'string' &&
      typeof loginData.team === 'string' &&
      typeof loginData.accessToken === 'string' &&
      typeof loginData.refreshToken === 'string';

    if (!hasValidLoginData) {
      return null;
    }

    return {
      message: response.message,
      code: response.code,
      success: true,
      data: {
        userId: loginData.userId as number,
        loginId: loginData.loginId as string,
        email: loginData.email as string,
        username: loginData.username as string,
        team: loginData.team as string,
        accessToken: loginData.accessToken as string,
        refreshToken: loginData.refreshToken as string,
      },
    };
  } catch {
    return null;
  }
};

interface QrCodeProps {
  qrToken: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

interface QrLoginEvent {
  type: string;
  data: string | null;
}

const QrCode = ({ qrToken, isLoading, errorMessage, onRetry }: QrCodeProps): React.JSX.Element => {
  const qrLoginDeepLink = qrToken
    ? `${QR_LOGIN_DEEP_LINK_PREFIX}${encodeURIComponent(qrToken)}`
    : null;

  return (
    <View className="h-[440px] w-[440px] items-center justify-center rounded-[8px] bg-[#E5E7EB] p-[14px]">
      {isLoading ? <ActivityIndicator color="#7B61FF" size="large" /> : null}
      {!isLoading && qrLoginDeepLink ? (
        <QRCode
          backgroundColor="#FFFFFF"
          color="#404040"
          size={QR_SIZE - 28}
          value={qrLoginDeepLink}
        />
      ) : null}
      {!isLoading && errorMessage ? (
        <View className="items-center">
          <Text className="text-center font-notoSansKRRegular text-[16px] text-body">
            {errorMessage}
          </Text>
          <Pressable
            accessibilityLabel="QR 코드 다시 시도"
            accessibilityRole="button"
            className="mt-[20px] h-[48px] items-center justify-center rounded-[10px] bg-purple px-[24px]"
            onPress={onRetry}>
            <Text className="font-notoSansKRBold text-[15px] text-white">다시 시도</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const GradientGuideText = (): React.JSX.Element => {
  return (
    <Svg height={54} width={250}>
      <Defs>
        <LinearGradient id="tablet-main-guide-gradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#7B61FF" />
          <Stop offset="1" stopColor="#FF4FD8" />
        </LinearGradient>
      </Defs>
      <SvgText
        fill="url(#tablet-main-guide-gradient)"
        fontFamily={FONTS.bold}
        fontSize={40}
        textAnchor="middle"
        x={125}
        y={43}>
        이용해주세요
      </SvgText>
    </Svg>
  );
};

const TabletMain = ({ navigation }: Props): React.JSX.Element => {
  const qrTapState = useRef<QrTapState>({ firstTapAt: 0, count: 0 });
  const logoTapState = useRef<QrTapState>({ firstTapAt: 0, count: 0 });
  const hasHandledQrLogin = useRef(false);
  const isMounted = useRef(false);
  const isIssuingQrToken = useRef(false);
  const qrRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearLoginResponse = useQrLoginStore((state) => state.clearLoginResponse);
  const setLoginResponse = useQrLoginStore((state) => state.setLoginResponse);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(true);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const [hasStartedSseConnection, setHasStartedSseConnection] = useState(false);

  const fetchQrToken = useCallback(async (): Promise<void> => {
    if (!isMounted.current || isIssuingQrToken.current || hasHandledQrLogin.current) {
      return;
    }

    if (qrRetryTimer.current !== null) {
      clearTimeout(qrRetryTimer.current);
      qrRetryTimer.current = null;
    }

    isIssuingQrToken.current = true;
    setIsQrLoading(true);
    setQrErrorMessage(null);
    setHasStartedSseConnection(false);
    setQrToken(null);

    try {
      const qrTokenResponse = await issueQrToken();

      if (!isMounted.current || hasHandledQrLogin.current) {
        return;
      }

      if (!qrTokenResponse.success || !qrTokenResponse.data.qrToken) {
        throw new Error(qrTokenResponse.message || QR_TOKEN_ERROR_MESSAGE);
      }

      setQrToken(qrTokenResponse.data.qrToken);
    } catch (error: unknown) {
      if (!isMounted.current || hasHandledQrLogin.current) {
        return;
      }

      console.error('[TabletMain] QR 토큰 발급 실패', error);
      const errorMessage =
        axios.isAxiosError(error) && !error.response
          ? QR_NETWORK_ERROR_MESSAGE
          : QR_TOKEN_ERROR_MESSAGE;
      setQrErrorMessage(errorMessage);
    } finally {
      isIssuingQrToken.current = false;
      if (isMounted.current && !hasHandledQrLogin.current) {
        setIsQrLoading(false);
      }
    }
  }, []);

  useEffect((): (() => void) => {
    isMounted.current = true;
    const initialQrTokenTimer = setTimeout(() => {
      void fetchQrToken();
    }, 0);
    const qrTokenRefreshInterval = setInterval(() => {
      console.warn('[TabletMain] QR 토큰 정기 재발급 요청', {
        intervalMilliseconds: QR_TOKEN_REFRESH_INTERVAL_MS,
        requestedAt: new Date().toISOString(),
      });
      void fetchQrToken();
    }, QR_TOKEN_REFRESH_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearTimeout(initialQrTokenTimer);
      clearInterval(qrTokenRefreshInterval);
      if (qrRetryTimer.current !== null) {
        clearTimeout(qrRetryTimer.current);
      }
    };
  }, [fetchQrToken]);

  useEffect((): (() => void) | undefined => {
    if (!qrToken) {
      return undefined;
    }

    hasHandledQrLogin.current = false;
    let isActive = true;
    console.warn('[TabletMain] QR 로그인 SSE 연결 시작');
    const qrLoginConnection = connectQrLogin(qrToken);

    const handleConnectionFailure = (errorMessage: string): void => {
      if (!isActive || hasHandledQrLogin.current) {
        return;
      }

      isActive = false;
      clearTimeout(connectionTimeout);
      setQrToken(null);
      setHasStartedSseConnection(false);
      setIsQrLoading(false);
      setQrErrorMessage(errorMessage);
      // 승인 결과를 놓친 QR은 이미 소비됐을 수 있어 새 토큰으로 복구한다.
      qrRetryTimer.current = setTimeout(() => {
        void fetchQrToken();
      }, QR_CONNECTION_RETRY_DELAY_MS);
    };

    const connectionTimeout = setTimeout(() => {
      console.warn('[TabletMain] QR 로그인 SSE 연결 대기 시간 초과');
      handleConnectionFailure(QR_NETWORK_ERROR_MESSAGE);
    }, QR_CONNECTION_TIMEOUT_MS);

    const handleQrLoginEvent = (event: QrLoginEvent): void => {
      if (event.type === 'LOGIN_SUCCESS' || event.type === 'message') {
        console.warn('[TabletMain] QR 로그인 SSE 메시지 수신', {
          eventType: event.type,
          hasData: !!event.data,
          dataLength: event.data?.length ?? 0,
        });
      }

      if (!isActive || hasHandledQrLogin.current) {
        return;
      }

      const loginResponse = parseQrLoginResponse(event.data);

      if (!loginResponse) {
        if (event.type === 'LOGIN_SUCCESS') {
          console.error('[TabletMain] QR 로그인 승인 응답 형식 오류', {
            hasData: !!event.data,
            dataLength: event.data?.length ?? 0,
          });
          handleConnectionFailure(QR_LOGIN_RESPONSE_ERROR_MESSAGE);
        }
        return;
      }

      hasHandledQrLogin.current = true;
      clearTimeout(connectionTimeout);
      setQrToken(null);
      setHasStartedSseConnection(false);
      setIsQrLoading(true);
      setLoginResponse(loginResponse);
      setAuth({ ...loginResponse.data, rememberMe: 'N' });
      console.warn('[분류 흐름 2] QR 로그인 정보 저장 완료');
      console.warn('[분류 흐름 3] Base API clientId 발급 요청 시작');

      void createFeedbackDetection()
        .then((response): void => {
          if (!isMounted.current) {
            return;
          }

          if (!response.success || !response.data.clientId) {
            throw new Error(response.message);
          }

          const { clientId } = response.data;
          console.warn('[분류 흐름 4] Base API clientId 발급 성공', { clientId });
          console.warn('[분류 흐름 5] 쓰레기 올려 주세요 화면 이동', { clientId });
          navigation.replace('TabletTrashFeedback', { clientId });
        })
        .catch(async (error: unknown): Promise<void> => {
          if (!isMounted.current) {
            return;
          }

          console.error('[분류 흐름 실패 - clientId 발급]', error);
          setQrToken(null);
          setHasStartedSseConnection(false);
          setQrErrorMessage(CLIENT_ID_ERROR_MESSAGE);
          clearLoginResponse();
          await logout();
          if (isMounted.current) {
            hasHandledQrLogin.current = false;
            setIsQrLoading(false);
          }
        });
    };

    qrLoginConnection.addEventListener('open', (): void => {
      if (!isActive || hasHandledQrLogin.current) {
        return;
      }

      clearTimeout(connectionTimeout);
      console.warn('[TabletMain] QR 로그인 SSE 연결 성공');
      setHasStartedSseConnection(true);
    });

    qrLoginConnection.addEventListener('INIT', (event): void => {
      console.warn('[TabletMain] QR 로그인 SSE 연결 준비 완료', event.data);
    });

    qrLoginConnection.addEventListener('message', handleQrLoginEvent);

    /*
     * 기존 서버는 LOGIN_SUCCESS라는 사용자 정의 이벤트를 보내지만,
     * 중계기에서 event 필드가 사라지면 react-native-sse는 message로 전달한다.
     */
    qrLoginConnection.addEventListener('LOGIN_SUCCESS', (event): void => {
      console.warn('[분류 흐름 1] QR 로그인 성공 이벤트 수신');
      handleQrLoginEvent(event);
    });

    qrLoginConnection.addEventListener('close', (): void => {
      console.warn('[TabletMain] QR 로그인 SSE 연결 종료');
      handleConnectionFailure(QR_NETWORK_ERROR_MESSAGE);
    });

    qrLoginConnection.addEventListener('error', (event): void => {
      console.error('[TabletMain] QR 로그인 SSE 연결 오류', event);
      handleConnectionFailure(QR_NETWORK_ERROR_MESSAGE);
    });

    return () => {
      isActive = false;
      clearTimeout(connectionTimeout);
      qrLoginConnection.removeAllEventListeners();
      qrLoginConnection.close();
    };
  }, [clearLoginResponse, fetchQrToken, logout, navigation, qrToken, setAuth, setLoginResponse]);

  const handleQrPress = useCallback((): void => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - qrTapState.current.firstTapAt;

    if (elapsedTime > LOGIN_TAP_WINDOW_MS) {
      qrTapState.current = { firstTapAt: currentTime, count: 1 };
      return;
    }

    const nextCount = qrTapState.current.count + 1;
    qrTapState.current = { ...qrTapState.current, count: nextCount };

    if (nextCount >= LOGIN_TAP_COUNT) {
      qrTapState.current = { firstTapAt: 0, count: 0 };
      navigation.navigate('TabletLogin');
    }
  }, [navigation]);

  const handleLogoPress = useCallback((): void => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - logoTapState.current.firstTapAt;

    if (elapsedTime > SETTINGS_TAP_WINDOW_MS) {
      logoTapState.current = { firstTapAt: currentTime, count: 1 };
      return;
    }

    const nextCount = logoTapState.current.count + 1;
    logoTapState.current = { ...logoTapState.current, count: nextCount };

    if (nextCount >= SETTINGS_TAP_COUNT) {
      logoTapState.current = { firstTapAt: 0, count: 0 };
      navigation.navigate('TabletSettings');
    }
  }, [navigation]);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <TabletBackgroundCircles />
      <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
        <View className="w-full flex-1 items-center">
          <View className="w-full flex-1 flex-row items-center pt-[62px]">
            <View className="w-1/2 items-center justify-center">
              <Pressable
                accessibilityLabel="QR 코드"
                accessibilityRole="button"
                className="items-center"
                onPress={handleQrPress}>
                <QrCode
                  errorMessage={qrErrorMessage}
                  isLoading={isQrLoading || (!!qrToken && !hasStartedSseConnection)}
                  onRetry={() => void fetchQrToken()}
                  qrToken={hasStartedSseConnection ? qrToken : null}
                />
              </Pressable>
            </View>

            <View className="w-1/2 -translate-y-[20px] items-center justify-center">
              <Pressable
                accessibilityLabel="하드웨어 설정"
                accessibilityRole="button"
                onPress={handleLogoPress}>
                <LogoIcon height={307} width={460} />
              </Pressable>
              <Text className="mt-[20px] text-center font-notoSansKRBold text-[40px] leading-[48px] text-black">
                QR로 로그인 후
              </Text>
              <GradientGuideText />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletMain;
