import React from 'react';
import { Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useCharacterLevel } from '../hooks/useCharacterLevel';
import PlaceholderCircle from './PlaceholderCircle';

interface CharacterCardProps {
  level: number;
  currentXp: number;
  characterImage?: ImageSourcePropType;
}

const AVATAR_SIZE = 137;
const XP_BAR_HEIGHT = 17;

/** 캐릭터 박스: 캐릭터 이미지 + 레벨 + 경험치 바 + 다음 레벨까지 남은 경험치 */
const CharacterCard = ({ level, currentXp, characterImage }: CharacterCardProps) => {
  const { remainingXp, progressRatio, isMaxStage } = useCharacterLevel(level, currentXp);

  return (
    <View className="items-center rounded-[10px] bg-purple/[0.08] px-[19px] py-[20px]">
      <PlaceholderCircle size={AVATAR_SIZE} source={characterImage} />

      <Text className="mt-[22px] font-notoSansKRBold text-lg text-black">Lv {level}</Text>

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
