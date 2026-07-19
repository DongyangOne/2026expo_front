import React, { useEffect, useRef, useState } from 'react';
import { cssInterop } from 'nativewind';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useCallback } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

cssInterop(LinearGradient, {
  className: 'style',
});
import BackArrow from '../assets/images/vector.svg';

const AUTH_CODE_DURATION = 300; // 5분 (초 단위)

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const MOCK_CORRECT_AUTH_CODE = '123456';

const MOCK_REGISTERED_USERS = [{ id: 'testuser', email: 'test@example.com' }];

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// 에러가 어느 입력칸 소속인지 구분
type ErrorField = 'userId' | 'email' | 'authCode' | null;

const UserAuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(AUTH_CODE_DURATION);
  const [isExpired, setIsExpired] = useState(false);

  const [verifiedUserId, setVerifiedUserId] = useState('');

  // 화면 전체에서 에러는 항상 하나만 존재. 어느 필드 소속인지만 같이 저장
  const [errorField, setErrorField] = useState<ErrorField>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (field: ErrorField, message: string) => {
    setErrorField(field);
    setErrorMessage(message);
  };

  const clearError = () => {
    setErrorField(null);
    setErrorMessage('');
  };

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

      setUserId('');
      setEmail('');
      setAuthCode('');
      setIsCodeSent(false);
      setRemainingSeconds(AUTH_CODE_DURATION);
      setIsExpired(false);
      setVerifiedUserId('');
      clearError();

      return () => clearTimer();
    }, []),
  );

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleSendCode = () => {
    if (userId.trim().length === 0) {
      showError('userId', '아이디를 입력해주세요.');
      return;
    }

    if (email.trim().length === 0) {
      showError('email', '이메일을 입력해주세요.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      showError('email', '이메일 형식이 올바르지 않아요.');
      return;
    }

    // 입력한 이메일로 등록된 사용자를 먼저 찾음
    const matchedUser = MOCK_REGISTERED_USERS.find((user) => user.email === email.trim());

    if (!matchedUser) {
      // 이메일 자체가 등록되어 있지 않은 경우
      showError('email', '존재하지 않는 이메일입니다.');
      return;
    }

    if (matchedUser.id !== userId.trim()) {
      // 이메일은 맞는데, 그 이메일에 등록된 아이디와 다른 경우
      showError('userId', '존재하지 않는 사용자입니다.');
      return;
    }

    clearError();
    setVerifiedUserId(userId.trim());
    setAuthCode('');
    setIsCodeSent(true);
    startTimer();
  };

  const handleEditProfile = () => {
    if (userId.trim().length === 0) {
      showError('userId', '아이디를 입력해주세요.');
      return;
    }

    if (email.trim().length === 0) {
      showError('email', '이메일을 입력해주세요.');
      return;
    }

    if (!isCodeSent) {
      showError('email', '이메일 인증을 진행해주세요.');
      return;
    }

    if (userId.trim() !== verifiedUserId) {
      showError('userId', '아이디가 변경되었습니다. 인증을 다시 진행해주세요.');
      return;
    }

    if (isExpired) {
      showError('authCode', '인증 시간이 만료되었어요. 재전송 버튼을 눌러주세요.');
      return;
    }

    if (authCode.trim().length === 0) {
      showError('authCode', '인증코드를 입력해주세요.');
      return;
    }

    if (authCode.trim() !== MOCK_CORRECT_AUTH_CODE) {
      showError('authCode', '인증코드가 일치하지 않습니다.');
      return;
    }

    clearError();
    navigation.navigate('EditProfile', { email });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="mx-11 flex-1">
        <View className="relative mt-[37px] flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('MobileTabs', { screen: 'Account' })}
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
            <TextInput
              className="text-sm text-black"
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                if (errorField === 'userId') clearError();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="아이디를 입력해 주세요"
            />
          </View>
          {errorField === 'userId' && (
            <Text className="mt-1 font-notoSansKRRegular text-xs text-red">{errorMessage}</Text>
          )}
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
                  if (errorField === 'email') clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="이메일을 입력해 주세요"
              />
            </View>
            <TouchableOpacity onPress={handleSendCode}>
              <LinearGradient
                colors={['#7B61FF', '#FF4FD8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="-ml-2 rounded-xl px-5 py-3">
                <Text className="text-sm text-white">이메일 인증</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {errorField === 'email' && (
            <Text className="mt-1 font-notoSansKRRegular text-xs text-red">{errorMessage}</Text>
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
                  if (errorField === 'authCode') clearError();
                }}
                keyboardType="number-pad"
                placeholder="인증코드를 입력해 주세요"
                editable={!isExpired}
              />
              <Text className="font-notoSansKRRegular text-sm text-red">
                {isExpired ? '00:00' : formatTime(remainingSeconds)}
              </Text>
            </View>
            {errorField === 'authCode' && (
              <Text className="mt-1 font-notoSansKRRegular text-xs text-red">{errorMessage}</Text>
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
