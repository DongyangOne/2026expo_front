import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { TopBar } from '@/components/ui';
import { STORAGE_KEYS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { naverLogin } from '@/services';
import { useAuthStore } from '@/store';

import LoginToast from './components/LoginToast';

type Props = NativeStackScreenProps<RootStackParamList, 'NaverLogin'>;

const NAVER_AUTHORIZE_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_LOGIN_ERROR_MESSAGE = '네이버 로그인에 실패했습니다.';
const NAVER_LOGIN_CANCELLED_MESSAGE = '네이버 로그인 요청을 취소했어요.';
const TOAST_DURATION_MS = 2500;

const extractQueryParam = (url: string, key: string): string | null => {
  const queryStart = url.indexOf('?');

  if (queryStart === -1) {
    return null;
  }

  return new URLSearchParams(url.slice(queryStart + 1).split('#')[0]).get(key);
};

const generateState = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const NaverLoginScreen = ({ navigation, route }: Props) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasHandledRedirect, setHasHandledRedirect] = useState(false);
  const [csrfState] = useState(generateState);
  const hasHandledRedirectRef = useRef(false);

  const clientId = Config.NAVER_CLIENT_ID;
  const redirectUri = Config.NAVER_REDIRECT_URI;

  const authorizeUrl = `${NAVER_AUTHORIZE_URL}?response_type=code&client_id=${encodeURIComponent(
    clientId ?? '',
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

  const handleNaverCode = async (code: string): Promise<void> => {
    if (!redirectUri) {
      return;
    }

    setIsProcessing(true);

    try {
      const rememberMe = route.params?.rememberMe ?? 'N';
      const { data } = await naverLogin({ code, redirectUri, rememberMe });

      if (data.needsSignup === 'Y') {
        navigation.replace('Signup', {
          socialType: data.socialType,
          socialProviderId: data.socialProviderId,
          prefillEmail: data.email,
          prefillUsername: data.username,
        });
        return;
      }

      setAuth(data);

      if (rememberMe === 'Y') {
        const { authUser } = useAuthStore.getState();

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, data.accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken],
          [STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser)],
        ]);
      }

      const qrToken = route.params?.qrToken;

      if (qrToken) {
        navigation.replace('QrLogin', { qrToken });
        return;
      }

      navigation.replace('MobileTabs');
    } catch (error) {
      resetLogin(error instanceof Error ? error.message : NAVER_LOGIN_ERROR_MESSAGE);
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

    const responseState = extractQueryParam(request.url, 'state');
    const oauthError = extractQueryParam(request.url, 'error');

    if (oauthError === 'access_denied') {
      resetLogin(NAVER_LOGIN_CANCELLED_MESSAGE);
      return false;
    }

    if (oauthError || responseState !== csrfState) {
      resetLogin(NAVER_LOGIN_ERROR_MESSAGE);
      return false;
    }

    const code = extractQueryParam(request.url, 'code');

    if (code) {
      void handleNaverCode(code);
    } else {
      resetLogin(NAVER_LOGIN_ERROR_MESSAGE);
    }

    return false;
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar title="네이버 로그인" onBack={() => navigation.goBack()} />

        {clientId && redirectUri && !hasHandledRedirect ? (
          <WebView
            source={{ uri: authorizeUrl, headers: { 'Accept-Language': 'ko-KR,ko;q=0.9' } }}
            style={{ flex: 1 }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            cacheEnabled={false}
            incognito
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
        message={toastMessage ?? (!clientId || !redirectUri ? '네이버 로그인 설정이 누락되었습니다.' : '')}
        visible={!!toastMessage || !clientId || !redirectUri}
      />
    </View>
  );
};

export default NaverLoginScreen;
