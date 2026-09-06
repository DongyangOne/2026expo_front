import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import CheckImage from '@/assets/images/check_image.png';

const AUTO_ADVANCE_DELAY = 1000;

type FindIdSuccessScreenProps = NativeStackScreenProps<RootStackParamList, 'FindIdSuccess'>;

const FindIdSuccessScreen = ({ navigation, route }: FindIdSuccessScreenProps) => {
  const { userId } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('FindIdResult', { userId });
    }, AUTO_ADVANCE_DELAY);

    return () => clearTimeout(timer);
  }, [navigation, userId]);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <View
        className="absolute -left-16 -top-16 rounded-full bg-pink"
        style={{ width: 220, height: 220, opacity: 0.15 }}
      />
      <View
        className="absolute -bottom-20 -right-16 rounded-full bg-purple"
        style={{ width: 260, height: 260, opacity: 0.12 }}
      />

      <View className="flex-1 items-center justify-center">
        <View className="h-64 w-full">
          <Image
            source={CheckImage}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <Text className="mt-8 font-notoSansKRBold text-lg text-black">
          인증이 <Text className="text-purple">완료</Text>되었습니다
        </Text>
      </View>
    </View>
  );
};

export default FindIdSuccessScreen;
