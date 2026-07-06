import React, { useState } from 'react';
import { cssInterop } from 'nativewind';
import LinearGradient from 'react-native-linear-gradient';

cssInterop(LinearGradient, {
  className: 'style',
});
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
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

const DeleteAccountScreen = () => {
  const { colors } = tailwindConfig.theme.extend;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selected, setSelected] = useState<string | null>(null);
  const [etcText, setEtcText] = useState('');

  const handleNext = () => navigation.navigate('DeleteComplete');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary-backgorund px-5 pt-6">
      <View className="relative flex-row items-center ">
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow width={20} height={20} />
        </TouchableOpacity>
      </View>
      <Text className="mt-20 text-center font-notoSansKRBold text-2xl text-black">
        떠나신다고 하니 슬퍼요.{'\n'} 더 나은 서비스를 위해{'\n'} 떠나시는 이유를 알려주세요
      </Text>
      <Text className="mt-6 text-center font-notoSansKRRegular text-base text-gray">
        떠나시면 계정은 다시 복구할 수 없어요
      </Text>

      {/* 라디오 목록 */}
      <View className="mt-10">
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

              <Text className="ml-3 font-notoSansKRRegular text-base text-black">{reason}</Text>
            </TouchableOpacity>
          );
        })}
        {selected !== '기타' && (
          <>
            {/* 아이디 */}
            <View className="ml-3 mr-3 mt-6">
              <Text className="mb-2 font-notoSansKRRegular text-sm text-black">아이디</Text>
              <View className="rounded-xl border border-border px-5 py-3">
                <Text className="font-notoSansKRRegular text-base text-black">cye4526</Text>
              </View>
            </View>

            {/* 비밀번호 */}
            <View className="ml-3 mr-3 mt-4">
              <Text className="mb-2 font-notoSansKRRegular text-sm text-black">비밀번호</Text>
              <View className="rounded-xl border border-border px-5 py-3">
                <Text className="font-notoSansKRRegular text-base text-black">******</Text>
              </View>
            </View>
          </>
        )}
        {/* 기타 선택 시에만 입력창 노출 */}
        {selected === '기타' && (
          <View className="ml-3 mr-3 mt-2 min-h-[200px] rounded-xl border border-border px-5 py-3">
            <TextInput
              className="flex-1 font-notoSansKRRegular text-base text-black"
              placeholder="떠나시는 이유를 작성해 주세요."
              multiline
              maxLength={500}
              value={etcText}
              onChangeText={setEtcText}
              textAlignVertical="top"
            />
            <Text className="mt-1 text-right font-notoSansKRDemiLight text-xs text-black">
              ({etcText.length}/500)
            </Text>
          </View>
        )}
      </View>
      {/* 버튼 */}
      <TouchableOpacity className="mx-5 mt-20" onPress={handleNext}>
        <LinearGradient
          colors={[colors.linear.start, `${colors.linear.end}80`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="mx-5 items-center justify-center rounded-full py-5">
          <Text className="text-center font-notoSansKRBold text-xl text-white">다음</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;
