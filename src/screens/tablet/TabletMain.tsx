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
import { connectQrLogin, issueQrToken } from '@/services';
import { useAuthStore, useQrLoginStore } from '@/store';
import type { QrLoginSseResponse } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletMain'>;

interface QrTapState {
  firstTapAt: number;
  count: number;
}

const QR_SIZE = 440;
const QR_TOKEN_REFRESH_INTERVAL_MS = 2 * 60 * 1000 + 50 * 1000;
const LOGIN_TAP_WINDOW_MS = 5000;
const LOGIN_TAP_COUNT = 5;
const QR_TOKEN_ERROR_MESSAGE = 'QR 코드를 불러오지 못했습니다.';
const QR_NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 후 다시 시도해주세요.';
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

const QrCode = ({
  qrToken,
  isLoading,
  errorMessage,
  onRetry,
}: QrCodeProps): React.JSX.Element => {
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
  const hasHandledQrLogin = useRef(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoginResponse = useQrLoginStore((state) => state.setLoginResponse);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(true);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const [hasStartedSseConnection, setHasStartedSseConnection] = useState(false);

  const fetchQrToken = useCallback(async (): Promise<void> => {
    setIsQrLoading(true);
    setQrErrorMessage(null);
    setHasStartedSseConnection(false);
    setQrToken(null);

    try {
      const qrTokenResponse = await issueQrToken();

      if (!qrTokenResponse.success || !qrTokenResponse.data.qrToken) {
        throw new Error(qrTokenResponse.message || QR_TOKEN_ERROR_MESSAGE);
      }

      console.warn('[TabletMain] 발급된 QR 토큰', qrTokenResponse.data.qrToken);
      setQrToken(qrTokenResponse.data.qrToken);
    } catch (error: unknown) {
      console.error('[TabletMain] QR 토큰 발급 실패', error);
      const errorMessage =
        axios.isAxiosError(error) && !error.response
          ? QR_NETWORK_ERROR_MESSAGE
          : QR_TOKEN_ERROR_MESSAGE;
      setQrErrorMessage(errorMessage);
    } finally {
      setIsQrLoading(false);
    }
  }, []);

  useEffect((): (() => void) => {
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
      clearTimeout(initialQrTokenTimer);
      clearInterval(qrTokenRefreshInterval);
    };
  }, [fetchQrToken]);

  useEffect((): (() => void) | undefined => {
    if (!qrToken) {
      return undefined;
    }

    hasHandledQrLogin.current = false;
    console.warn('[TabletMain] SSE 연결에 사용하는 QR 토큰', qrToken);
    const qrLoginConnection = connectQrLogin(qrToken);
    const qrDisplayTimer = setTimeout((): void => {
      setHasStartedSseConnection(true);
    }, 0);

    qrLoginConnection.addEventListener('open', (): void => {
      console.warn('[TabletMain] QR 로그인 SSE 연결 성공');
      setHasStartedSseConnection(true);
    });

    qrLoginConnection.addEventListener('INIT', (event): void => {
      console.warn('[TabletMain] QR 로그인 SSE 연결 준비 완료', event.data);
    });

    qrLoginConnection.addEventListener('LOGIN_SUCCESS', (event): void => {
      console.warn('[TabletMain] QR 로그인 승인 응답 수신', event.data);

      if (hasHandledQrLogin.current) {
        return;
      }

      const loginResponse = parseQrLoginResponse(event.data);

      if (!loginResponse) {
        console.error('[TabletMain] QR 로그인 승인 응답 형식 오류');
        return;
      }

      hasHandledQrLogin.current = true;
      setLoginResponse(loginResponse);
      setAuth({ ...loginResponse.data, rememberMe: 'N' });
      navigation.replace('TabletTrashFeedback');
    });

    qrLoginConnection.addEventListener('close', (): void => {
      console.warn('[TabletMain] QR 로그인 SSE 연결 종료');
      setHasStartedSseConnection(false);
    });

    qrLoginConnection.addEventListener('error', (event): void => {
      console.error('[TabletMain] QR 로그인 SSE 연결 오류', event);
      setHasStartedSseConnection(false);
    });

    return () => {
      clearTimeout(qrDisplayTimer);
      qrLoginConnection.removeAllEventListeners();
      qrLoginConnection.close();
    };
  }, [navigation, qrToken, setAuth, setLoginResponse]);

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

  const handleTemporaryFeedbackPress = useCallback((): void => {
    navigation.navigate('TabletTrashFeedback');
  }, [navigation]);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <TabletBackgroundCircles />
      <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
        <View className="w-full flex-1 items-center">
          <Pressable
            className="absolute top-[24px] z-10 h-[38px] min-w-[150px] items-center justify-center rounded-[10px] bg-purple px-[16px]"
            onPress={handleTemporaryFeedbackPress}>
            <Text className="font-notoSansKRBold text-[13px] text-white">임시 피드백 이동</Text>
          </Pressable>

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
              <LogoIcon height={307} width={460} />
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
