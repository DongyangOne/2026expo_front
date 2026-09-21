import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import CharacterIcon from '@/assets/icons/character.svg';
import { GRADIENT_ACTIVE } from '@/constants';
import type { TabletClassificationData } from '@/types';

interface SuccessStepProps {
  classificationResult: TabletClassificationData | null;
  onHome: () => void;
}

const SuccessStep = ({ classificationResult, onHome }: SuccessStepProps): React.JSX.Element => {
  const currentLevel = classificationResult?.currentLevel ?? classificationResult?.level ?? 0;
  const expProgressPercentage = classificationResult?.expPercent ?? 0;

  return (
    <View className="absolute inset-0 items-center justify-center">
      {classificationResult?.characterImageUrl ? (
        <Image
          className="h-[260px] w-[260px]"
          resizeMode="contain"
          source={{ uri: classificationResult.characterImageUrl }}
        />
      ) : (
        <CharacterIcon height={260} width={260} />
      )}
      <Text className="mt-[8px] font-notoSansKRRegular text-[24px] leading-[30px] text-black">
        LV.{currentLevel}
      </Text>
      <View className="mt-[10px] h-[14px] w-[160px] overflow-hidden rounded-full border border-border bg-background">
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient
              id="tablet-trash-feedback-progress-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0">
              <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
              <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
            </LinearGradient>
          </Defs>
          <Rect
            fill="url(#tablet-trash-feedback-progress-gradient)"
            height="100%"
            rx={7}
            ry={7}
            width={`${expProgressPercentage}%`}
          />
        </Svg>
      </View>
      <Text className="mt-[36px] font-notoSansKRRegular text-[40px] leading-[50px] text-black">
        {classificationResult?.message ?? '분리배출 성공!'}
      </Text>
      <TouchableOpacity
        className="mt-[54px] h-[60px] w-[288px] overflow-hidden rounded-[12px]"
        activeOpacity={0.85}
        onPress={onHome}>
        <View className="absolute inset-0">
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="tablet-trash-feedback-home-gradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
                <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
              </LinearGradient>
            </Defs>
            <Rect
              fill="url(#tablet-trash-feedback-home-gradient)"
              height="100%"
              rx={12}
              ry={12}
              width="100%"
            />
          </Svg>
        </View>
        <View className="h-full items-center justify-center">
          <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
            홈으로 이동
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessStep;
