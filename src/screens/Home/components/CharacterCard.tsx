import React from 'react';
import { Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import PlaceholderCircle from './PlaceholderCircle';

interface CharacterCardProps {
  characterName: string;
  level: number;
  /** 다음 레벨까지 남은 경험치 (BE remainingExp) */
  remainingXp: number;
  /** 현재 레벨 진행률 0~1 (BE expPercentage / 100) */
  progressRatio: number;
  characterImage?: ImageSourcePropType;
}

const AVATAR_SIZE = 137;
const XP_BAR_HEIGHT = 17;

/** 캐릭터 박스: 캐릭터 이미지 + 레벨 + 경험치 바 + 다음 레벨까지 남은 경험치 (디자인상 캐릭터 이름은 화면에 표시하지 않음) */
const CharacterCard = ({
  characterName: _characterName,
  level,
  remainingXp,
  progressRatio,
  characterImage,
}: CharacterCardProps) => {
  const isMaxStage = remainingXp <= 0;

  return (
    <View className="items-center rounded-[10px] bg-purple/[0.08] px-[19px] py-[20px]">
      <PlaceholderCircle size={AVATAR_SIZE} source={characterImage} />

      <Text className="mt-[14px] font-notoSansKRBold text-lg text-black">Lv {level}</Text>

      <View
        className="mt-[20px] w-full overflow-hidden rounded-full border border-border bg-white"
        style={{ height: XP_BAR_HEIGHT }}>
        <View style={{ width: `${Math.round(progressRatio * 100)}%`, height: '100%' }}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="character-xp-gradient" x1="0" x2="1" y1="0" y2="0">
                <Stop offset="0" stopColor="#FF4FD8" stopOpacity={0.8} />
                <Stop offset="1" stopColor="#7B61FF" stopOpacity={0.8} />
              </LinearGradient>
            </Defs>
            <Rect fill="url(#character-xp-gradient)" height="100%" width="100%" />
          </Svg>
        </View>
      </View>

      <Text className="mt-[19px] font-notoSansKRRegular text-sm text-body">
        {isMaxStage ? '최고 레벨을 달성했어요' : `다음 레벨까지 ${remainingXp}xp`}
      </Text>
    </View>
  );
};

export default CharacterCard;
