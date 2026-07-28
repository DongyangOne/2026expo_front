import React, { useCallback } from 'react';
import { Linking, Platform, ScrollView, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import recyclingGlass from '@/assets/images/recycling-glass.png';
import recyclingPaper from '@/assets/images/recycling-paper.png';
import recyclingPlastic from '@/assets/images/recycling-plastic.png';
import type { RootTabParamList } from '@/navigation/types';

import CameraFab from './components/CameraFab';
import type { RecyclingLogEntry } from './components/RecyclingLogItem';
import RecyclingLogItem from './components/RecyclingLogItem';
import CharacterCard from './components/CharacterCard';
import QuizResultCard from './components/QuizResultCard';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

// TODO: 실제 API 연동 전까지 동작 확인용 mock 값
const MOCK_LEVEL = 5;
const MOCK_CURRENT_XP = 500;
const MOCK_QUIZ_ACCURACY = 80;
const MOCK_RECYCLING_LOGS: RecyclingLogEntry[] = [
  { id: '1', date: '2025.05.03', category: '플라스틱', image: recyclingPlastic },
  { id: '2', date: '2025.05.03', category: '종이', image: recyclingPaper },
  { id: '3', date: '2025.05.03', category: '유리', image: recyclingGlass },
];

const HomeScreen = ({ navigation }: Props) => {
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

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1 px-[19px]"
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 19 }}
          showsVerticalScrollIndicator={false}>
          <CharacterCard currentXp={MOCK_CURRENT_XP} level={MOCK_LEVEL} />

          <View className="mt-[17px]">
            <QuizResultCard accuracyPercent={MOCK_QUIZ_ACCURACY} onPressRetry={handleRetryQuiz} />
          </View>

          <Text className="mb-[26px] mt-[29px] font-notoSansKRBold text-xl text-black">
            분리수거 로그
          </Text>

          <View className="gap-[13px]">
            {MOCK_RECYCLING_LOGS.map((entry) => (
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
