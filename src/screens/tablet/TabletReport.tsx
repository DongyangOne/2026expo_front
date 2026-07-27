import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ListRenderItemInfo, SectionListData } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { FONTS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { clearAdminSession, getAdminFeedbackList } from '@/services';
import { useAuthStore } from '@/store';
import type { AdminFeedback } from '@/types';

import { TabletReportColumnDivider, TabletReportRow } from './components';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletReport'>;

interface ReportGroup {
  data: AdminFeedback[];
  date: string;
  isFirst: boolean;
}

const PAGE_SIZE = 10;

const groupFeedbackByDate = (feedbackList: AdminFeedback[]): ReportGroup[] => {
  const feedbackGroups: ReportGroup[] = [];

  feedbackList.forEach((feedback) => {
    const lastGroup = feedbackGroups[feedbackGroups.length - 1];

    if (lastGroup?.date === feedback.date) {
      lastGroup.data.push(feedback);
      return;
    }

    feedbackGroups.push({
      data: [feedback],
      date: feedback.date,
      isFirst: feedbackGroups.length === 0,
    });
  });

  return feedbackGroups;
};

const TABLE_COLUMNS = [
  { key: 'time', label: '바뀐 시간', widthClassName: 'w-[323px]' },
  { key: 'user', label: '사용자', widthClassName: 'w-[366px]' },
  { key: 'content', label: '분리수거 내용', widthClassName: 'min-w-0 flex-1' },
] as const;

const BackGradientText = () => (
  <Svg height={18} width={58}>
    <Defs>
      <LinearGradient id="report-back-text-gradient" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#7B61FF" />
        <Stop offset="1" stopColor="#FF4FD8" />
      </LinearGradient>
    </Defs>
    <SvgText
      fill="url(#report-back-text-gradient)"
      fontFamily={FONTS.regular}
      fontSize={15}
      textAnchor="middle"
      x={29}
      y={13}>
      뒤로가기
    </SvgText>
  </Svg>
);

const TabletReport = ({ navigation }: Props) => {
  const adminLogout = useAuthStore((state) => state.adminLogout);

  const [feedbackList, setFeedbackList] = useState<AdminFeedback[]>([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isRequestingRef = useRef(false);

  const fetchAdminFeedback = useCallback(async (targetPage: number, isRefresh: boolean) => {
    if (isRequestingRef.current) {
      return;
    }

    isRequestingRef.current = true;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const { data } = await getAdminFeedbackList({
        page: targetPage,
        pageSize: PAGE_SIZE,
      });

      setFeedbackList((currentFeedbackList) =>
        targetPage === 0 ? data.content : [...currentFeedbackList, ...data.content],
      );
      setPage(data.page);
      setIsLast(data.last);
    } catch (error: unknown) {
      console.error('[TabletReport] 관리자 피드백 조회 실패', error);
      setErrorMessage(
        error instanceof Error ? error.message : '관리자 피드백을 불러오지 못했습니다.',
      );
    } finally {
      isRequestingRef.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchAdminFeedback(0, false));
  }, [fetchAdminFeedback]);

  const feedbackGroups = useMemo(() => groupFeedbackByDate(feedbackList), [feedbackList]);

  const handleBackPress = (): void => {
    Alert.alert('로그아웃', '로그아웃됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          await clearAdminSession();
          adminLogout();
          navigation.replace('TabletMain');
        },
      },
    ]);
  };

  const handleRefresh = useCallback((): void => {
    void fetchAdminFeedback(0, true);
  }, [fetchAdminFeedback]);

  const handleLoadMore = useCallback((): void => {
    if (isLoading || isRefreshing || isLast || isRequestingRef.current) {
      return;
    }

    void fetchAdminFeedback(page + 1, false);
  }, [fetchAdminFeedback, isLast, isLoading, isRefreshing, page]);

  const handleFeedbackKey = useCallback(
    (feedback: AdminFeedback): string => String(feedback.feedbackId),
    [],
  );

  const renderFeedback = useCallback(
    ({ item }: ListRenderItemInfo<AdminFeedback>) => <TabletReportRow feedback={item} />,
    [],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<AdminFeedback, ReportGroup> }) => (
      <View>
        {!section.isFirst ? (
          <Text className="my-[30px] ml-[37px] font-notoSansKRBold text-2xl text-black">
            {section.date}
          </Text>
        ) : null}

        <View className="mb-[9px] w-full flex-row overflow-visible rounded-[4px] bg-purple/[0.08]">
          {TABLE_COLUMNS.map((column, columnIndex) => (
            <View
              key={column.key}
              className={`${column.widthClassName} h-[91px] items-center justify-center`}>
              <Text className="font-notoSansKRBold text-xl text-black">{column.label}</Text>
              {columnIndex < TABLE_COLUMNS.length - 1 ? <TabletReportColumnDivider /> : null}
            </View>
          ))}
        </View>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <SectionList
        className="flex-1"
        sections={feedbackGroups}
        keyExtractor={handleFeedbackKey}
        renderItem={renderFeedback}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={
          <View>
            <View className="my-[30px] ml-[37px] flex-row items-center justify-between">
              <Text className="font-notoSansKRBold text-2xl text-black">
                {feedbackGroups[0]?.date ?? '피드백 조회'}
              </Text>
              <Pressable
                className="mr-[25px] h-[50px] w-[210px] items-center justify-center overflow-hidden rounded-full"
                onPress={handleBackPress}>
                <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
                  <Defs>
                    <LinearGradient id="report-back-border-gradient" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor="#7B61FF" />
                      <Stop offset="1" stopColor="#FF4FD8" />
                    </LinearGradient>
                  </Defs>
                  <Rect
                    fill="transparent"
                    height="49"
                    rx="24.5"
                    stroke="url(#report-back-border-gradient)"
                    strokeWidth="1"
                    width="209"
                    x="0.5"
                    y="0.5"
                  />
                </Svg>
                <BackGradientText />
              </Pressable>
            </View>
            {errorMessage ? (
              <Text className="mb-6 text-center font-notoSansKRRegular text-base text-red">
                {errorMessage}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !isLoading && !errorMessage ? (
            <Text className="mt-12 text-center font-notoSansKRRegular text-base text-body">
              조회된 피드백이 없습니다.
            </Text>
          ) : null
        }
        ListFooterComponent={
          isLoading && !isRefreshing ? <ActivityIndicator className="my-8" color="#7B61FF" /> : null
        }
        initialNumToRender={PAGE_SIZE}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default TabletReport;
