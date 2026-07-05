import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GradientButton, TopBar } from '@/components/ui';
import InfoIcon from '@/assets/icons/infoicon.svg';
import type { RootStackParamList } from '@/navigation/types';

type FindIdScreenProps = NativeStackScreenProps<RootStackParamList, 'FindId'>;

const TIMER_SECONDS = 5 * 60;
const PLACEHOLDER_COLOR = '#9CA3AF';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CORRECT_CODE = '123456'; // TODO: 임시 코드, 실제 인증 API 연동 시 제거
const TOAST_DURATION = 2000;

const InlineError = ({ message }: { message: string }) => (
  <View className="ml-6 mt-2 flex-row items-center gap-1">
    <InfoIcon width={12} height={12} />
    <Text className="font-notoSansKRRegular text-sm text-gray">{message}</Text>
  </View>
);

const FindIdScreen = ({ navigation }: FindIdScreenProps) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string): void => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), TOAST_DURATION);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startTimer = (): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailVerify = (): void => {
    if (!email.trim()) {
      showToast('이메일을 입력해 주세요');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('이메일 형식이 잘못되었습니다.');
      return;
    }
    setEmailError(null);
    setCodeError(null);
    setVerificationCode('');
    setIsCodeSent(true);
    startTimer();
  };

  const handleVerify = (): void => {
    if (isCodeSent && timeLeft === 0) {
      showToast('시간초과, 다시 입력해 주세요');
      return;
    }
    if (!verificationCode.trim()) {
      showToast('인증번호를 입력해 주세요');
      return;
    }
    if (verificationCode.trim() !== CORRECT_CODE) {
      setCodeError('인증 번호가 잘못되었습니다.');
      return;
    }
    setCodeError(null);
    navigation.replace('FindIdSuccess');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const timerColorClass = timeLeft === 0 ? 'text-gray' : 'text-red-500';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title="아이디 찾기" onBack={() => navigation.goBack()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-10 pt-14 pb-10"
        keyboardShouldPersistTaps="handled">
        <Text className="mb-12 text-center font-notoSansKRDemiLight text-[15px] leading-7 text-body">
          {'가입 시 등록한 정보로\n아이디를 찾을 수 있습니다.'}
        </Text>

        {/* 이메일 */}
        <View className="mb-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">
            이메일 <Text className="text-pink">*</Text>
          </Text>
          <View className="h-14 flex-row items-center overflow-hidden rounded-xl border border-border bg-white pl-4">
            <TextInput
              className="h-14 flex-1 py-0 font-notoSansKRRegular text-sm text-black"
              placeholder="이메일을 입력해주세요."
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlignVertical="center"
            />
            <GradientButton
              label={isCodeSent ? '재전송' : '이메일 인증'}
              onPress={handleEmailVerify}
              borderRadius={10}
              fontSize={14}
            />
          </View>
          {emailError && <InlineError message={emailError} />}
        </View>

        {/* 인증번호 */}
        {isCodeSent && (
          <View className="mb-4">
            <Text className="mb-2 font-notoSansKRRegular text-sm text-black">
              인증번호 <Text className="text-pink">*</Text>
            </Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="h-14 flex-1 rounded-[10px] border border-border bg-white py-0 pl-4 pr-20 font-notoSansKRRegular text-sm text-black"
                placeholder="인증번호를 입력해 주세요."
                placeholderTextColor={PLACEHOLDER_COLOR}
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text);
                  setCodeError(null);
                }}
                keyboardType="number-pad"
                textAlignVertical="center"
              />
              <Text
                className={`absolute right-4 font-notoSansKRRegular text-sm ${timerColorClass}`}>
                {formatTime(timeLeft)}
              </Text>
            </View>
            {codeError && <InlineError message={codeError} />}
          </View>
        )}

        {/* 하단 버튼 */}
        <View className="flex-1 justify-end px-8 pb-32">
          <GradientButton
            label="본인인증 하기"
            onPress={handleVerify}
            height={54}
            borderRadius={27}
            fontSize={16}
          />
        </View>
      </ScrollView>
      {toastMessage && (
        <View className="absolute inset-x-0 bottom-16 items-center">
          <View className="rounded-md bg-disabledBg px-5 py-3">
            <Text className="font-notoSansKRDemiLight text-xs text-black">{toastMessage}</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default FindIdScreen;
