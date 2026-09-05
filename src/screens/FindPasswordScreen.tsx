import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GradientButton, TopBar } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import { checkFindPasswordVerificationCode, sendFindPasswordVerificationCode } from '@/services';

type FindPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'FindPassword'>;

const TIMER_SECONDS = 5 * 60;
const PLACEHOLDER_COLOR = '#9CA3AF';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOAST_DURATION = 2000;
const EMAIL_SEND_ERROR_MESSAGE = '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
const VERIFY_CODE_ERROR_MESSAGE = '인증번호 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
const AUTH_CODE_MISMATCH_MESSAGE = '인증 코드가 일치하지 않습니다.';
const AUTH_CODE_EXPIRED_MESSAGE = '인증 코드가 만료되었습니다.';

const InlineError = ({ message }: { message: string }) => (
  <View className="ml-6 mt-2">
    <Text className="font-notoSansKRRegular text-sm text-danger">{message}</Text>
  </View>
);

const FindPasswordScreen = ({ navigation }: FindPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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

  const startTimer = (seconds: number = TIMER_SECONDS): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(seconds);
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

  const handleEmailVerify = async (): Promise<void> => {
    if (!userId.trim()) {
      showToast('아이디를 입력해 주세요');
      return;
    }
    if (!email.trim()) {
      showToast('이메일을 입력해 주세요');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('이메일 형식이 잘못되었습니다.');
      return;
    }
    if (isSendingEmail) return;

    setEmailError(null);
    setIdError(null);
    setCodeError(null);
    setVerificationCode('');
    setIsCodeSent(true);
    startTimer();
    setIsSendingEmail(true);

    try {
      const response = await sendFindPasswordVerificationCode({
        email,
        loginId: userId.trim(),
      });
      const remaining = Math.max(
        0,
        Math.round((new Date(response.data.expiredAt).getTime() - Date.now()) / 1000),
      );

      startTimer(remaining || TIMER_SECONDS);
    } catch (error) {
      const message = error instanceof Error ? error.message : EMAIL_SEND_ERROR_MESSAGE;
      setIsCodeSent(false);
      if (timerRef.current) clearInterval(timerRef.current);
      showToast(message || EMAIL_SEND_ERROR_MESSAGE);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerify = async (): Promise<void> => {
    if (!userId.trim()) {
      showToast('아이디를 입력해 주세요');
      return;
    }
    if (!email.trim()) {
      showToast('이메일을 입력해 주세요');
      return;
    }
    if (isCodeSent && timeLeft === 0) {
      showToast('시간초과, 다시 입력해 주세요');
      return;
    }
    if (!verificationCode.trim()) {
      showToast('인증번호를 입력해 주세요');
      return;
    }
    if (isVerifying) return;

    setIsVerifying(true);

    try {
      const response = await checkFindPasswordVerificationCode({
        email,
        authCode: verificationCode.trim(),
        loginId: userId.trim(),
      });

      setCodeError(null);
      setIdError(null);
      navigation.replace('FindPasswordSuccess', {
        passwordResetToken: response.data.passwordResetToken,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : null;

      if (message === AUTH_CODE_MISMATCH_MESSAGE) {
        setCodeError(message);
        return;
      }
      if (message === AUTH_CODE_EXPIRED_MESSAGE) {
        setTimeLeft(0);
        setCodeError(message);
        return;
      }

      showToast(message ?? VERIFY_CODE_ERROR_MESSAGE);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const timerColorClass = 'text-red';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title="비밀번호 찾기" onBack={() => navigation.goBack()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-10 pt-14 pb-10"
        keyboardShouldPersistTaps="handled">
        <Text className="mb-12 text-center font-notoSansKRDemiLight text-[15px] leading-7 text-body">
          {'가입 시 등록한 정보로\n비밀번호를 찾을 수 있습니다.'}
        </Text>

        {/* 아이디 */}
        <View className="mb-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">
            아이디 <Text className="text-pink">*</Text>
          </Text>
          <View className="h-14 flex-row items-center overflow-hidden rounded-xl border border-border bg-white pl-3">
            <TextInput
              className="h-14 flex-1 py-0 font-notoSansKRRegular text-sm text-black"
              placeholder="아이디를 입력해 주세요."
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                setIdError(null);
              }}
              autoCapitalize="none"
              textAlignVertical="center"
            />
          </View>
          {idError && <InlineError message={idError} />}
        </View>

        {/* 이메일 */}
        <View className="mb-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">
            이메일 <Text className="text-pink">*</Text>
          </Text>
          <View className="h-14 flex-row items-center overflow-hidden rounded-xl border border-border bg-white pl-3">
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
            {!isCodeSent && (
              <GradientButton
                label={isSendingEmail ? '발송 중...' : '이메일 인증'}
                onPress={handleEmailVerify}
                disabled={isSendingEmail}
                borderRadius={10}
                fontSize={14}
                fontWeight="regular"
              />
            )}
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
            label={isVerifying ? '확인 중...' : '본인인증 하기'}
            onPress={handleVerify}
            disabled={isVerifying}
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

export default FindPasswordScreen;
