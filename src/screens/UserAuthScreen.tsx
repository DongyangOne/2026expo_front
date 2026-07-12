import React, { useEffect, useRef, useState } from 'react';
import { cssInterop } from 'nativewind';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useCallback } from 'react';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/navigation/types';

cssInterop(LinearGradient, {
  className: 'style',
});
import BackArrow from '../assets/images/vector.svg';

const AUTH_CODE_DURATION = 300; // 5분 (초 단위)

// 이메일 형식 체크용 정규식
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// TODO: 실제로는 서버에서 전송한 인증코드와 비교해야 함. 지금은 임의값으로 고정.
const MOCK_CORRECT_AUTH_CODE = '123456';

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const UserAuthScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  // 인증코드 입력창 노출 여부
  const [isCodeSent, setIsCodeSent] = useState(false);
  // 남은 시간(초)
  const [remainingSeconds, setRemainingSeconds] = useState(AUTH_CODE_DURATION);
  // 시간 만료 여부
  const [isExpired, setIsExpired] = useState(false);

  // 이메일 형식 오류 문구
  const [emailError, setEmailError] = useState('');
  // 인증코드 불일치 오류 문구
  const [authCodeError, setAuthCodeError] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    setIsExpired(false);
    setRemainingSeconds(AUTH_CODE_DURATION);

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useFocusEffect(
    useCallback(() => {
      clearTimer();

      setEmail('');
      setAuthCode('');
      setIsCodeSent(false);
      setRemainingSeconds(AUTH_CODE_DURATION);
      setIsExpired(false);
      setEmailError('');
      setAuthCodeError('');

      return () => clearTimer();
    }, []),
  );

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleSendCode = () => {
    if (email.trim().length === 0) return;

    // 이메일 형식 체크
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('이메일 형식이 올바르지 않아요.');
      return;
    }

    setEmailError('');
    // TODO: 실제 이메일 인증코드 전송 API 호출
    setAuthCode('');
    setAuthCodeError('');
    setIsCodeSent(true);
    startTimer();
  };

  const handleEditProfile = () => {
    if (!isCodeSent || isExpired || authCode.trim().length === 0) return;

    if (authCode.trim() !== MOCK_CORRECT_AUTH_CODE) {
      setAuthCodeError('인증코드가 일치하지 않아요.');
      return;
    }

    setAuthCodeError('');
    navigation.navigate('EditProfile', { email });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="mx-11 flex-1">
        <View className="relative mt-[37px] flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Account')}
            className="absolute left-0">
            <BackArrow />
          </TouchableOpacity>
          {/* 타이틀 */}
          <Text className=" text-center font-notoSansKRBold text-xl text-black">사용자 인증</Text>
        </View>

        {/* 아이디 */}
        <View className="mt-52">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">아이디</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput className="text-sm text-black"></TextInput>
          </View>
        </View>

        {/* 이메일 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">이메일</Text>
          <View className="flex-row">
            <View className="flex-1 flex-row items-center justify-between rounded-l-xl border border-border bg-white px-3">
              <TextInput
                className="flex-1 text-sm text-black"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="이메일을 입력해 주세요"
              />
            </View>
            <TouchableOpacity onPress={handleSendCode} disabled={email.trim().length === 0}>
              <LinearGradient
                colors={['#7B61FF', '#FF4FD8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="-ml-2 rounded-xl px-5 py-3">
                <Text className="text-sm text-white">{isCodeSent ? '재전송' : '이메일 인증'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {emailError !== '' && (
            <Text className="mt-1 font-notoSansKRRegular text-xs text-red">{emailError}</Text>
          )}
        </View>

        {/* 인증 코드: 전송 버튼을 누르기 전에는 노출되지 않음 */}
        {isCodeSent && (
          <View className="mt-5">
            <Text className="mb-2 font-notoSansKRRegular text-sm text-body">인증 코드</Text>
            <View className="flex-row items-center justify-between rounded-xl border border-border bg-white px-3">
              <TextInput
                className="flex-1 text-sm text-black"
                value={authCode}
                onChangeText={(text) => {
                  setAuthCode(text);
                  setAuthCodeError('');
                }}
                keyboardType="number-pad"
                placeholder="인증코드를 입력해 주세요"
                editable={!isExpired}
              />
              <Text className="font-notoSansKRRegular text-sm text-red">
                {isExpired ? '시간 만료' : formatTime(remainingSeconds)}
              </Text>
            </View>
            {isExpired && (
              <Text className="mt-1 font-notoSansKRRegular text-xs text-red">
                인증 시간이 만료되었어요. 재전송 버튼을 눌러주세요.
              </Text>
            )}
            {authCodeError !== '' && (
              <Text className="mt-1 font-notoSansKRRegular text-xs text-red">{authCodeError}</Text>
            )}
          </View>
        )}

        {/* 확인 버튼 */}
        <TouchableOpacity className="mx-5 mt-40" onPress={handleEditProfile}>
          <LinearGradient
            colors={['#7B61FF', '#FF4FD8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="mx-7 items-center justify-center rounded-full py-5">
            <Text className="text-center font-notoSansKRBold text-base text-white">확인</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserAuthScreen;
