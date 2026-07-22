import React from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { Defs, LinearGradient as SvgLinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { GradientButton } from '@/components/ui';
import QuitIcon from '@/assets/icons/quit.svg';
import quizOImage from '@/assets/images/quizO.png';
import quizXImage from '@/assets/images/quizX.png';

const PROGRESS_BAR_HEIGHT = 20;
const PROGRESS_GRADIENT_START = '#7B61FF';
const PROGRESS_GRADIENT_END = '#FF4FD8';

interface QuizResultScreenProps {
  currentIndex: number;
  total: number;
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
  onClose: () => void;
  isExitConfirmOpen: boolean;
  onCancelExit: () => void;
  onConfirmExit: () => void;
}

const QuizResultScreen = ({
  currentIndex,
  total,
  isCorrect,
  explanation,
  onNext,
  onClose,
  isExitConfirmOpen,
  onCancelExit,
  onConfirmExit,
}: QuizResultScreenProps) => {
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

      <View
        className={`mt-10 flex-1 items-center justify-center rounded-2xl px-8 ${
          isCorrect ? 'bg-success/10' : 'bg-danger/10'
        }`}>
        <View className="-mt-10 h-28 w-28 items-center justify-center">
          {isCorrect ? (
            <Image source={quizOImage} style={{ width: 78, height: 78 }} resizeMode="contain" />
          ) : (
            <Image source={quizXImage} style={{ width: 78, height: 78 }} resizeMode="contain" />
          )}
        </View>
        <Text className="mt-10 font-notoSansKRBold text-xl text-black">
          {isCorrect ? '정답이에요!' : '틀렸어요!'}
        </Text>
        <Text className="mt-7 text-center font-notoSansKRRegular text-sm text-gray">
          {explanation}
        </Text>
      </View>

      <View className="mb-10 mt-10 px-10">
        <GradientButton label="다음으로" onPress={onNext} height={50} borderRadius={28} />
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

export default QuizResultScreen;
