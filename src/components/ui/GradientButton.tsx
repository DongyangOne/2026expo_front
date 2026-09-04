import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderBottomLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  fontSize?: number;
  fontWeight?: 'regular' | 'bold';
  opacity?: number;
}

const GradientButton = ({
  label,
  onPress,
  disabled = false,
  height = 50,
  borderRadius = 25,
  borderTopLeftRadius,
  borderBottomLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  fontSize = 16,
  fontWeight = 'bold',
  opacity = 1,
}: GradientButtonProps) => {
  const [width, setWidth] = useState(0);

  return (
    <TouchableOpacity
      className="shrink-0 items-center justify-center overflow-hidden px-4"
      style={[
        {
          height,
          borderRadius,
          borderTopLeftRadius: borderTopLeftRadius ?? borderRadius,
          borderBottomLeftRadius: borderBottomLeftRadius ?? borderRadius,
          borderTopRightRadius: borderTopRightRadius ?? borderRadius,
          borderBottomRightRadius: borderBottomRightRadius ?? borderRadius,
          opacity,
        },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#7B61FF" />
              <Stop offset="1" stopColor="#FF4FD8" />
            </SvgLinearGradient>
          </Defs>
          <Rect width={width} height={height} fill="url(#btnGrad)" />
        </Svg>
      )}
      <Text
        className={`text-base text-white ${
          fontWeight === 'bold' ? 'font-notoSansKRBold' : 'font-notoSansKRRegular'
        }`}
        style={{ fontSize }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default GradientButton;
