import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootTabParamList, RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-notoSansKRRegular text-xl text-gray-800">홈</Text>
      <TouchableOpacity
        className="mt-6 rounded-full bg-purple px-8 py-3"
        onPress={() => navigation.navigate('ResetPasswordSuccess')}
        activeOpacity={0.8}>
        <Text className="font-notoSansKRBold text-base text-white">비밀번호 변경 완료</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 rounded-full bg-purple px-8 py-3"
        onPress={() => navigation.navigate('FindPasswordSuccess')}
        activeOpacity={0.8}>
        <Text className="font-notoSansKRBold text-base text-white">인증 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
