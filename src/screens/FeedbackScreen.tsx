import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootTabParamList, RootStackParamList } from '@/navigation/types';

const LIST_FEEDBACK = [
  {
    date: '2026.05.06',
    items: [
      { id: 1, time: '13:34', success: true, message: '캔을 올바르게 분리수거 하셨어요' },
      { id: 2, time: '13:34', success: true, message: '캔을 올바르게 분리수거 하셨어요' },
      {
        id: 3,
        time: '13:34',
        success: false,
        message: '올바른 분리수거가 이루어지지 않았어요.\n(캔에 음식물이 들어있었다)',
      },
    ],
  },
  {
    date: '2026.05.05',
    items: [
      { id: 4, time: '13:34', success: true, message: '캔을 올바르게 분리수거 하셨어요' },
      {
        id: 5,
        time: '13:34',
        success: false,
        message: '올바른 분리수거가 이루어지지 않았어요.\n(캔에 음식물이 들어있었다)',
      },
    ],
  },
];

const feedback = LIST_FEEDBACK;

type FeedbackScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Feedback'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const FeedbackScreen = () => {
  const navigation = useNavigation<FeedbackScreenNavigationProp>();

  return (
    <SafeAreaView edges={['top']} className="flex-1 items-center bg-white">
      <Text className="text-gray-800 font-notoSansKRRegular text-xl">피드백 목록</Text>
      <ScrollView className="w-full">
        {feedback.map((group) => (
          <View key={group.date} className="mt-12 gap-4">
            <View className="min-h-20 flex-row items-start justify-center rounded-xl bg-[#F5F3FF] px-4 py-3">
              <Text className="">{group.date}</Text>
            </View>
            {group.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate('FeedbackDetail', { id: item.id })}
                className={`min-h-20 flex-row items-start gap-3 rounded-xl px-4 py-3 ${
                  item.success ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                <Text>{item.time}</Text>
                <View
                  className={`mt-1.5 h-2 w-2 rounded-full ${
                    item.success ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <Text>{item.message}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
