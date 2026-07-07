import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { TabletBackgroundCircles } from '@/components/layout';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletMain'>;

const TabletMain = ({ navigation }: Props): React.JSX.Element => {
  const handleLoginPress = (): void => {
    navigation.navigate('TabletLogin');
  };

  const handleTrashFeedbackPress = (): void => {
    navigation.navigate('TabletTrashFeedback');
  };

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <TabletBackgroundCircles />
      <SafeAreaView className="flex-1 items-center justify-center" edges={['top', 'bottom']}>
        <View className="w-full max-w-[520px] items-center px-[32px]">
          <Text className="text-center font-notoSansKRBold text-[48px] text-black">2026 EXPO</Text>
          <Text className="mt-[16px] text-center font-notoSansKRRegular text-[18px] text-body">
            태블릿 전용 관리자 페이지
          </Text>

          <View className="mt-[72px] gap-[18px]">
            <Pressable
              className="h-[68px] w-[288px] items-center justify-center overflow-hidden rounded-[20px]"
              onPress={handleLoginPress}>
              <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
                <Defs>
                  <LinearGradient id="tablet-main-login-gradient" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#7B61FF" />
                    <Stop offset="1" stopColor="#FF4FD8" />
                  </LinearGradient>
                </Defs>
                <Rect fill="url(#tablet-main-login-gradient)" height="100%" rx={20} width="100%" />
              </Svg>
              <Text className="font-notoSansKRBold text-[16px] text-white">로그인</Text>
            </Pressable>

            <Pressable
              className="h-[68px] w-[288px] items-center justify-center rounded-[20px] border border-purple bg-white"
              onPress={handleTrashFeedbackPress}>
              <Text className="font-notoSansKRBold text-[16px] text-purple">쓰레기 피드백</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletMain;
