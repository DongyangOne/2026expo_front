import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Defs, LinearGradient as SvgLinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { GradientButton } from '@/components/ui';
import QuitIcon from '@/assets/icons/quit.svg';
import type { QuizResultData } from '@/types';
import congratsImage from '@/assets/images/congrats.png';
import charEggImage from '@/assets/images/char-egg.png';
import { COLORS } from '@/constants/theme';

const LEVEL_BAR_HEIGHT = 20;
const LEVEL_GRADIENT_START = COLORS.purple;
const LEVEL_GRADIENT_END = COLORS.pink;

interface QuizFinalResultScreenProps {
  result: QuizResultData;
  onRetry: () => void;
  onClose: () => void;
}

const QuizFinalResultScreen = ({
  result,
  onRetry,
  onClose,
}: QuizFinalResultScreenProps): React.JSX.Element => {
  const {
    correctCount,
    totalCount,
    currentLevel,
    expPercent,
    earnedExp,
    levelUp,
    resultMessage,
    characterImageUrl,
  } = result;
  const progressRatio = Math.min(Math.max(expPercent, 0), 100) / 100;

  return (
    <View className="flex-1 bg-background px-10 pt-[20px]">
      <Pressable className="absolute left-8 top-[68px] z-10" onPress={onClose}>
        <QuitIcon width={20} height={19} />
      </Pressable>

      <View className="items-center">
        <Image source={congratsImage} style={{ width: 160, height: 160 }} />

        <Text className="font-notoSansKRBold text-2xl text-black">
          {levelUp ? '레벨 업!' : '훌륭해요!'}
        </Text>

        <Text className="mt-6 text-center font-notoSansKRRegular text-base leading-7 text-gray">
          {correctCount}/{totalCount}개 맞췄어요!{'\n'}
          {resultMessage}
        </Text>

        <Text className="mt-3 font-notoSansKRBold text-sm text-purple">+{earnedExp} EXP</Text>

        <View className="mt-8 aspect-square w-1/2 items-center justify-center">
          <Image
            source={characterImageUrl ? { uri: characterImageUrl } : charEggImage}
            className="h-full w-full"
            resizeMode="contain"
          />
        </View>

        <Text className="mt-8 font-notoSansKRBold text-base text-black">Lv.{currentLevel}</Text>
        <View
          className="mt-3 w-2/3 border border-border"
          style={{
            height: LEVEL_BAR_HEIGHT,
            backgroundColor: '#FFFFFF',
            borderRadius: LEVEL_BAR_HEIGHT / 2,
          }}>
          <Svg width={`${progressRatio * 100}%`} height={LEVEL_BAR_HEIGHT}>
            <Defs>
              <SvgLinearGradient id="levelProgressGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={LEVEL_GRADIENT_START} />
                <Stop offset="1" stopColor={LEVEL_GRADIENT_END} />
              </SvgLinearGradient>
            </Defs>
            <Rect
              x={0}
              y={0}
              width="100%"
              height={LEVEL_BAR_HEIGHT}
              rx={LEVEL_BAR_HEIGHT / 2}
              fill="url(#levelProgressGrad)"
            />
          </Svg>
        </View>
      </View>

      <View className="mb-10 mt-10 px-2">
        <GradientButton label="다시하기" onPress={onRetry} height={50} borderRadius={28} />
      </View>
    </View>
  );
};

export default QuizFinalResultScreen;
