import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletLogin'>;

const TabletLogin = ({ navigation }: Props) => {
  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView className="flex-1 px-10 py-8" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-center font-notoSansKRBold text-3xl text-gray-800">
          태블릿 초기화면 로그인
        </Text>

        <Pressable
          className="mt-6 h-10 items-center justify-center rounded-full border border-pink bg-white px-8"
          onPress={() => navigation.navigate('TabletSignup')}>
          <Text className="font-notoSansKRBold text-sm text-pink">회원가입</Text>
        </Pressable>
      </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletLogin;
