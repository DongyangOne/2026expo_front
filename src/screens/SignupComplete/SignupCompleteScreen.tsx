import React from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import type { RootStackParamList } from '@/navigation/types';

import BackgroundCircles from './components/BackgroundCircles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupComplete'>;

const SignupCompleteScreen = (_props: Props) => {
  return (
    <View className="flex-1 bg-background">
      <BackgroundCircles />
      <SafeAreaView className="flex-1 items-center justify-center px-11" edges={['top', 'bottom']}>
        <View className="size-[160px] items-center justify-center rounded-full border border-border bg-white">
          <Svg height={64} viewBox="0 0 60 55" width={70}>
            <Path
              d="M3.5 26L20.5 43L53.5 3"
              stroke="#7B61FF"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={6}
              fill="none"
            />
          </Svg>
        </View>

        <Text className="mt-[32px] text-center font-notoSansKRBold text-lg text-black">
          가입이 <Text className="text-pink">완료</Text>되었습니다
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default SignupCompleteScreen;
