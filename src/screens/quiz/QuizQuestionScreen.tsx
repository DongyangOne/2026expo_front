import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Defs, LinearGradient as SvgLinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import QuitIcon from '@/assets/icons/quit.svg';
import QuizOIcon from '@/assets/icons/quizO.svg';
import QuizXIcon from '@/assets/icons/quizX.svg';

export interface QuizQuestion {
  id: number;
  question: string;
  answer: boolean; // true = O, false = X
  explanation: string;
}

export const QUIZ_COUNT_OPTIONS = [5, 6, 7, 8, 9, 10];

export const QUESTION_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: '페트병은 뚜껑과 함께\n버려야 한다.',
    answer: false,
    explanation: '페트병과 뚜껑은 따로 버려야 해요!',
  },
  {
    id: 2,
    question: '종이는 물에 젖지 않도록\n보관 후 배출해야 한다.',
    answer: true,
    explanation: '젖은 종이는 재활용이 어려워요!',
  },
  {
    id: 3,
    question: '유리병은 깨진 상태로\n버려도 된다.',
    answer: false,
    explanation: '깨진 유리는 일반 쓰레기로 버려야 해요!',
  },
  {
    id: 4,
    question: '건전지는 일반 쓰레기와\n함께 버리면 안 된다.',
    answer: true,
    explanation: '건전지는 전용 수거함에 따로 버려야 해요!',
  },
  {
    id: 5,
    question: '우유팩은 일반 종이류와\n함께 배출해야 한다.',
    answer: false,
    explanation: '우유팩은 일반 종이류와 분리해서 배출해야 해요!',
  },
  {
    id: 6,
    question: '캔은 내용물을 비우고\n배출해야 한다.',
    answer: true,
    explanation: '내용물을 비운 뒤 배출해야 재활용이 가능해요!',
  },
  {
    id: 7,
    question: '비닐봉지는 재활용이\n가능하다.',
    answer: true,
    explanation: '깨끗한 비닐봉지는 재활용이 가능해요!',
  },
  {
    id: 8,
    question: '스티로폼은 이물질이 묻어\n있어도 그대로 버리면 된다.',
    answer: false,
    explanation: '이물질을 제거한 뒤 버려야 재활용이 가능해요!',
  },
  {
    id: 9,
    question: '플라스틱은 색상별로\n분리하지 않아도 된다.',
    answer: true,
    explanation: '플라스틱은 색상 구분 없이 배출해도 괜찮아요!',
  },
  {
    id: 10,
    question: '종이컵은 일반 쓰레기로\n버려야 한다.',
    answer: true,
    explanation: '종이컵은 코팅 때문에 일반 쓰레기로 버려야 해요!',
  },
];

const PROGRESS_BAR_HEIGHT = 20;
const PROGRESS_GRADIENT_START = '#7B61FF';
const PROGRESS_GRADIENT_END = '#FF4FD8';

interface QuizQuestionScreenProps {
  currentIndex: number;
  total: number;
  question: QuizQuestion;
  onAnswer: (selected: boolean) => void;
  onClose: () => void;
  isExitConfirmOpen: boolean;
  onCancelExit: () => void;
  onConfirmExit: () => void;
}

const QuizQuestionScreen = ({
  currentIndex,
  total,
  question,
  onAnswer,
  onClose,
  isExitConfirmOpen,
  onCancelExit,
  onConfirmExit,
}: QuizQuestionScreenProps) => {
  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <View className="flex-1 bg-background px-6 pt-[68px]">
      <View className="flex-row items-center justify-center">
        <Pressable className="absolute left-0" onPress={onClose}>
          <QuitIcon width={20} height={19} />
        </Pressable>
        <Text className="font-notoSansKRDemilight text-base text-black">
          {currentIndex + 1}/{total}
        </Text>
      </View>

      <View
        className="mx-12 mt-6 border border-border"
        style={{
          width: '70%',
          height: PROGRESS_BAR_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderRadius: PROGRESS_BAR_HEIGHT / 2,
        }}>
        <Svg width={`${progressPercent}%`} height={PROGRESS_BAR_HEIGHT}>
          <Defs>
            <SvgLinearGradient id="quizProgressGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={PROGRESS_GRADIENT_START} />
              <Stop offset="1" stopColor={PROGRESS_GRADIENT_END} />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height={PROGRESS_BAR_HEIGHT}
            rx={PROGRESS_BAR_HEIGHT / 2}
            fill="url(#quizProgressGrad)"
          />
        </Svg>
      </View>

      <View className="mt-10 flex-1 items-center rounded-2xl bg-purple/10 px-8 py-8">
        <Text className="font-notoSansKRBold text-3xl text-purple">Q</Text>
        <Text className="mt-20 text-center font-notoSansKRRegular text-base leading-7 text-black">
          {question.question}
        </Text>
      </View>

      <View className="mb-10 mt-10 flex-row gap-4">
        <Pressable
          className="aspect-square flex-1 items-center justify-center rounded-2xl bg-purple/10"
          onPress={() => onAnswer(true)}>
          <QuizOIcon width={110} height={110} />
        </Pressable>
        <Pressable
          className="aspect-square flex-1 items-center justify-center rounded-2xl bg-danger/10"
          onPress={() => onAnswer(false)}>
          <QuizXIcon width={110} height={110} />
        </Pressable>
      </View>

      <Modal visible={isExitConfirmOpen} transparent animationType="none">
        <View className="flex-1 items-center justify-center bg-black/40 px-10">
          <View className="w-full rounded-2xl bg-white px-6 py-8">
            <Text className="text-center font-notoSansKRRegular text-base text-black">
              퀴즈를 나갈까요?
            </Text>
            <View className="mt-6 flex-row justify-center gap-16">
              <Pressable
                className="align-center items-center justify-center rounded-lg border border-gray px-4 py-3"
                onPress={onCancelExit}>
                <Text className="font-notoSansKRRegular text-sm text-black">취소</Text>
              </Pressable>
              <Pressable
                className="align-center items-center justify-center rounded-lg bg-gray px-4 py-3"
                onPress={onConfirmExit}>
                <Text className="font-notoSansKRRegular text-sm text-white">확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QuizQuestionScreen;
