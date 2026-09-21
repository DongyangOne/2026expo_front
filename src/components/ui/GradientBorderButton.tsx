import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Defs, LinearGradient, Stop, Rect, Text as SvgText } from 'react-native-svg';

interface GradientBorderButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  fontSize?: number;
}

const GradientBorderButton = ({
  label,
  onPress,
  disabled = false,
  height = 50,
  borderRadius = 25,
  borderWidth = 1.5,
  fontSize = 16,
}: GradientBorderButtonProps) => {
  const [width, setWidth] = useState(0);

  return (
    <TouchableOpacity
      className="items-center justify-center overflow-hidden bg-white"
      style={[{ height, borderRadius }, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="borderTextGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#7B61FF" stopOpacity={0.8} />
              <Stop offset="1" stopColor="#FF4FD8" stopOpacity={0.8} />
            </LinearGradient>
          </Defs>
          <Rect
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={width - borderWidth}
            height={height - borderWidth}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke="url(#borderTextGrad)"
            strokeWidth={borderWidth}
          />
          <SvgText
            x={width / 2}
            y={height / 2}
            fontSize={fontSize}
            fontFamily="NotoSansKR-Bold"
            fill="url(#borderTextGrad)"
            textAnchor="middle"
            alignmentBaseline="central">
            {label}
          </SvgText>
        </Svg>
      )}
    </TouchableOpacity>
  );
};

export default GradientBorderButton;
