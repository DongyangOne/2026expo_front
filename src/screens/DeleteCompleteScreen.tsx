import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { cssInterop } from 'nativewind';
import type { RootStackParamList } from '../navigation/types';

cssInterop(LinearGradient, {
  className: 'style',
});

import CompleteImage from '../assets/images/leave.svg';

import tailwindConfig from '../../tailwind.config.js';

const DeleteCompleteScreen = () => {
  const { colors } = tailwindConfig.theme.extend;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MobileTabs' }],
    });
  };

  return (
    <SafeAreaView edges={['top']}>
      {/* 완료 이미지 */}
      <View className="mt-24 items-center">
        <CompleteImage />
      </View>
      <Text className="mt-14 text-center font-notoSansKRBold text-xl text-black">
        탈퇴가 완료되었습니다.{'\n'} 이용해 주셔서 감사합니다.
      </Text>
      {/* 처음으로 버튼 */}
      <TouchableOpacity className="mx-14 mt-20" onPress={handleGoHome}>
        <LinearGradient
          colors={[colors.purple, colors.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="items-center justify-center rounded-full py-5">
          <Text className="text-center font-notoSansKRBold text-base text-white">처음으로</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DeleteCompleteScreen;
