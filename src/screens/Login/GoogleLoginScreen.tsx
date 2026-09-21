import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
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
const GOOGLE_LOGIN_CONFIG_ERROR_MESSAGE = '구글 로그인 설정이 누락되었습니다.';
const WEBVIEW_LOAD_ERROR_MESSAGE = '구글 로그인 페이지를 불러오지 못했어요.';
const TOAST_DURATION_MS = 2500;

/** 인가 요청 중(authorizing) → 받은 인가 코드를 서버와 교환 중(exchanging). 두 단계를 하나의 boolean으로 섞지 않는다. */
type LoginPhase = 'authorizing' | 'exchanging';

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

  const [phase, setPhase] = useState<LoginPhase>('authorizing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [authorizeAttempt, setAuthorizeAttempt] = useState(0);
  const [csrfState, setCsrfState] = useState(generateState);
  /** 이미 처리한 리다이렉트 URL. 같은 리다이렉트가 세 콜백으로 중복 통지되는 것을 막는다. */
  const handledRedirectUrlRef = useRef<string | null>(null);

  const clientId = Config.GOOGLE_CLIENT_ID;
  const redirectUri = Config.GOOGLE_REDIRECT_URI;
  const isConfigured = !!clientId && !!redirectUri;

  const authorizeUrl = `${GOOGLE_AUTHORIZE_URL}?response_type=code&client_id=${encodeURIComponent(
    clientId ?? '',
  )}&redirect_uri=${encodeURIComponent(redirectUri ?? '')}&scope=${encodeURIComponent(
    'openid email profile',
  )}&state=${encodeURIComponent(csrfState)}&prompt=select_account`;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // 설정이 비어 있으면 빈 화면에 머무르게 두지 않고, 안내한 뒤 되돌아간다.
  const configErrorMessage = isConfigured ? null : GOOGLE_LOGIN_CONFIG_ERROR_MESSAGE;

  useEffect(() => {
    if (isConfigured) {
      return;
    }

    const timer = setTimeout(() => navigation.goBack(), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isConfigured, navigation]);

  /** 리다이렉트 URI 자체이거나 그 뒤에 쿼리가 붙은 주소만 콜백으로 인정한다. */
  const isRedirectUrl = (url: string): boolean =>
    !!redirectUri && (url === redirectUri || url.startsWith(`${redirectUri}?`));

  /** 실패한 시도를 버리고 인가 요청부터 다시 시작한다. state도 새로 발급해 이전 시도의 응답을 받지 않는다. */
  const restartAuthorization = (message?: string): void => {
    if (message) {
      setToastMessage(message);
    }

    handledRedirectUrlRef.current = null;
    setLoadErrorMessage(null);
    setCsrfState(generateState());
    setAuthorizeAttempt((prev) => prev + 1);
    setPhase('authorizing');
  };

  const handleGoogleCode = async (code: string): Promise<void> => {
    if (!redirectUri) {
      return;
    }

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

      // 로그인에 성공한 뒤에는 뒤로가기로 로그인 화면에 돌아갈 수 없어야 하므로 스택을 비운다.
      if (qrToken) {
        navigation.reset({ index: 0, routes: [{ name: 'QrLogin', params: { qrToken } }] });
        return;
      }

      navigation.reset({ index: 0, routes: [{ name: 'MobileTabs' }] });
    } catch (error) {
      restartAuthorization(error instanceof Error ? error.message : GOOGLE_LOGIN_ERROR_MESSAGE);
    }
  };

  const handleRedirectUrl = (url: string): void => {
    if (handledRedirectUrlRef.current === url) {
      return;
    }

    handledRedirectUrlRef.current = url;

    const oauthError = extractQueryParam(url, 'error');

    // 사용자가 직접 취소한 경우엔 인가 화면을 다시 띄우지 않고 로그인 화면으로 돌려보낸다.
    if (oauthError === 'access_denied') {
      navigation.goBack();
      return;
    }

    if (oauthError) {
      restartAuthorization(
        extractQueryParam(url, 'error_description') ?? GOOGLE_LOGIN_ERROR_MESSAGE,
      );
      return;
    }

    if (extractQueryParam(url, 'state') !== csrfState) {
      restartAuthorization(GOOGLE_LOGIN_ERROR_MESSAGE);
      return;
    }

    const code = extractQueryParam(url, 'code');

    if (!code) {
      restartAuthorization(GOOGLE_LOGIN_ERROR_MESSAGE);
      return;
    }

    setPhase('exchanging');
    void handleGoogleCode(code);
  };

  const handleShouldStartLoad = (request: ShouldStartLoadRequest): boolean => {
    if (!isRedirectUrl(request.url)) {
      return true;
    }

    handleRedirectUrl(request.url);
    return false;
  };

  // Android에서는 서버 리다이렉트가 onShouldStartLoadWithRequest를 거치지 않는 경우가 있어 두 콜백으로 보완한다.
  const handleLoadStart = (event: WebViewNavigationEvent): void => {
    if (!isRedirectUrl(event.nativeEvent.url)) {
      return;
    }

    handleRedirectUrl(event.nativeEvent.url);
  };

  const handleNavigationStateChange = (navigationState: WebViewNavigation): void => {
    if (!isRedirectUrl(navigationState.url)) {
      return;
    }

    handleRedirectUrl(navigationState.url);
  };

  /**
   * 리다이렉트 URI는 가로채기만 하고 실제로 로드하지 않으므로 그 주소의 로드 실패는 정상 흐름이다.
   * 그 외의 실패는 삼키지 않고 사용자에게 알린다.
   */
  const handleWebViewError = (event: WebViewErrorEvent): void => {
    const { url, description } = event.nativeEvent;

    if (isRedirectUrl(url) || handledRedirectUrlRef.current !== null) {
      event.preventDefault();
      return;
    }

    setLoadErrorMessage(description || WEBVIEW_LOAD_ERROR_MESSAGE);
  };

  const renderWebViewLoading = () => (
    <View className="absolute inset-0 items-center justify-center bg-background">
      <ActivityIndicator color="#7866FF" size="large" />
    </View>
  );

  const renderWebViewError = () => (
    <View className="absolute inset-0 items-center justify-center bg-background px-[24px]">
      <Text className="text-center font-notoSansKRRegular text-sm text-body">
        {loadErrorMessage ?? WEBVIEW_LOAD_ERROR_MESSAGE}
      </Text>
      <Pressable
        accessibilityLabel="구글 로그인 다시 시도"
        accessibilityRole="button"
        className="mt-[20px] h-[48px] items-center justify-center rounded-[10px] bg-purple px-[24px]"
        onPress={() => restartAuthorization()}>
        <Text className="font-notoSansKRBold text-[15px] text-white">다시 시도</Text>
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar
          title="구글 로그인"
          onBack={phase === 'exchanging' ? undefined : () => navigation.goBack()}
        />

        {isConfigured && phase === 'authorizing' ? (
          <WebView
            key={authorizeAttempt}
            source={{ uri: authorizeUrl, headers: { 'Accept-Language': 'ko-KR,ko;q=0.9' } }}
            style={{ flex: 1 }}
            onError={handleWebViewError}
            onLoadStart={handleLoadStart}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            cacheEnabled={false}
            incognito
            startInLoadingState
            renderLoading={renderWebViewLoading}
            renderError={renderWebViewError}
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-background" />
        )}

        {phase === 'exchanging' ? (
          <View className="absolute inset-0 items-center justify-center bg-[rgba(255,255,255,0.6)]">
            <ActivityIndicator color="#7866FF" size="large" />
          </View>
        ) : null}
      </SafeAreaView>

      <LoginToast
        message={toastMessage ?? configErrorMessage ?? ''}
        visible={!!toastMessage || !!configErrorMessage}
      />
    </View>
  );
};

export default GoogleLoginScreen;
