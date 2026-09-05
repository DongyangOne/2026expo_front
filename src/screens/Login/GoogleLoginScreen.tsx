import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type {
  ShouldStartLoadRequest,
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';

import { TopBar } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import { googleLogin } from '@/services';
import { useAuthStore } from '@/store';

import LoginToast from './components/LoginToast';

type Props = NativeStackScreenProps<RootStackParamList, 'GoogleLogin'>;

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_LOGIN_ERROR_MESSAGE = '구글 로그인에 실패했습니다.';
const GOOGLE_LOGIN_CANCELLED_MESSAGE = '구글 로그인 요청을 취소했어요.';
const TOAST_DURATION_MS = 2500;

const extractQueryParam = (url: string, key: string): string | null => {
  const queryStart = url.indexOf('?');

  if (queryStart === -1) {
    return null;
  }

  const query = url.slice(queryStart + 1).split('#')[0];
  return new URLSearchParams(query).get(key);
};

const generateState = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const GoogleLoginScreen = ({ navigation, route }: Props) => {
  const persistAuth = useAuthStore((state) => state.persistAuth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasHandledRedirect, setHasHandledRedirect] = useState(false);
  const [csrfState] = useState(generateState);
  const hasHandledRedirectRef = useRef(false);

  const clientId = Config.GOOGLE_CLIENT_ID;
  const redirectUri = Config.GOOGLE_REDIRECT_URI;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const authorizeUrl = `${GOOGLE_AUTHORIZE_URL}?response_type=code&client_id=${encodeURIComponent(
    clientId ?? '',
  )}&redirect_uri=${encodeURIComponent(redirectUri ?? '')}&scope=${encodeURIComponent(
    'openid email profile',
  )}&state=${encodeURIComponent(csrfState)}&prompt=select_account`;

  const handleGoogleCode = async (code: string): Promise<void> => {
    if (!redirectUri) {
      return;
    }

    setIsProcessing(true);

    try {
      const rememberMe = route.params?.rememberMe ?? 'N';
      const { data } = await googleLogin({ code, redirectUri, rememberMe });

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
      setToastMessage(error instanceof Error ? error.message : GOOGLE_LOGIN_ERROR_MESSAGE);
      hasHandledRedirectRef.current = false;
      setHasHandledRedirect(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedirectUrl = (url: string): boolean => {
    if (hasHandledRedirectRef.current) {
      return true;
    }

    const responseState = extractQueryParam(url, 'state');
    const oauthError = extractQueryParam(url, 'error');
    const oauthErrorDescription = extractQueryParam(url, 'error_description');

    hasHandledRedirectRef.current = true;
    setHasHandledRedirect(true);

    if (oauthError) {
      setToastMessage(
        oauthError === 'access_denied'
          ? GOOGLE_LOGIN_CANCELLED_MESSAGE
          : oauthErrorDescription ?? GOOGLE_LOGIN_ERROR_MESSAGE,
      );
      hasHandledRedirectRef.current = false;
      setHasHandledRedirect(false);
      return true;
    }

    if (responseState !== csrfState) {
      setToastMessage(GOOGLE_LOGIN_ERROR_MESSAGE);
      hasHandledRedirectRef.current = false;
      setHasHandledRedirect(false);
      return true;
    }

    const code = extractQueryParam(url, 'code');

    if (code) {
      void handleGoogleCode(code);
    } else {
      setToastMessage(GOOGLE_LOGIN_ERROR_MESSAGE);
      hasHandledRedirectRef.current = false;
      setHasHandledRedirect(false);
    }

    return true;
  };

  const handleShouldStartLoad = (request: ShouldStartLoadRequest): boolean => {
    if (!redirectUri || !request.url.startsWith(redirectUri)) {
      return true;
    }

    handleRedirectUrl(request.url);
    return false;
  };

  const handleLoadStart = (event: WebViewNavigationEvent): void => {
    if (!redirectUri || !event.nativeEvent.url.startsWith(redirectUri)) {
      return;
    }

    handleRedirectUrl(event.nativeEvent.url);
  };

  const handleNavigationStateChange = (navigationState: WebViewNavigation): void => {
    if (!redirectUri || !navigationState.url.startsWith(redirectUri)) {
      return;
    }

    handleRedirectUrl(navigationState.url);
  };

  const handleWebViewError = (event: WebViewErrorEvent): void => {
    const errorUrl = event.nativeEvent.url;

    if (
      hasHandledRedirectRef.current ||
      (redirectUri && errorUrl && errorUrl.startsWith(redirectUri))
    ) {
      event.preventDefault();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar title="구글 로그인" onBack={() => navigation.goBack()} />

        {clientId && redirectUri && !hasHandledRedirect ? (
          <WebView
            source={{ uri: authorizeUrl, headers: { 'Accept-Language': 'ko-KR,ko;q=0.9' } }}
            style={{ flex: 1 }}
            onError={handleWebViewError}
            onLoadStart={handleLoadStart}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            cacheEnabled={false}
            incognito
            startInLoadingState
            renderLoading={() => (
              <View className="absolute inset-0 items-center justify-center bg-background">
                <ActivityIndicator color="#7866FF" size="large" />
              </View>
            )}
            renderError={() => (
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
        message={
          toastMessage ?? (!clientId || !redirectUri ? '구글 로그인 설정이 누락되었습니다.' : '')
        }
        visible={!!toastMessage || !clientId || !redirectUri}
      />
    </View>
  );
};

export default GoogleLoginScreen;
