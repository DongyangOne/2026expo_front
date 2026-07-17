import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import IconGradient from '@/components/ui/icons/IconGradient';

const CHECK_GRADIENT_ID = 'signupCompleteCheckGradient';

interface Sparkle {
  size: number;
  color: string;
  opacity: number;
  style: { top?: number; bottom?: number; left?: number; right?: number };
}

const SPARKLES: Sparkle[] = [
  { size: 10, color: '#7B61FF', opacity: 0.5, style: { top: 6, left: 46 } },
  { size: 7, color: '#FF4FD8', opacity: 0.5, style: { top: 18, right: 32 } },
  { size: 13, color: '#7B61FF', opacity: 0.4, style: { top: 52, right: 2 } },
  { size: 7, color: '#FF4FD8', opacity: 0.5, style: { bottom: 66, left: 2 } },
  { size: 9, color: '#7B61FF', opacity: 0.4, style: { bottom: 8, left: 46 } },
  { size: 7, color: '#FF4FD8', opacity: 0.5, style: { bottom: 30, right: 18 } },
];

const SparkleIcon = ({ size, color, opacity, style }: Sparkle) => (
  <View className="absolute" style={style}>
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M12 0C12 6.075 6.075 12 0 12C6.075 12 12 17.925 12 24C12 17.925 17.925 12 24 12C17.925 12 12 6.075 12 0Z"
        fill={color}
        opacity={opacity}
      />
    </Svg>
  </View>
);

const CompleteCheckBadge = () => {
  return (
    <View className="items-center justify-center" style={{ height: 250, width: 250 }}>
      {SPARKLES.map((sparkle, index) => (
        <SparkleIcon key={index} {...sparkle} />
      ))}
      <View className="size-[160px] items-center justify-center rounded-full border border-border bg-white">
        <Svg height={64} viewBox="0 0 60 55" width={70}>
          <IconGradient id={CHECK_GRADIENT_ID} />
          <Path
            d="M3.5 26L20.5 43L53.5 3"
            fill="none"
            stroke={`url(#${CHECK_GRADIENT_ID})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={6}
          />
        </Svg>
      </View>
    </View>
  );
};

export default CompleteCheckBadge;
