import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GradientButton, TopBar } from '@/components/ui';
import CheckedIcon from '@/components/ui/icons/checked.svg';
import InfoIcon from '@/assets/icons/infoicon.svg';
import type { RootStackParamList } from '@/navigation/types';

type ResetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const PLACEHOLDER_COLOR = '#9CA3AF';
const STRENGTH_SEGMENTS = 4;

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

// 매우 약함: 8자 미만 또는 단일 문자 종류 / 약함: 8자 이상 + 2종류 / 보통: 10자 이상 + 3종류 / 강함: 12자 이상 + 4종류
const getStrengthLevel = (length: number, typeCount: number) => {
  if (length >= 12 && typeCount >= 4) return STRENGTH_LEVELS[3];
  if (length >= 10 && typeCount >= 3) return STRENGTH_LEVELS[2];
  if (length >= 8 && typeCount >= 2) return STRENGTH_LEVELS[1];
  return STRENGTH_LEVELS[0];
};

const InlineError = ({ message }: { message: string }) => (
  <View className="ml-6 mt-2 flex-row items-center gap-1">
    <InfoIcon width={12} height={12} />
    <Text className="font-notoSansKRRegular text-sm text-gray">{message}</Text>
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

const ResetPasswordScreen = ({ navigation }: ResetPasswordScreenProps) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

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

  const handlePasswordChange = (value: string) => {
    setPassword(value.replace(/\s/g, '').slice(0, 16));
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value.replace(/\s/g, '').slice(0, 16));
  };

  const handleSubmit = (): void => {
    if (!isPasswordValid || password !== passwordConfirm) {
      return;
    }

    navigation.replace('ResetPasswordSuccess');
  };

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
            <View className="mt-3 flex-row items-center gap-3">
              <View className="flex-1 flex-row gap-1">
                {Array.from({ length: STRENGTH_SEGMENTS }).map((_, index) => (
                  <View
                    key={index}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        index < strengthLevel.filled ? strengthLevel.barColor : '#E5E7EB',
                    }}
                  />
                ))}
              </View>
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
            label="다음"
            onPress={handleSubmit}
            disabled={!isPasswordValid || password !== passwordConfirm}
            height={54}
            borderRadius={27}
            fontSize={16}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
