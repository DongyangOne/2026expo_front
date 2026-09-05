import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import CheckedIcon from '@/components/ui/icons/checked.svg';
import { STORAGE_KEYS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { login } from '@/services';
import { useAuthStore } from '@/store';

import LoginField from './components/LoginField';
import LoginToast from './components/LoginToast';
import SignupGradientLink from './components/SignupGradientLink';
import SocialLoginRow from './components/SocialLoginRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const TOAST_DURATION_MS = 2500;

const ID_PATTERN = /^[a-z0-9]{4,12}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[\x21-\x7E]{8,16}$/;

const LoginScreen = ({ navigation, route }: Props) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [id, setId] = useState(route.params?.loginId ?? '');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const idError = useMemo(() => {
    if (!id) {
      return '아이디를 입력해 주세요.';
    }

    if (!ID_PATTERN.test(id)) {
      return '아이디는 영문 소문자와 숫자 4~12자로 입력해 주세요.';
    }

    return '';
  }, [id]);

  const passwordError = useMemo(() => {
    if (!password) {
      return '비밀번호를 입력해 주세요.';
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return '비밀번호는 영문, 숫자, 특수문자를 모두 포함해 8~16자로 입력해 주세요.';
    }

    return '';
  }, [password]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleLogin = async () => {
    setSubmitAttempted(true);

    if (idError || passwordError) {
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await login({
        loginId: id,
        password,
        rememberMe: autoLogin ? 'Y' : 'N',
      });

      setAuth(data);

      if (autoLogin) {
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
      setToastMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialPress = (_provider: 'google' | 'naver' | 'kakao') => {
    // TODO: 소셜 로그인 화면/SDK 연동
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView contentContainerClassName="px-11 pb-[40px]" keyboardShouldPersistTaps="handled">
          <Text
            className="mb-[55px] mt-[80px] text-center font-notoSansKRBold text-4xl leading-[52px] text-black"
            style={{ includeFontPadding: false }}>
            Log in
          </Text>

          <LoginField
            label="아이디"
            placeholder="아이디를 입력해 주세요."
            maxLength={12}
            value={id}
            errorText={submitAttempted ? idError : ''}
            onChangeText={(value) => setId(value.replace(/[^a-z0-9]/g, ''))}
          />

          <View className="mt-[18px]">
            <LoginField
              label="비밀번호"
              placeholder="비밀번호를 입력해 주세요."
              maxLength={16}
              secureTextEntry
              value={password}
              errorText={submitAttempted ? passwordError : ''}
              onChangeText={(value) => setPassword(value.replace(/[^\x21-\x7E]/g, ''))}
            />
          </View>

          <Pressable
            className="mt-[2px] flex-row items-center self-start"
            hitSlop={8}
            onPress={() => setAutoLogin((current) => !current)}>
            <View
              className={`size-[16px] items-center justify-center rounded-[4px] ${
                autoLogin ? 'bg-purple' : 'border border-border bg-white'
              }`}>
              {autoLogin ? <CheckedIcon height={9} width={10} /> : null}
            </View>
            <Text className="ml-[6px] font-notoSansKRDemiLight text-sm text-black">
              자동 로그인
            </Text>
          </Pressable>

          <View className="mt-[29px] flex-row gap-[14px]">
            <Pressable
              className="h-[53px] flex-1 items-center justify-center rounded-[6px] bg-[rgba(229,231,235,0.5)]"
              onPress={() => navigation.navigate('FindId')}>
              <Text className="font-notoSansKRDemiLight text-xs text-black">아이디 찾기</Text>
            </Pressable>
            <Pressable
              className="h-[53px] flex-1 items-center justify-center rounded-[6px] bg-[rgba(229,231,235,0.5)]"
              onPress={() => navigation.navigate('FindPassword')}>
              <Text className="font-notoSansKRDemiLight text-xs text-black">비밀번호 찾기</Text>
            </Pressable>
          </View>

          <Pressable
            className="mt-[52px] h-[50px] w-[250px] items-center justify-center self-center overflow-hidden rounded-full"
            disabled={isLoading}
            onPress={handleLogin}>
            <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
              <Defs>
                <LinearGradient id="login-submit-gradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#7B61FF" stopOpacity={0.8} />
                  <Stop offset="1" stopColor="#FF4FD8" stopOpacity={0.8} />
                </LinearGradient>
              </Defs>
              <Rect fill="url(#login-submit-gradient)" height="100%" rx={25} width="100%" />
            </Svg>
            <Text className="font-notoSansKRBold text-[15.5px] text-white">로그인</Text>
          </Pressable>

          <View className="mt-[42px] flex-row items-center">
            <View className="h-[1px] flex-1 bg-border" />
            <Text className="mx-[16px] font-notoSansKRDemiLight text-sm text-gray">또는</Text>
            <View className="h-[1px] flex-1 bg-border" />
          </View>

          <View className="mt-[25px]">
            <SocialLoginRow onPressSocial={handleSocialPress} />
          </View>

          <View className="mt-[33px] flex-row items-center justify-center">
            <Text className="font-notoSansKRDemiLight text-sm text-gray">계정이 없으신가요?</Text>
            <SignupGradientLink onPress={() => navigation.navigate('Signup')} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <LoginToast message={toastMessage ?? ''} visible={!!toastMessage} />
    </View>
  );
};

export default LoginScreen;
