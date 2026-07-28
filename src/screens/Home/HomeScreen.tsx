import React, { useCallback } from 'react';
import { ActivityIndicator, Linking, Platform, ScrollView, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/ui';
import type { RootTabParamList } from '@/navigation/types';
import { formatDotDate } from '@/utils';

import CameraFab from './components/CameraFab';
import type { RecyclingLogEntry } from './components/RecyclingLogItem';
import RecyclingLogItem from './components/RecyclingLogItem';
import CharacterCard from './components/CharacterCard';
import QuizResultCard from './components/QuizResultCard';
import { useDashboard } from './hooks/useDashboard';
import {
  computeAccuracyPercent,
  getWasteTypeImage,
  mapEvolutionStageToLevelInput,
  WASTE_TYPE_LABEL,
} from './utils';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { data, isLoading, isError, refetch } = useDashboard();

  const handleRetryQuiz = useCallback(() => {
    // TODO: 가장 최근 틀린 문제로 바로 이동하는 파라미터 연동 (퀴즈 API 연동 후)
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
  const { level, currentXp } = mapEvolutionStageToLevelInput(characterInfo.evolutionStage);
  const accuracyPercent = computeAccuracyPercent(
    quizProfileInfo.correctQuiz,
    quizProfileInfo.solvedQuiz,
  );
  const recyclingLogEntries: RecyclingLogEntry[] = recyclingLogInfo.map((log, index) => ({
    id: `${log.recycledAt}-${index}`,
    date: formatDotDate(log.recycledAt),
    category: WASTE_TYPE_LABEL[log.wasteType],
    image: getWasteTypeImage(log.wasteType),
  }));

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1 px-[19px]"
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 19 }}
          showsVerticalScrollIndicator={false}>
          <CharacterCard
            characterImage={{ uri: characterInfo.imageUrl }}
            characterName={characterInfo.characterName}
            currentXp={currentXp}
            level={level}
          />

          <View className="mt-[17px]">
            <QuizResultCard accuracyPercent={accuracyPercent} onPressRetry={handleRetryQuiz} />
          </View>

          <Text className="mb-[26px] mt-[29px] font-notoSansKRBold text-xl text-black">
            분리수거 로그
          </Text>

          <View className="gap-[13px]">
            {recyclingLogEntries.map((entry) => (
              <RecyclingLogItem entry={entry} key={entry.id} onPress={handlePressLog} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <CameraFab onPress={handleOpenCamera} />
    </View>
  );
};

export default HomeScreen;
