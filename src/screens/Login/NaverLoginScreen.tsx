import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { TopBar } from '@/components/ui';
import { STORAGE_KEYS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { naverLogin } from '@/services';
import { useAuthStore } from '@/store';
import type { ApiResponse } from '@/types';

import LoginToast from './components/LoginToast';

type Props = NativeStackScreenProps<RootStackParamList, 'NaverLogin'>;

const NAVER_AUTHORIZE_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_LOGIN_ERROR_MESSAGE = '네이버 로그인에 실패했습니다.';

const extractQueryParam = (url: string, key: string): string | null => {
  const queryStart = url.indexOf('?');

  if (queryStart === -1) {
    return null;
  }

  return new URLSearchParams(url.slice(queryStart + 1)).get(key);
};

const generateState = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const NaverLoginScreen = ({ navigation, route }: Props) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasHandledRedirect, setHasHandledRedirect] = useState(false);
  const [csrfState] = useState(generateState);

  const clientId = Config.NAVER_CLIENT_ID;
  const redirectUri = Config.NAVER_REDIRECT_URI;

  const authorizeUrl = `${NAVER_AUTHORIZE_URL}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${csrfState}`;

  // TODO: 디버깅용 임시 로그, 확인 후 제거
  useEffect(() => {
    console.log('[NaverLoginScreen] NAVER_CLIENT_ID (JSON):', JSON.stringify(clientId));
    console.log('[NaverLoginScreen] NAVER_REDIRECT_URI (JSON):', JSON.stringify(redirectUri));
    console.log('[NaverLoginScreen] authorizeUrl (JSON):', JSON.stringify(authorizeUrl));
  }, [authorizeUrl, clientId, redirectUri]);

  const handleNaverCode = async (code: string): Promise<void> => {
    if (!redirectUri) {
      return;
    }

    setIsProcessing(true);

    try {
      const rememberMe = route.params?.rememberMe ?? 'N';
      // TODO: 디버깅용 임시 로그, 확인 후 제거
      console.log('[NaverLoginScreen] POST /api/v1/auth/naver 요청:', {
        code,
        redirectUri,
        rememberMe,
      });

      const { data } = await naverLogin({ code, redirectUri, rememberMe });

      // TODO: 디버깅용 임시 로그, 확인 후 제거
      console.log('[NaverLoginScreen] /api/v1/auth/naver 응답 성공:', data);

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
      // TODO: 디버깅용 임시 로그, 확인 후 제거
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      console.log('[NaverLoginScreen] /api/v1/auth/naver 요청 실패, status:', axiosError.response?.status);
      console.log('[NaverLoginScreen] /api/v1/auth/naver 요청 실패, response.data:', axiosError.response?.data);
      console.log('[NaverLoginScreen] /api/v1/auth/naver 요청 실패, error.message:', axiosError.message);
      console.log('[NaverLoginScreen] /api/v1/auth/naver 요청 실패, 원본 error:', error);

      setToastMessage(error instanceof Error ? error.message : NAVER_LOGIN_ERROR_MESSAGE);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShouldStartLoad = (request: ShouldStartLoadRequest): boolean => {
    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[NaverLoginScreen] onShouldStartLoadWithRequest url:', request.url);

    if (!redirectUri || !request.url.startsWith(redirectUri)) {
      return true;
    }

    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[NaverLoginScreen] redirectUri 감지됨:', request.url);

    if (hasHandledRedirect) {
      return false;
    }

    setHasHandledRedirect(true);

    const responseState = extractQueryParam(request.url, 'state');

    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[NaverLoginScreen] 응답 state:', responseState, '/ 생성한 state:', csrfState);

    if (responseState !== csrfState) {
      setToastMessage(NAVER_LOGIN_ERROR_MESSAGE);
      return false;
    }

    const code = extractQueryParam(request.url, 'code');

    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[NaverLoginScreen] 추출된 code:', code);

    if (code) {
      void handleNaverCode(code);
    } else {
      setToastMessage(NAVER_LOGIN_ERROR_MESSAGE);
    }

    return false;
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar title="네이버 로그인" onBack={() => navigation.goBack()} />

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

        {isProcessing ? (
          <View className="absolute inset-0 items-center justify-center bg-[rgba(255,255,255,0.6)]">
            <ActivityIndicator color="#7866FF" size="large" />
          </View>
        ) : null}
      </SafeAreaView>

      <LoginToast message={toastMessage ?? ''} visible={!!toastMessage} />
    </View>
  );
};

export default NaverLoginScreen;
