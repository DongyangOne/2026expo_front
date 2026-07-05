import React from 'react';
import { cssInterop } from 'nativewind';

cssInterop(LinearGradient, {
  className: 'style',
});

import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import type { RootStackParamList } from '@/navigation/types';

import CompleteImage from '../assets/images/leave.svg';

const DeleteCompleteScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    });
  };

  return (
    <SafeAreaView edges={['top']}>
      {/* 완료 이미지 */}
      <View className="items-center">
        <CompleteImage width={377} height={377} />
      </View>
      <Text className="mt-20 text-center font-notoSansKRBold text-2xl text-black">
        탈퇴가 완료되었습니다.{'\n'} 이용해 주셔서 감사합니다.
      </Text>
      {/* 처음으로 버튼 */}
      <TouchableOpacity className="mx-5 mt-20" onPress={handleGoHome}>
        <LinearGradient
          colors={['#7B61FF', '#FF4FD8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="mx-7 items-center justify-center rounded-full py-6">
          <Text className="text-center font-notoSansKRBold text-xl text-white">처음으로</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DeleteCompleteScreen;
