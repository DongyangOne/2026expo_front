import React from 'react';
import { Pressable } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { FONTS } from '@/constants';

interface SignupGradientLinkProps {
  onPress: () => void;
}

const SignupGradientLink = ({ onPress }: SignupGradientLinkProps) => {
  return (
    <Pressable className="ml-[12px] h-[20px] justify-center" hitSlop={8} onPress={onPress}>
      <Svg height={20} width={64}>
        <Defs>
          <LinearGradient id="login-signup-text-gradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#7B61FF" />
            <Stop offset="1" stopColor="#FF4FD8" />
          </LinearGradient>
        </Defs>
        <SvgText
          fill="url(#login-signup-text-gradient)"
          fontFamily={FONTS.bold}
          fontSize={15}
          textAnchor="middle"
          x={32}
          y={15}>
          회원가입
        </SvgText>
      </Svg>
    </Pressable>
  );
};

export default SignupGradientLink;
