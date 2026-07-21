import React from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';

import BackgroundCircles from './components/BackgroundCircles';
import CompleteCheckBadge from './components/CompleteCheckBadge';
import GradientText from './components/GradientText';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupComplete'>;

const SignupCompleteScreen = (_props: Props) => {
  return (
    <View className="flex-1 bg-background">
      <BackgroundCircles />
      <SafeAreaView className="flex-1 items-center justify-center" edges={['top', 'bottom']}>
        <CompleteCheckBadge />

        <View className="mt-[32px] flex-row items-center justify-center px-11">
          <Text className="text-center font-notoSansKRBold text-xl text-black">가입이 </Text>
          <GradientText fontSize={20} height={28} text="완료" width={48} />
          <Text className="text-center font-notoSansKRBold text-xl text-black">되었습니다</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SignupCompleteScreen;
