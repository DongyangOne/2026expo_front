import React, { useCallback } from 'react';
import { ActivityIndicator, Linking, Platform, ScrollView, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/ui';
import type { RootTabParamList } from '@/navigation/types';
import { formatDotDate } from '@/utils';

import CameraFab, { CAMERA_FAB_BOTTOM_OFFSET, CAMERA_FAB_SIZE } from './components/CameraFab';
import type { RecyclingLogEntry } from './components/RecyclingLogItem';
import RecyclingLogItem from './components/RecyclingLogItem';
import CharacterCard from './components/CharacterCard';
import QuizResultCard from './components/QuizResultCard';
import { useDashboard } from './hooks/useDashboard';
import { computeAccuracyPercent, getWasteTypeDisplayLabel, getWasteTypeImage } from './utils';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

/** 마지막 로그 항목이 카메라 플로팅 버튼에 가리지 않도록 확보하는 스크롤 하단 여백 */
const SCROLL_BOTTOM_PADDING = CAMERA_FAB_BOTTOM_OFFSET + CAMERA_FAB_SIZE + 19;

const HomeScreen = ({ navigation }: Props) => {
  const { data, isLoading, isError, refetch } = useDashboard();

  const handleRetryQuiz = useCallback(() => {
    navigation.navigate('Quiz');
  }, [navigation]);

  const handlePressLog = useCallback(
    (_entry: RecyclingLogEntry) => {
      navigation.navigate('Feedback');
    },
    [navigation],
  );

  const handleOpenCamera = useCallback(async () => {
    if (Platform.OS !== 'android') {
      // TODO: iOS는 공개 URL 스킴으로 기본 카메라 앱을 열 수 없어 별도 대응 필요
      return;
    }

    try {
      await Linking.sendIntent('android.media.action.STILL_IMAGE_CAMERA');
    } catch {
      // TODO: 카메라 인텐트 실패 시 사용자 피드백 처리
    }
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#7B61FF" size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-[19px]">
        <Text className="mb-[24px] font-notoSansKRRegular text-base text-body">
          정보를 불러오지 못했어요.
        </Text>
        <GradientButton label="재시도" onPress={refetch} />
      </View>
    );
  }

  const { characterInfo, quizProfileInfo, recyclingLogInfo } = data;
  const accuracyPercent = computeAccuracyPercent(
    quizProfileInfo.correctQuiz,
    quizProfileInfo.solvedQuiz,
  );
  const recyclingLogEntries: RecyclingLogEntry[] = recyclingLogInfo.map((log, index) => ({
    id: `${log.recycledAt}-${index}`,
    date: formatDotDate(log.recycledAt),
    category: getWasteTypeDisplayLabel(log.wasteType),
    image: getWasteTypeImage(log.wasteType),
  }));

  return (
    <View className="flex-1 bg-background">
      {/* 하단 인셋은 탭 바(TabNavigator)가 이미 반영하므로 여기서는 top만 적용한다. */}
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1 px-[19px]"
          contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_PADDING, paddingTop: 19 }}
          showsVerticalScrollIndicator={false}>
          <CharacterCard
            characterImage={{ uri: characterInfo.imageUrl }}
            characterName={characterInfo.characterName}
            level={characterInfo.level}
            progressRatio={Math.min(Math.max(characterInfo.expPercentage / 100, 0), 1)}
            remainingXp={characterInfo.remainingExp}
          />

          <View className="mt-[17px]">
            <QuizResultCard accuracyPercent={accuracyPercent} onPressRetry={handleRetryQuiz} />
          </View>

          <Text className="mb-[26px] mt-[29px] font-notoSansKRBold text-xl text-black">
            분리수거 로그
          </Text>

          {recyclingLogEntries.length === 0 ? (
            <View className="items-center rounded-[10px] border border-dashed border-border bg-white px-[20px] py-[30px]">
              <Text className="font-notoSansKRBold text-base text-black">아직 기록이 없어요</Text>
              <Text className="mt-[8px] text-center font-notoSansKRRegular text-sm text-body">
                카메라로 첫 분리수거를 기록해보세요
              </Text>
            </View>
          ) : (
            <View className="gap-[13px]">
              {recyclingLogEntries.map((entry) => (
                <RecyclingLogItem entry={entry} key={entry.id} onPress={handlePressLog} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <CameraFab onPress={handleOpenCamera} />
    </View>
  );
};

export default HomeScreen;
