import React, { useMemo, useState } from 'react';
import { cssInterop } from 'nativewind';
import LinearGradient from 'react-native-linear-gradient';

cssInterop(LinearGradient, {
  className: 'style',
});
import { Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '../assets/images/vector.svg';

import tailwindConfig from '../../tailwind.config.js';

const WITHDRAW_REASONS = [
  '기록을 삭제하고 싶어서',
  '서비스 장애가 너무 많아서',
  '사용 빈도가 낮아서',
  '기타',
] as const;

// TODO: 실제로는 서버에서 최근 사용한 비밀번호 3개(해시 등)를 받아와야 합니다.
// 여기서는 데모용으로 로컬 배열을 사용합니다.
const RECENT_PASSWORDS: string[] = [];

// 키보드 연속 배열 (정방향/역방향 모두 체크)
const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

/** 4자리 이상 연속된 숫자/문자(오름차순, 내림차순, 키보드 순서) 포함 여부 검사 */
const hasSequentialChars = (value: string, minLen = 4): boolean => {
  const lower = value.toLowerCase();

  // 1) 오름차순/내림차순 연속 (예: 1234, abcd, dcba, 4321)
  for (let i = 0; i <= lower.length - minLen; i++) {
    let asc = true;
    let desc = true;
    for (let j = 1; j < minLen; j++) {
      const prev = lower.charCodeAt(i + j - 1);
      const curr = lower.charCodeAt(i + j);
      if (curr - prev !== 1) asc = false;
      if (prev - curr !== 1) desc = false;
    }
    if (asc || desc) return true;
  }

  // 2) 키보드 배열 순서 (예: qwer, asdf, 1234 포함 - 정/역방향)
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= row.length - minLen; i++) {
      const seq = row.slice(i, i + minLen);
      const reversedSeq = seq.split('').reverse().join('');
      if (lower.includes(seq) || lower.includes(reversedSeq)) return true;
    }
  }

  return false;
};

type PasswordCheckResult = {
  isValid: boolean;
  message: string;
};

const validatePassword = (value: string): PasswordCheckResult => {
  if (value.length === 0) {
    return { isValid: false, message: '' };
  }

  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
    return { isValid: false, message: '한글은 입력할 수 없어요.' };
  }

  if (/\s/.test(value)) {
    return { isValid: false, message: '공백은 입력할 수 없어요.' };
  }

  if (value.length < 8 || value.length > 16) {
    return { isValid: false, message: '비밀번호는 8~16자로 입력해 주세요.' };
  }

  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(value);

  if (!hasLetter || !hasNumber || !hasSpecial) {
    return { isValid: false, message: '영문, 숫자, 특수문자를 모두 포함해 주세요.' };
  }

  if (hasSequentialChars(value, 4)) {
    return { isValid: false, message: '연속된 문자/숫자는 4자리 이상 사용할 수 없어요.' };
  }

  if (RECENT_PASSWORDS.includes(value)) {
    return { isValid: false, message: '최근에 사용한 비밀번호는 다시 사용할 수 없어요.' };
  }

  return { isValid: true, message: '사용 가능한 비밀번호예요.' };
};

const DeleteAccountScreen = () => {
  const { colors } = tailwindConfig.theme.extend;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selected, setSelected] = useState<string | null>(null);
  const [etcText, setEtcText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const passwordResult = useMemo(() => validatePassword(password), [password]);

  const confirmResult = useMemo(() => {
    if (passwordConfirm.length === 0) {
      return { isValid: false, message: '' };
    }
    if (password !== passwordConfirm) {
      return { isValid: false, message: '비밀번호가 일치하지 않아요.' };
    }
    return { isValid: true, message: '비밀번호가 일치해요.' };
  }, [password, passwordConfirm]);

  // '기타' 선택 시에는 비밀번호 조건 없이, 사유 텍스트 입력만 있으면 진행 가능
  const isNextEnabled = useMemo(() => {
    if (selected === '기타') {
      return etcText.trim().length > 0;
    }
    if (selected === null) {
      return false;
    }
    return passwordResult.isValid && confirmResult.isValid;
  }, [selected, etcText, passwordResult.isValid, confirmResult.isValid]);

  const handleNext = () => {
    if (!isNextEnabled) return;
    navigation.navigate('DeleteComplete');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary-backgorund px-5 pt-6">
      <ScrollView>
        <View className="relative flex-row items-center ">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrow width={20} height={20} />
          </TouchableOpacity>
        </View>
        <Text className="mt-20 text-center font-notoSansKRBold text-xl text-black">
          떠나신다고 하니 슬퍼요.{'\n'} 더 나은 서비스를 위해{'\n'} 떠나시는 이유를 알려주세요
        </Text>
        <Text className="mb-12 mt-6 text-center font-notoSansKRDemiLight text-base text-gray">
          떠나시면 계정은 다시 복구할 수 없어요
        </Text>

        {/* 라디오 목록 */}
        {WITHDRAW_REASONS.map((reason) => {
          const isSelected = selected === reason;

          return (
            <TouchableOpacity
              key={reason}
              className="mb-4 ml-10 flex-row items-center"
              onPress={() => setSelected(reason)}>
              {/* 바깥 원 */}
              <View
                className={`h-5 w-5 items-center justify-center rounded-full border ${
                  isSelected ? 'border-purple' : 'border-black'
                }`}>
                {/* 선택됐을 때만 점 */}
                {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-purple" />}
              </View>

              <Text className="ml-3 font-notoSansKRRegular text-sm text-black">{reason}</Text>
            </TouchableOpacity>
          );
        })}
        {selected !== '기타' && (
          <>
            {/* 비밀번호 */}
            <View className="mx-11 mt-14">
              <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호</Text>
              <View className="rounded-xl border border-border bg-white px-3">
                <TextInput
                  className="text-sm text-black"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  maxLength={16}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="8~16자, 영문/숫자/특수문자 포함"
                />
              </View>
              {passwordResult.message.length > 0 && (
                <Text
                  className={`mt-1 font-notoSansKRRegular text-xs ${
                    passwordResult.isValid ? 'text-purple' : 'text-red-500'
                  }`}>
                  {passwordResult.message}
                </Text>
              )}
            </View>

            {/* 비밀번호 확인 */}
            <View className="mx-11 mt-4">
              <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호 확인</Text>
              <View className="rounded-xl border border-border bg-white px-3">
                <TextInput
                  className="text-sm text-black"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry
                  maxLength={16}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="비밀번호를 다시 입력해 주세요"
                />
              </View>
              {confirmResult.message.length > 0 && (
                <Text
                  className={`mt-1 font-notoSansKRRegular text-xs ${
                    confirmResult.isValid ? 'text-purple' : 'text-red-500'
                  }`}>
                  {confirmResult.message}
                </Text>
              )}
            </View>
          </>
        )}
        {/* 기타 선택 시에만 입력창 노출 */}
        {selected === '기타' && (
          <View className="mx-11 mt-2 min-h-[200px] rounded-xl border border-border px-5 py-3">
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
        {/* 버튼 */}
        <TouchableOpacity
          className="mx-14 mt-20"
          onPress={handleNext}
          disabled={!isNextEnabled}
          activeOpacity={isNextEnabled ? 0.7 : 1}>
          <LinearGradient
            colors={
              isNextEnabled
                ? [colors.linear.start, `${colors.linear.end}80`]
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
