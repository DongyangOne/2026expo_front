import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { FONTS, GRADIENT_ACTIVE } from '@/constants';

const GRADIENT_ID = 'signupCompleteTextGradient';

interface GradientTextProps {
  text: string;
  fontSize: number;
  width: number;
  height: number;
}

const GradientText = ({ text, fontSize, width, height }: GradientTextProps) => {
  return (
    <Svg height={height} width={width}>
      <Defs>
        <LinearGradient id={GRADIENT_ID} x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
          <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
        </LinearGradient>
      </Defs>
      <SvgText
        fill={`url(#${GRADIENT_ID})`}
        fontFamily={FONTS.bold}
        fontSize={fontSize}
        textAnchor="middle"
        x={width / 2}
        y={height * 0.8}>
        {text}
      </SvgText>
    </Svg>
  );
};

export default GradientText;
