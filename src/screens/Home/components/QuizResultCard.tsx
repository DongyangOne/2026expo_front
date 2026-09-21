import React from 'react';
import { Pressable, Text, View } from 'react-native';

import RetryQuizButton from '@/assets/icons/retry-quiz-button.svg';

interface QuizResultCardProps {
  accuracyPercent: number;
  onPressRetry: () => void;
}

const RETRY_BUTTON_WIDTH = 93;
const RETRY_BUTTON_HEIGHT = 27;

/** 퀴즈 박스: 최근 퀴즈 정답률을 보여주고, 다시 풀기 버튼을 누르면 퀴즈 탭에서 가장 최근 틀린 문제를 다시 풀 수 있게 이동한다. */
const QuizResultCard = ({ accuracyPercent, onPressRetry }: QuizResultCardProps) => {
  return (
    <View className="h-[86px] flex-row items-center rounded-[9.5px] border border-border bg-white px-[13px]">
      <View className="shrink flex-row items-center gap-x-[12px]">
        <Text className="font-notoSansKRRegular text-sm text-body">최근 퀴즈 결과</Text>
        <Text className="font-notoSansKRBold text-lg text-black">정답률 {accuracyPercent}%</Text>
      </View>

      <Pressable className="ml-auto shrink-0 pl-[12px]" onPress={onPressRetry}>
        <RetryQuizButton height={RETRY_BUTTON_HEIGHT} width={RETRY_BUTTON_WIDTH} />
      </Pressable>
    </View>
  );
};

export default QuizResultCard;
