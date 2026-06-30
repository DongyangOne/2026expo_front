import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

const FeedbackDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-row items-center px-6 pt-2">
        <TouchableOpacity className="w-10 p-2" onPress={() => navigation.goBack()}>
          <Text className="text-gray-800 text-xl">{'<'}</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center font-notoSansKRBold text-lg text-black">
          피드백 상세
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6">
        <View className="mt-3 flex-row items-center justify-center gap-2">
          <TouchableOpacity className="p-1">
            <Text className="text-gray-500 text-sm">{'<'}</Text>
          </TouchableOpacity>
          <Text className="text-gray-600 font-notoSansKRRegular text-sm">2026.05.06 - 12:34</Text>
          <TouchableOpacity className="p-1">
            <Text className="text-gray-500 text-sm">{'>'}</Text>
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-center font-notoSansKRRegular text-base text-black">
          캔을 올바르게 버리지 못했어요.
        </Text>

        <View className="border-gray-200 bg-gray-200 mt-6 aspect-square items-center justify-center rounded-xl border">
          <Text className="text-gray-500 font-notoSansKRRegular text-base">동영상</Text>
          <TouchableOpacity className="bg-gray-500/70 mt-4 h-14 w-14 items-center justify-center rounded-full">
            <Text className="text-2xl text-white">▶</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 rounded-xl bg-[#F5F3FF] px-4 py-4">
          <Text className="font-notoSansKRBold text-base text-black">캔을 버릴 때에는</Text>
          <Text className="text-gray-700 mt-2 font-notoSansKRRegular text-sm">
            1. 안에 내용물이 없어야 합니다.
          </Text>
          <Text className="text-gray-700 mt-1 font-notoSansKRRegular text-sm">
            2. 물로 헹군후 배출해야 합니다.
          </Text>
        </View>

        <View className="mt-auto pb-6 pt-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="items-center rounded-full bg-violet-500 py-4">
            <Text className="font-notoSansKRBold text-base text-white">자세한 분리수거 방법</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackDetailScreen;
