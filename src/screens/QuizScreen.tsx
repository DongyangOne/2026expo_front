import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

const QuizScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-notoSansKRRegular text-xl text-gray-800">퀴즈</Text>
      <TouchableOpacity
        className="mt-6 rounded-full bg-purple px-8 py-3"
        onPress={() => navigation.navigate('FindPassword')}
        activeOpacity={0.8}>
        <Text className="font-notoSansKRBold text-base text-white">비밀번호 찾기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizScreen;
