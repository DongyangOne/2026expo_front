import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import LogoIcon from '@/assets/icons/Logo.svg';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 1000;
const LOGO_WIDTH = 352;
const LOGO_HEIGHT = 235;

const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MobileTabs');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center overflow-hidden bg-background">
      <View className="absolute -left-[81%] -top-[12%] h-[48.6%] w-[109%] rotate-[9deg] rounded-full bg-pink/15" />
      <View className="absolute left-[41%] top-[70%] h-[48.6%] w-[109%] rotate-[9deg] rounded-full bg-purple/15" />

      <LogoIcon height={LOGO_HEIGHT} width={LOGO_WIDTH} />
      <Text
        className="mt-[12px] font-notoSansKRBold text-xl text-black"
        style={{ includeFontPadding: false }}>
        Ecomate
      </Text>
    </View>
  );
};

export default SplashScreen;
