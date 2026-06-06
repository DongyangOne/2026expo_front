import React from 'react';
import Svg, { Path } from 'react-native-svg';

import IconGradient from './IconGradient';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from './icon.types';
import type { IconProps } from './icon.types';

const GRADIENT_ID = 'quizIconGradient';

/** 퀴즈 탭 아이콘 (육각형 배지 안의 별 모양) */
const QuizIcon = ({
  color = DEFAULT_ICON_COLOR,
  size = DEFAULT_ICON_SIZE,
  active = false,
}: IconProps) => {
  const stroke = active ? `url(#${GRADIENT_ID})` : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {active && <IconGradient id={GRADIENT_ID} />}
      <Path
        d="M12 2l8 5v10l-8 5-8-5V7z"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7.3l1 2.83 2.99.07-2.37 1.83.85 2.87L12 13.2l-2.47 1.7.85-2.87-2.37-1.83 2.99-.07z"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default QuizIcon;
