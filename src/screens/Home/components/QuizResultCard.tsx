import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import RetryQuizButton from '@/assets/icons/retry-quiz-button.svg';

import PlaceholderCircle from './PlaceholderCircle';

interface QuizResultCardProps {
  accuracyPercent: number;
  quizIcon?: ImageSourcePropType;
  onPressRetry: () => void;
}

const ICON_SIZE = 66;
const RETRY_BUTTON_WIDTH = 93;
const RETRY_BUTTON_HEIGHT = 27;

/** 퀴즈 박스: 최근 퀴즈 정답률을 보여주고, 다시 풀기 버튼을 누르면 퀴즈 탭에서 가장 최근 틀린 문제를 다시 풀 수 있게 이동한다. */
const QuizResultCard = ({ accuracyPercent, quizIcon, onPressRetry }: QuizResultCardProps) => {
  return (
    <View className="flex-row items-center rounded-[9.5px] border border-border bg-white px-[13px] py-[10px]">
      <PlaceholderCircle size={ICON_SIZE} source={quizIcon} />

      <View className="ml-[20px] shrink">
        <Text className="font-notoSansKRRegular text-sm text-body">최근 퀴즈 결과</Text>
        <Text className="mt-[14px] font-notoSansKRBold text-lg text-black">
          정답률 {accuracyPercent}%
        </Text>
      </View>

      <Pressable className="ml-auto shrink-0 pl-[12px]" onPress={onPressRetry}>
        <RetryQuizButton height={RETRY_BUTTON_HEIGHT} width={RETRY_BUTTON_WIDTH} />
      </Pressable>
    </View>
  );
};

export default QuizResultCard;
