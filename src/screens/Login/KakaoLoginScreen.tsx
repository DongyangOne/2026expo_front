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
import { kakaoLogin } from '@/services';
import { useAuthStore } from '@/store';
import type { ApiResponse } from '@/types';

import LoginToast from './components/LoginToast';

type Props = NativeStackScreenProps<RootStackParamList, 'KakaoLogin'>;

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_LOGIN_ERROR_MESSAGE = '카카오 로그인에 실패했습니다.';

const extractQueryParam = (url: string, key: string): string | null => {
  const queryStart = url.indexOf('?');

  if (queryStart === -1) {
    return null;
  }

  return new URLSearchParams(url.slice(queryStart + 1)).get(key);
};

const KakaoLoginScreen = ({ navigation, route }: Props) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasHandledRedirect, setHasHandledRedirect] = useState(false);

  const restApiKey = Config.KAKAO_REST_API_KEY;
  const redirectUri = Config.KAKAO_REDIRECT_URI;

  const authorizeUrl = `${KAKAO_AUTHORIZE_URL}?response_type=code&client_id=${restApiKey}&redirect_uri=${redirectUri}`;

  // TODO: 디버깅용 임시 로그, 확인 후 제거
  useEffect(() => {
    console.log('[KakaoLoginScreen] KAKAO_REST_API_KEY:', restApiKey);
    console.log('[KakaoLoginScreen] KAKAO_REDIRECT_URI:', redirectUri);
    console.log('[KakaoLoginScreen] authorizeUrl:', authorizeUrl);
  }, [authorizeUrl, redirectUri, restApiKey]);

  const handleKakaoCode = async (code: string): Promise<void> => {
    if (!redirectUri) {
      return;
    }

    setIsProcessing(true);

    try {
      const rememberMe = route.params?.rememberMe ?? 'N';
      // TODO: 디버깅용 임시 로그, 확인 후 제거
      console.log('[KakaoLoginScreen] POST /api/v1/auth/kakao 요청:', {
        code,
        redirectUri,
        rememberMe,
      });

      const { data } = await kakaoLogin({ code, redirectUri, rememberMe });

      // TODO: 디버깅용 임시 로그, 확인 후 제거
      console.log('[KakaoLoginScreen] /api/v1/auth/kakao 응답 성공:', data);

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
      console.log('[KakaoLoginScreen] /api/v1/auth/kakao 요청 실패, status:', axiosError.response?.status);
      console.log('[KakaoLoginScreen] /api/v1/auth/kakao 요청 실패, response.data:', axiosError.response?.data);
      console.log('[KakaoLoginScreen] /api/v1/auth/kakao 요청 실패, error.message:', axiosError.message);
      console.log('[KakaoLoginScreen] /api/v1/auth/kakao 요청 실패, 원본 error:', error);

      setToastMessage(error instanceof Error ? error.message : KAKAO_LOGIN_ERROR_MESSAGE);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShouldStartLoad = (request: ShouldStartLoadRequest): boolean => {
    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[KakaoLoginScreen] onShouldStartLoadWithRequest url:', request.url);

    if (!redirectUri || !request.url.startsWith(redirectUri)) {
      return true;
    }

    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[KakaoLoginScreen] redirectUri 감지됨:', request.url);

    if (hasHandledRedirect) {
      console.log('[KakaoLoginScreen] 이미 처리된 redirect, 무시');
      return false;
    }

    setHasHandledRedirect(true);

    const code = extractQueryParam(request.url, 'code');

    // TODO: 디버깅용 임시 로그, 확인 후 제거
    console.log('[KakaoLoginScreen] 추출된 code:', code);

    if (code) {
      void handleKakaoCode(code);
    } else {
      console.log('[KakaoLoginScreen] code 파라미터를 찾지 못함, 전체 url:', request.url);
      setToastMessage(KAKAO_LOGIN_ERROR_MESSAGE);
    }

    return false;
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar title="카카오 로그인" onBack={() => navigation.goBack()} />

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

export default KakaoLoginScreen;
