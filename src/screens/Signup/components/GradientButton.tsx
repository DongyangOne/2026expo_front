import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface GradientButtonProps {
  label: string;
  gradientId: string;
  radius: number;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

const GradientButton = ({
  label,
  gradientId,
  radius,
  onPress,
  className = '',
  textClassName = 'font-notoSansKRRegular text-sm text-white',
  disabled = false,
}: GradientButtonProps) => {
  return (
    <Pressable
      className={`items-center justify-center overflow-hidden ${className}`}
      disabled={disabled}
      onPress={onPress}>
      <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#7B61FF" stopOpacity={0.8} />
            <Stop offset="1" stopColor="#FF4FD8" stopOpacity={0.8} />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#${gradientId})`} height="100%" rx={radius} width="100%" />
      </Svg>
      <Text className={textClassName} style={{ includeFontPadding: false }}>
        {label}
      </Text>
    </Pressable>
  );
};

export default GradientButton;
