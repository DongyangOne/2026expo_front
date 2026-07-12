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
    <SafeAreaView edges={['top']} className="flex-1 items-center bg-primary-backgorund px-6">
      <Text className="text-gray-800 pt-9 font-notoSansKRBold text-xl">피드백 목록</Text>
      <ScrollView className="w-full">
        {feedback.map((group) => (
          <View key={group.date} className="mt-12 gap-2">
            <View className="min-h-20 flex-row items-center rounded-xl bg-purple/[0.08] px-4 py-3">
              <Text className="font-notoSansKRBold text-base">{group.date}</Text>
            </View>
            {group.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate('FeedbackDetail', { id: item.id })}
                className={`min-h-[65px] flex-row items-center gap-3 rounded-xl px-4 py-3 ${
                  item.success ? 'bg-green/[0.08]' : 'bg-red/[0.08]'
                }`}>
                <Text className="font-notoSansKRBold text-base text-body">{item.time}</Text>
                <View
                  className={`h-[10px] w-[10px] rounded-full ${
                    item.success ? 'bg-green' : 'bg-red'
                  }`}
                />
                <Text className="flex-1 text-center font-notoSansKRDemiLight text-xs leading-5">
                  {item.message}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
