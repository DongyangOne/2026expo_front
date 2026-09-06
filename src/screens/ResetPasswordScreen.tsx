import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Defs, LinearGradient as SvgLinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GradientButton, TopBar } from '@/components/ui';
import CheckedIcon from '@/components/ui/icons/checked.svg';
import type { RootStackParamList } from '@/navigation/types';
import { resetFindPassword } from '@/services';
import { getServerMessage, isNetworkError, NETWORK_ERROR_MESSAGE } from '@/utils';

type ResetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const PLACEHOLDER_COLOR = '#9CA3AF';
const STRENGTH_SEGMENTS = 4;
const STRENGTH_BAR_HEIGHT = 4;
const STRENGTH_BAR_GAP = 4;
const STRENGTH_GRADIENT_START = '#7B61FF';
const STRENGTH_GRADIENT_END = '#FF4FD8';
const TOAST_DURATION = 2000;
const RESET_ERROR_MESSAGE = '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.';

// 응답 인터셉터가 에러 본문의 code를 버리고 message만 남기기 때문에
// 화면에서는 문구의 핵심 키워드로 판별한다.
// (code를 그대로 전달하도록 인터셉터를 고치면 이 우회는 제거할 수 있다.)
const INVALID_TOKEN_KEYWORD = '토큰';

const STRENGTH_LEVELS = [
  { label: '매우 약함', textClass: 'text-[#FF3B30]', barColor: '#FF3B30', filled: 1 },
  { label: '약함', textClass: 'text-[#FF6363]', barColor: '#FF6363', filled: 2 },
  { label: '보통', textClass: 'text-[#FFA53B]', barColor: '#FFA53B', filled: 3 },
  { label: '강함', textClass: 'text-pink', barColor: '#FF4FD8', filled: 4 },
];

const getPasswordChecks = (value: string) => {
  const lengthOk = value.length >= 8 && value.length <= 16;
  const hasLetter = /[A-Za-z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  return { lengthOk, hasLetter, hasDigit, hasSpecial };
};

const getTypeCount = (value: string): number => {
  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  return [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
};

// 강함: 8자 이상 + 3종류 조합 / 보통: 6자 이상 + 2종류 조합 / 약함: 5자 이상 + 1종류 조합 / 그 외 매우 약함
const getStrengthLevel = (length: number, typeCount: number) => {
  if (length >= 8 && typeCount >= 3) return STRENGTH_LEVELS[3];
  if (length >= 6 && typeCount >= 2) return STRENGTH_LEVELS[2];
  if (length >= 5 && typeCount >= 1) return STRENGTH_LEVELS[1];
  return STRENGTH_LEVELS[0];
};

const InlineError = ({ message }: { message: string }) => (
  <View className="ml-2 mt-2">
    <Text className="font-notoSansKRRegular text-sm text-danger">{message}</Text>
  </View>
);

const ChecklistItem = ({ label, satisfied }: { label: string; satisfied: boolean }) => (
  <View className="flex-row items-center gap-2">
    <View
      className={`h-4 w-4 items-center justify-center rounded-full ${
        satisfied ? 'bg-success' : 'border border-border bg-white'
      }`}>
      {satisfied && <CheckedIcon width={9} height={8} />}
    </View>
    <Text className="font-notoSansKRRegular text-sm text-body">{label}</Text>
  </View>
);

const ResetPasswordScreen = ({ navigation, route }: ResetPasswordScreenProps) => {
  const { passwordResetToken } = route.params;

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [strengthBarWidth, setStrengthBarWidth] = useState(0);

  const { lengthOk, hasLetter, hasDigit, hasSpecial } = useMemo(
    () => getPasswordChecks(password),
    [password],
  );
  const comboOk = hasLetter && hasDigit && hasSpecial;
  const typeCount = useMemo(() => getTypeCount(password), [password]);
  const strengthLevel = getStrengthLevel(password.length, typeCount);
  const isPasswordValid = lengthOk && comboOk;

  const passwordConfirmError =
    passwordConfirm && password !== passwordConfirm ? '비밀번호가 다릅니다.' : '';

  const showToast = (message: string): void => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), TOAST_DURATION);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value.replace(/\s/g, '').slice(0, 16));
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value.replace(/\s/g, '').slice(0, 16));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!password.trim()) {
      showToast('새 비밀번호를 입력해 주세요.');
      return;
    }
    if (!isPasswordValid) {
      showToast('비밀번호 조건을 확인해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      showToast('비밀번호가 다릅니다.');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await resetFindPassword({ passwordResetToken, newPassword: password });
      navigation.replace('ResetPasswordSuccess');
    } catch (error: unknown) {
      if (isNetworkError(error)) {
        showToast(NETWORK_ERROR_MESSAGE);
        return;
      }

      const message = getServerMessage(error);

      // 이 화면에서 토스트를 띄우면 곧바로 언마운트되어 보이지 않으므로
      // 사유를 파라미터로 넘겨 되돌아간 화면에서 안내한다.
      if (message?.includes(INVALID_TOKEN_KEYWORD)) {
        navigation.replace('FindPassword', { message });
        return;
      }

      showToast(message ?? RESET_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title="비밀번호 재설정" onBack={() => navigation.goBack()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-10 pt-14 pb-10"
        keyboardShouldPersistTaps="handled">
        <Text className="mb-12 text-center font-notoSansKRDemiLight text-[15px] leading-7 text-body">
          {'새로 사용하실 비밀번호를\n입력해 주세요.'}
        </Text>

        {/* 비밀번호 입력 */}
        <View className="mb-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">
            비밀번호 입력 <Text className="text-pink">*</Text>
          </Text>
          <View className="h-14 flex-row items-center overflow-hidden rounded-xl border border-border bg-white pl-4">
            <TextInput
              className="h-14 flex-1 py-0 font-notoSansKRRegular text-sm text-black"
              placeholder="비밀번호를 입력해 주세요."
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
              textAlignVertical="center"
            />
          </View>
          {password.length > 0 && (
            <View
              className="mt-3"
              style={{ height: STRENGTH_BAR_HEIGHT }}
              onLayout={(e) => setStrengthBarWidth(e.nativeEvent.layout.width)}>
              {strengthBarWidth > 0 &&
                (() => {
                  const segmentWidth =
                    (strengthBarWidth - STRENGTH_BAR_GAP * (STRENGTH_SEGMENTS - 1)) /
                    STRENGTH_SEGMENTS;

                  return (
                    <Svg
                      width={strengthBarWidth}
                      height={STRENGTH_BAR_HEIGHT}
                      style={StyleSheet.absoluteFill}>
                      <Defs>
                        <SvgLinearGradient id="strengthGrad" x1="0" y1="0" x2="1" y2="0">
                          <Stop offset="0" stopColor={STRENGTH_GRADIENT_START} />
                          <Stop offset="1" stopColor={STRENGTH_GRADIENT_END} />
                        </SvgLinearGradient>
                      </Defs>
                      {Array.from({ length: STRENGTH_SEGMENTS }).map((_, index) => (
                        <Rect
                          key={index}
                          x={index * (segmentWidth + STRENGTH_BAR_GAP)}
                          y={0}
                          width={segmentWidth}
                          height={STRENGTH_BAR_HEIGHT}
                          rx={STRENGTH_BAR_HEIGHT / 2}
                          fill={index < strengthLevel.filled ? 'url(#strengthGrad)' : '#E5E7EB'}
                        />
                      ))}
                    </Svg>
                  );
                })()}
            </View>
          )}
          {password.length > 0 && (
            <Text className={`mt-2 font-notoSansKRRegular text-sm ${strengthLevel.textClass}`}>
              {strengthLevel.label}
            </Text>
          )}
        </View>

        {/* 비밀번호 확인 */}
        <View className="mb-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">
            비밀번호 확인 <Text className="text-pink">*</Text>
          </Text>
          <View className="h-14 flex-row items-center overflow-hidden rounded-xl border border-border bg-white pl-4">
            <TextInput
              className="h-14 flex-1 py-0 font-notoSansKRRegular text-sm text-black"
              placeholder="비밀번호를 다시 입력해 주세요."
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={passwordConfirm}
              onChangeText={handlePasswordConfirmChange}
              secureTextEntry
              autoCapitalize="none"
              textAlignVertical="center"
            />
          </View>
          {passwordConfirmError && <InlineError message={passwordConfirmError} />}
        </View>

        {/* 비밀번호 조건 안내 */}
        <View className="gap-3 rounded-2xl bg-purple/10 px-6 py-5">
          <ChecklistItem label="8자 이상 16자 이하" satisfied={lengthOk} />
          <ChecklistItem label="영문, 숫자 특수문자 조합" satisfied={comboOk} />
        </View>

        {/* 하단 버튼 */}
        <View className="flex-1 justify-end px-8 pb-32 pt-10">
          <GradientButton
            label={isSubmitting ? '변경 중...' : '다음'}
            onPress={handleSubmit}
            disabled={isSubmitting}
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

export default ResetPasswordScreen;
