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

import type { MobileStackParamList } from '@/navigation/types';
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
const TEMP_CURRENT_PASSWORD = 'Test1234!';

const DeleteAccountScreen = () => {
  const { colors } = tailwindConfig.theme.extend;

  const navigation = useNavigation<NativeStackNavigationProp<MobileStackParamList>>();

  const [selected, setSelected] = useState<string | null>(null);
  const [etcText, setEtcText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 입력한 비밀번호가 실제 계정 비밀번호와 일치하는지 (임시로 하드코딩된 값과 비교)
  const isCorrectPassword = useMemo(() => {
    if (password.length === 0) return false;
    return password === TEMP_CURRENT_PASSWORD;
  }, [password]);

  const passwordMessage = useMemo(() => {
    if (password.length === 0) return '';
    return isCorrectPassword ? '' : '비밀번호가 일치하지 않아요.';
  }, [password, isCorrectPassword]);

  const confirmResult = useMemo(() => {
    if (passwordConfirm.length === 0) {
      return { isValid: false, message: '' };
    }
    if (password !== passwordConfirm) {
      return { isValid: false, message: '비밀번호가 일치하지 않아요.' };
    }
    return { isValid: true, message: '비밀번호가 일치해요.' };
  }, [password, passwordConfirm]);

  const isNextEnabled = useMemo(() => {
    if (selected === null) {
      return false;
    }
    if (selected === '기타' && etcText.trim().length === 0) {
      return false;
    }
    return isCorrectPassword && confirmResult.isValid;
  }, [selected, etcText, isCorrectPassword, confirmResult.isValid]);

  const handleNext = () => {
    if (!isNextEnabled) return;
    navigation.navigate('DeleteComplete');
  };

  return (
    <SafeAreaView edges={['top']} className="bg-primary-backgorund flex-1 px-5 pt-6">
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
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="비밀번호를 입력해 주세요"
              />
            </View>
            {passwordMessage.length > 0 && (
              <Text className="mt-1 font-notoSansKRRegular text-xs text-red-500">
                {passwordMessage}
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
