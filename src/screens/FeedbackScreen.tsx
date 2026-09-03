import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootTabParamList, RootStackParamList } from '@/navigation/types';
import { getFeedbackList } from '@/services';
import type { Feedback } from '@/types';

const PAGE_SIZE = 15;
const SCROLL_END_THRESHOLD = 40;

interface FeedbackGroup {
  date: string;
  items: Feedback[];
}

const buildMessage = (item: Feedback): string =>
  item.isSuccess
    ? `${item.wasteType}을(를) 올바르게 분리수거 하셨어요`
    : `올바른 분리수거가 이루어지지 않았어요.\n(${item.feedbackText})`;

const groupByDate = (items: Feedback[]): FeedbackGroup[] => {
  const groups: FeedbackGroup[] = [];

  items.forEach((item) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.date === item.date) {
      lastGroup.items.push(item);
    } else {
      groups.push({ date: item.date, items: [item] });
    }
  });

  return groups;
};

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent): boolean =>
  layoutMeasurement.height + contentOffset.y >= contentSize.height - SCROLL_END_THRESHOLD;

type FeedbackScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Feedback'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const FeedbackScreen = () => {
  const navigation = useNavigation<FeedbackScreenNavigationProp>();

  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchFeedback = useCallback(async (targetPage: number, isRefresh: boolean) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const { data } = await getFeedbackList({ page: targetPage, pageSize: PAGE_SIZE });

      setFeedbackList((prev) => (targetPage === 0 ? data.content : [...prev, ...data.content]));
      setPage(data.page);
      setIsLast(data.last);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '피드백을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchFeedback(0, false));
  }, [fetchFeedback]);

  const handleRefresh = () => {
    fetchFeedback(0, true);
  };

  const handleLoadMore = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isLoading || isLast || !isCloseToBottom(event.nativeEvent)) {
      return;
    }

    fetchFeedback(page + 1, false);
  };

  const feedbackGroups = groupByDate(feedbackList);

  return (
    <SafeAreaView edges={['top']} className="flex-1 items-center bg-background px-6">
      <Text className="text-gray-800 pt-9 font-notoSansKRBold text-xl">피드백 목록</Text>
      <ScrollView
        className="w-full"
        onScroll={handleLoadMore}
        scrollEventThrottle={200}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
        {errorMessage && (
          <Text className="mt-12 text-center font-notoSansKRDemiLight text-sm text-red">
            {errorMessage}
          </Text>
        )}
        {feedbackGroups.map((group) => (
          <View key={group.date} className="mt-12 gap-2">
            <View className="h-[58px] flex-row items-center rounded-xl bg-purple/[0.08] px-4 py-3">
              <Text className="font-notoSansKRBold text-base">{group.date}</Text>
            </View>
            {group.items.map((item) => (
              <TouchableOpacity
                key={item.feedbackId}
                onPress={() => navigation.navigate('FeedbackDetail', { id: item.feedbackId })}
                className={`min-h-[65px] flex-row items-center gap-3 rounded-xl px-4 py-3 ${
                  item.isSuccess ? 'bg-green/[0.08]' : 'bg-red/[0.08]'
                }`}>
                <Text className="font-notoSansKRBold text-base text-body">{item.time}</Text>
                <View
                  className={`h-[10px] w-[10px] rounded-full ${
                    item.isSuccess ? 'bg-green' : 'bg-red'
                  }`}
                />
                <Text className="flex-1 text-center font-notoSansKRDemiLight text-xs leading-5">
                  {buildMessage(item)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        {isLoading && !isRefreshing && <ActivityIndicator className="mt-6" color="#7B61FF" />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
