import React, { useState } from 'react';
import { Image, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

interface PlaceholderCircleProps {
  size: number;
  source?: ImageSourcePropType;
}

const getSourceKey = (source?: ImageSourcePropType) =>
  source && typeof source === 'object' && 'uri' in source ? source.uri : source;

/** 캐릭터/퀴즈/분리수거 로그에서 공통으로 쓰는 원형 이미지. source가 없거나 로딩에 실패하면 회색 플레이스홀더를 보여준다. */
const PlaceholderCircle = ({ size, source }: PlaceholderCircleProps) => {
  const sourceKey = getSourceKey(source);
  const [trackedSourceKey, setTrackedSourceKey] = useState(sourceKey);
  const [hasError, setHasError] = useState(false);

  if (sourceKey !== trackedSourceKey) {
    setTrackedSourceKey(sourceKey);
    setHasError(false);
  }

  if (source && !hasError) {
    return (
      <Image
        className="rounded-full bg-placeholder"
        onError={() => setHasError(true)}
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
