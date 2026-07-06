import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { cssInterop } from 'nativewind';
import BackArrow from '../assets/images/Vector.svg';
import SmallArrowR from '../assets/images/ChevronRight.svg';
import SmallArrowL from '../assets/images/ChevronLeft.svg';
import tailwindConfig from '../../tailwind.config.js';

cssInterop(LinearGradient, {
  className: 'style',
});

import type { RootStackParamList } from '@/navigation/types';

const FeedbackDetailScreen = () => {
  const { colors } = tailwindConfig.theme.extend;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoSearch = () => {
    navigation.navigate('Tabs', { screen: 'Search' });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary-backgorund">
      <View className="flex-row items-center px-6 pt-2">
        <TouchableOpacity className="w-10 p-2" onPress={() => navigation.goBack()}>
          <BackArrow width={20} height={20} />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-notoSansKRBold text-3xl text-black">
          피드백 상세
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6">
        <View className="mt-3 flex-row items-center justify-center gap-2 py-6">
          <TouchableOpacity className="p-1">
            <SmallArrowL width={20} height={20} />
          </TouchableOpacity>
          <Text className="font-notoSansKRRegular text-lg text-gray">2026.05.06 - 12:34</Text>
          <TouchableOpacity className="p-1">
            <SmallArrowR width={20} height={20} />
          </TouchableOpacity>
        </View>

        <Text className="my-4 text-center font-notoSansKRRegular text-xl text-black">
          캔을 올바르게 버리지 못했어요.
        </Text>

        <View className="mt-6 min-h-64 bg-gray py-52">
          <Text className="text-gray-500 font-notoSansKRRegular text-base">동영상</Text>
        </View>

        <View className="mt-6 rounded-xl bg-purple/[0.08] px-4 py-8">
          <Text className="font-notoSansKRBold text-lg text-black">캔을 버릴 때에는</Text>
          <Text className="text-gray-700 mt-6 font-notoSansKRRegular text-base">
            1. 안에 내용물이 없어야 합니다.
          </Text>
          <Text className="text-gray-700 mt-6 font-notoSansKRRegular text-base">
            2. 물로 헹군후 배출해야 합니다.
          </Text>
        </View>

        <View className="mt-4 px-8 py-6 pt-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="overflow-hidden rounded-full"
            onPress={handleGoSearch}>
            <LinearGradient
              colors={[colors.pink, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center py-4">
              <Text className="font-notoSansKRBold text-xl text-white">자세한 분리수거 방법</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackDetailScreen;
