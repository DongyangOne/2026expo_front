import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { TopBar } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import { kakaoLogin } from '@/services';
import { useAuthStore } from '@/store';

import LoginToast from './components/LoginToast';

type Props = NativeStackScreenProps<RootStackParamList, 'KakaoLogin'>;

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_LOGIN_ERROR_MESSAGE = '카카오 로그인에 실패했습니다.';
const KAKAO_LOGIN_CANCELLED_MESSAGE = '카카오 로그인 요청을 취소했어요.';
const TOAST_DURATION_MS = 2500;

const extractQueryParam = (url: string, key: string): string | null => {
  const queryStart = url.indexOf('?');

  if (queryStart === -1) {
    return null;
  }

  const query = url.slice(queryStart + 1).split('#')[0];

  for (const pair of query.split('&')) {
    if (!pair) continue;
    const [rawK, rawV = ''] = pair.split('=');
    if (decodeURIComponent(rawK) === key) {
      return decodeURIComponent(rawV.replace(/\+/g, ' '));
    }
  }

  return null;
};

const KakaoLoginScreen = ({ navigation, route }: Props) => {
  const persistAuth = useAuthStore((state) => state.persistAuth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasHandledRedirect, setHasHandledRedirect] = useState(false);
  const hasHandledRedirectRef = useRef(false);
  const [csrfState] = useState(
    () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`,
  );

  const restApiKey = Config.KAKAO_REST_API_KEY;
  const redirectUri = Config.KAKAO_REDIRECT_URI;

  const authorizeUrl = `${KAKAO_AUTHORIZE_URL}?response_type=code&client_id=${encodeURIComponent(
    restApiKey ?? '',
  )}&redirect_uri=${encodeURIComponent(redirectUri ?? '')}&state=${encodeURIComponent(csrfState)}`;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const resetLogin = (message: string): void => {
    setToastMessage(message);
    hasHandledRedirectRef.current = false;
    setHasHandledRedirect(false);
  };

  const handleKakaoCode = async (code: string): Promise<void> => {
    if (!redirectUri) {
      return;
    }

    setIsProcessing(true);

    try {
      const rememberMe = route.params?.rememberMe ?? 'N';
      const { data } = await kakaoLogin({ code, redirectUri, rememberMe });

      if (data.needsSignup === 'Y') {
        navigation.replace('Signup', {
          socialType: data.socialType,
          socialProviderId: data.socialProviderId,
          prefillEmail: data.email,
          prefillUsername: data.username,
        });
        return;
      }

      await persistAuth(data, rememberMe);

      const qrToken = route.params?.qrToken;

      if (qrToken) {
        navigation.replace('QrLogin', { qrToken });
        return;
      }

      navigation.replace('MobileTabs');
    } catch (error) {
      resetLogin(error instanceof Error ? error.message : KAKAO_LOGIN_ERROR_MESSAGE);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShouldStartLoad = (request: ShouldStartLoadRequest): boolean => {
    if (!redirectUri || !(request.url === redirectUri || request.url.startsWith(`${redirectUri}?`))) {
      return true;
    }

    if (hasHandledRedirectRef.current || hasHandledRedirect) {
      return false;
    }

    hasHandledRedirectRef.current = true;
    setHasHandledRedirect(true);

    const oauthError = extractQueryParam(request.url, 'error');
    const responseState = extractQueryParam(request.url, 'state');

    if (oauthError === 'access_denied') {
      resetLogin(KAKAO_LOGIN_CANCELLED_MESSAGE);
      return false;
    }

    if (oauthError || responseState !== csrfState) {
      resetLogin(KAKAO_LOGIN_ERROR_MESSAGE);
      return false;
    }

    const code = extractQueryParam(request.url, 'code');

    if (code) {
      void handleKakaoCode(code);
    } else {
      resetLogin(KAKAO_LOGIN_ERROR_MESSAGE);
    }

    return false;
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar title="카카오 로그인" onBack={() => navigation.goBack()} />

        {restApiKey && redirectUri ? (
          <WebView
            source={{ uri: authorizeUrl, headers: { 'Accept-Language': 'ko-KR,ko;q=0.9' } }}
            style={{ flex: 1 }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            cacheEnabled={false}
            startInLoadingState
            renderLoading={() => (
              <View className="absolute inset-0 items-center justify-center bg-background">
                <ActivityIndicator color="#7866FF" size="large" />
              </View>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-background" />
        )}

        {isProcessing ? (
          <View className="absolute inset-0 items-center justify-center bg-[rgba(255,255,255,0.6)]">
            <ActivityIndicator color="#7866FF" size="large" />
          </View>
        ) : null}
      </SafeAreaView>

      <LoginToast
        message={toastMessage ?? (!restApiKey || !redirectUri ? '카카오 로그인 설정이 누락되었습니다.' : '')}
        visible={!!toastMessage || !restApiKey || !redirectUri}
      />
    </View>
  );
};

export default KakaoLoginScreen;
