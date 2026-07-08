import React from 'react';
import { Image, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

interface PlaceholderCircleProps {
  size: number;
  source?: ImageSourcePropType;
}

/** 캐릭터/퀴즈/분리수거 로그에서 공통으로 쓰는 원형 이미지. source가 없으면 회색 플레이스홀더를 보여준다. */
const PlaceholderCircle = ({ size, source }: PlaceholderCircleProps) => {
  if (source) {
    return (
      <Image
        className="rounded-full border border-placeholderBorder bg-placeholder"
        resizeMode="cover"
        source={source}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <View
      className="rounded-full border border-placeholderBorder bg-placeholder"
      style={{ width: size, height: size }}
    />
  );
};

export default PlaceholderCircle;
