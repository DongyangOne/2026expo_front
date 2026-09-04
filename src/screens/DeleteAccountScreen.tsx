import React, { useMemo, useState } from 'react';
import { cssInterop } from 'nativewind';
import LinearGradient from 'react-native-linear-gradient';
import type { RootStackParamList } from '../navigation/types';

cssInterop(LinearGradient, {
  className: 'style',
});
import { Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { withdrawUser } from '@/services/auth'; // 실제 경로에 맞게 수정
import { useAuthStore } from '@/store';

import BackArrow from '../assets/images/vector.svg';

import { COLORS } from '@/constants/theme';

const WITHDRAW_REASONS = [
  '기록을 삭제하고 싶어서',
  '서비스 장애가 너무 많아서',
  '사용 빈도가 낮아서',
  '기타',
] as const;

// UI에 노출되는 한글 사유 -> 서버 enum 코드 매핑
// (서버가 정의한 실제 enum 값으로 맞춰주세요)
const REASON_CODE_MAP: Record<(typeof WITHDRAW_REASONS)[number], string> = {
  '기록을 삭제하고 싶어서': 'DELETE_RECORDS',
  '서비스 장애가 너무 많아서': 'SERVICE_ISSUE',
  '사용 빈도가 낮아서': 'LOW_FREQUENCY',
  기타: 'ETC',
};

// ---- 비밀번호 형식 규칙 (그대로 유지) ----
const SPECIAL_CHARS = `!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>/?~\``;
const ALLOWED_LENGTH_REGEX = new RegExp(`^[A-Za-z0-9${SPECIAL_CHARS}]{8,16}$`);
const HAS_LETTER_REGEX = /[A-Za-z]/;
const HAS_DIGIT_REGEX = /\d/;
const HAS_SPECIAL_REGEX = new RegExp(`[${SPECIAL_CHARS}]`);

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

const isCodeSequential = (slice: string) => {
  let ascending = true;
  let descending = true;
  for (let i = 0; i < slice.length - 1; i += 1) {
    const diff = slice.charCodeAt(i + 1) - slice.charCodeAt(i);
    if (diff !== 1) ascending = false;
    if (diff !== -1) descending = false;
  }
  return ascending || descending;
};

const isKeyboardSequential = (slice: string) => {
  return KEYBOARD_ROWS.some((row) => {
    return row.includes(slice) || row.split('').reverse().join('').includes(slice);
  });
};

const hasSequentialChars = (password: string, minLength = 4) => {
  const lower = password.toLowerCase();
  for (let i = 0; i <= lower.length - minLength; i += 1) {
    const slice = lower.slice(i, i + minLength);
    if (isCodeSequential(slice) || isKeyboardSequential(slice)) {
      return true;
    }
  }
  return false;
};

const validatePasswordFormat = (password: string): { isValid: boolean; message: string } => {
  if (password.length === 0) {
    return { isValid: false, message: '' };
  }
  if (!ALLOWED_LENGTH_REGEX.test(password)) {
    return {
      isValid: false,
      message: '8~16자의 영문, 숫자, 특수문자만 사용할 수 있어요. (한글, 공백 불가)',
    };
  }
  if (
    !HAS_LETTER_REGEX.test(password) ||
    !HAS_DIGIT_REGEX.test(password) ||
    !HAS_SPECIAL_REGEX.test(password)
  ) {
    return {
      isValid: false,
      message: '영문, 숫자, 특수문자를 모두 포함해 주세요.',
    };
  }
  if (hasSequentialChars(password)) {
    return {
      isValid: false,
      message: '연속된 문자나 숫자는 4자리 이상 사용할 수 없어요. (예: 1234, abcd, qwer)',
    };
  }
  return { isValid: true, message: '' };
};

const DeleteAccountScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selected, setSelected] = useState<(typeof WITHDRAW_REASONS)[number] | null>(null);
  const [etcText, setEtcText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordFormatResult = useMemo(() => validatePasswordFormat(password), [password]);

  const confirmResult = useMemo(() => {
    if (passwordConfirm.length === 0) {
      return { isValid: false, message: '' };
    }
    if (password !== passwordConfirm) {
      return { isValid: false, message: '비밀번호가 일치하지 않아요.' };
    }
    return { isValid: true, message: '비밀번호가 일치해요.' };
  }, [password, passwordConfirm]);

  const confirmDisplay = useMemo(() => {
    if (submitError.length > 0) {
      return { message: submitError, isValid: false };
    }
    return confirmResult;
  }, [submitError, confirmResult]);

  const isNextEnabled = useMemo(() => {
    if (selected === null) {
      return false;
    }
    if (selected === '기타' && etcText.trim().length === 0) {
      return false;
    }
    return passwordFormatResult.isValid && confirmResult.isValid && !isSubmitting;
  }, [selected, etcText, passwordFormatResult.isValid, confirmResult.isValid, isSubmitting]);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (submitError) setSubmitError('');
  };

  const handleNext = async () => {
    if (!isNextEnabled || selected === null) return;

    setIsSubmitting(true);

    const payload = {
      password,
      withdrawReason: REASON_CODE_MAP[selected],
      withdrawReasonDetail: selected === '기타' ? etcText.trim() : '',
    };

    console.log('[탈퇴 요청 payload]', JSON.stringify(payload)); // 👈 이 줄 추가

    try {
      const { success } = await withdrawUser({
        password,
        withdrawReason: REASON_CODE_MAP[selected],
        withdrawReasonDetail: selected === '기타' ? etcText.trim() : '',
      });

      if (success) {
        // 기존 로그아웃 로직 재사용 (토큰/스토리지 정리 포함)
        await useAuthStore.getState().logout();

        navigation.navigate('DeleteComplete');
      }
    } catch {
      // instance.ts 인터셉터에서 error.response.data.message만 실어서 Error로 던지고 있어서
      // code(INVALID_INPUT 등)로는 분기 불가. message로 처리.
      setSubmitError('비밀번호가 틀립니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background px-5 pb-6 pt-6">
      <ScrollView>
        <View className="relative flex-row items-center ">
          <TouchableOpacity onPress={() => navigation.goBack()} className="ml-[23px] mt-[32px]">
            <BackArrow />
          </TouchableOpacity>
        </View>
        <Text className="mt-20 text-center font-notoSansKRBold text-xl text-black">
          떠나신다고 하니 슬퍼요.{'\n'} 더 나은 서비스를 위해{'\n'} 떠나시는 이유를 알려주세요
        </Text>
        <Text className="mb-12 mt-6 text-center font-notoSansKRDemiLight text-base text-gray">
          떠나시면 계정은 다시 복구할 수 없어요
        </Text>

        {WITHDRAW_REASONS.map((reason) => {
          const isSelected = selected === reason;

          return (
            <TouchableOpacity
              key={reason}
              className="mb-4 ml-10 flex-row items-center"
              onPress={() => setSelected(reason)}>
              <View
                className={`h-5 w-5 items-center justify-center rounded-full border ${
                  isSelected ? 'border-purple' : 'border-black'
                }`}>
                {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-purple" />}
              </View>

              <Text className="ml-3 font-notoSansKRRegular text-sm text-black">{reason}</Text>
            </TouchableOpacity>
          );
        })}

        <>
          <View className="mx-11 mt-14">
            <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호</Text>
            <View className="rounded-xl border border-border bg-white px-3">
              <TextInput
                className="text-sm text-black"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={16}
                placeholder="8~16자 영문, 숫자, 특수문자를 입력해 주세요"
              />
            </View>
            {passwordFormatResult.message.length > 0 && (
              <Text className="mt-1 font-notoSansKRRegular text-xs text-red">
                {passwordFormatResult.message}
              </Text>
            )}
          </View>

          <View className="mx-11 mt-4">
            <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호 확인</Text>
            <View className="rounded-xl border border-border bg-white px-3">
              <TextInput
                className="text-sm text-black"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={16}
                placeholder="비밀번호를 다시 입력해 주세요"
              />
            </View>
            {confirmDisplay.message.length > 0 && (
              <Text
                className={`mt-1 font-notoSansKRRegular text-xs ${
                  confirmDisplay.isValid ? 'text-green' : 'text-red'
                }`}>
                {confirmDisplay.message}
              </Text>
            )}
          </View>
        </>

        {selected === '기타' && (
          <View className="mx-11 mt-[42px] min-h-[200px] rounded-xl border border-border bg-white px-5">
            <TextInput
              className="flex-1 font-notoSansKRRegular text-sm text-black"
              placeholder="떠나시는 이유를 작성해 주세요."
              multiline
              maxLength={500}
              value={etcText}
              onChangeText={setEtcText}
              textAlignVertical="top"
            />
            <Text className="font-notoSansKRDemiLight text-xs text-black">
              ({etcText.length}/500)
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="mx-14 mt-20"
          onPress={handleNext}
          disabled={!isNextEnabled}
          activeOpacity={isNextEnabled ? 0.7 : 1}>
          <LinearGradient
            colors={
              isNextEnabled
                ? [COLORS.linear.start, `${COLORS.linear.end}80`]
                : ['#D9D9D9', '#D9D9D9']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="items-center justify-center rounded-full py-5">
            <Text className="text-center font-notoSansKRBold text-base text-white">다음</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;
