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

import BackArrow from '../assets/images/vector.svg';

import tailwindConfig from '../../tailwind.config.js';

const WITHDRAW_REASONS = [
  '기록을 삭제하고 싶어서',
  '서비스 장애가 너무 많아서',
  '사용 빈도가 낮아서',
  '기타',
] as const;

// TODO: 실제로는 서버에서 현재 로그인된 사용자의 비밀번호를 검증해야 합니다.
// 백엔드 연동 전까지 임시로 고정된 값을 사용합니다.
const TEMP_CURRENT_PASSWORD = 'Test1423!';

// TODO: 실제로는 서버에서 "최근 사용한 비밀번호 3개" 이력을 받아와야 합니다.
// 백엔드 연동 전까지 임시로 고정된 값을 사용합니다.
const TEMP_RECENT_PASSWORDS = ['OldPass12!', 'OldPass34!', 'OldPass56!'];

// ---- 비밀번호 형식 규칙 ----
const SPECIAL_CHARS = `!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>/?~\``;
// 영문 + 숫자 + 특수문자만 허용 (한글/공백 등은 이 셋에 없으므로 자동 차단됨), 8~16자
const ALLOWED_LENGTH_REGEX = new RegExp(`^[A-Za-z0-9${SPECIAL_CHARS}]{8,16}$`);
const HAS_LETTER_REGEX = /[A-Za-z]/;
const HAS_DIGIT_REGEX = /\d/;
const HAS_SPECIAL_REGEX = new RegExp(`[${SPECIAL_CHARS}]`);

// 키보드 상단 행 기준 연속 문자열 (필요 시 다른 행 추가 가능)
const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

// 문자 코드가 1씩 증가/감소하는 연속 문자인지 확인 (예: abcd, 4321)
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

// 키보드 배열 기준 연속 문자인지 확인 (예: qwer, rewq)
const isKeyboardSequential = (slice: string) => {
  return KEYBOARD_ROWS.some((row) => {
    return row.includes(slice) || row.split('').reverse().join('').includes(slice);
  });
};

// 비밀번호 내에 4자리 이상 연속된 문자/숫자가 있는지 검사
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

// 비밀번호 "형식" 검증 결과와 안내 메시지를 함께 반환
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
  const { colors } = tailwindConfig.theme!.extend! as {
    colors: { linear: { start: string; end: string } };
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selected, setSelected] = useState<string | null>(null);
  const [etcText, setEtcText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 버튼 클릭(다음 페이지 이동) 시에만 사용할 에러 메시지
  // (실제 비밀번호 불일치 / 최근 사용 비밀번호 재사용 등 "제출 시점"에만 확인 가능한 오류)
  const [submitError, setSubmitError] = useState('');

  // 비밀번호 "형식" 검증 (실제 계정 비밀번호와의 일치 여부와는 무관)
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

  // 비밀번호 확인 밑에 보여줄 메시지를 하나로 통합
  // 우선순위: 제출 시점 에러(비밀번호 불일치, 최근 비밀번호 재사용 등) > 단순 확인 일치 여부
  const confirmDisplay = useMemo(() => {
    if (submitError.length > 0) {
      return { message: submitError, isValid: false };
    }
    return confirmResult;
  }, [submitError, confirmResult]);

  // 버튼 활성화 조건: 형식 조건 + 비밀번호 확인 일치 여부만 체크
  // (실제 계정 비밀번호와 같은지는 여기서 체크하지 않음)
  const isNextEnabled = useMemo(() => {
    if (selected === null) {
      return false;
    }
    if (selected === '기타' && etcText.trim().length === 0) {
      return false;
    }
    return passwordFormatResult.isValid && confirmResult.isValid;
  }, [selected, etcText, passwordFormatResult.isValid, confirmResult.isValid]);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (submitError) setSubmitError('');
  };

  const handleNext = () => {
    if (!isNextEnabled) return;

    // 1) 실제 계정 비밀번호와 다르면 페이지 이동 없이 에러만 표시
    if (password !== TEMP_CURRENT_PASSWORD) {
      setSubmitError('비밀번호가 올바르지 않아요. 다시 확인해 주세요.');
      return;
    }

    // 2) 최근 사용한 비밀번호 3개와 동일하면 페이지 이동 없이 에러만 표시
    // TODO: 실제로는 서버 응답으로 재사용 여부를 판단해야 합니다.
    if (TEMP_RECENT_PASSWORDS.includes(password)) {
      setSubmitError('최근에 사용한 비밀번호는 다시 사용할 수 없어요.');
      return;
    }

    setSubmitError('');
    navigation.navigate('DeleteComplete');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background px-5 pb-6 pt-6">
      <ScrollView>
        <View className="relative flex-row items-center ">
          {/* 뒤로가기 버튼 */}
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

        {/* 라디오 목록 */}
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
          {/* 비밀번호 */}
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

          {/* 비밀번호 확인 */}
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

        {/* 기타 선택 시에만 입력창 노출 */}
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
