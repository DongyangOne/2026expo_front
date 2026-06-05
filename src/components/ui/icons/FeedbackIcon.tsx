import React from 'react';
import Svg, { Path } from 'react-native-svg';

import IconGradient from './IconGradient';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from './icon.types';
import type { IconProps } from './icon.types';

const GRADIENT_ID = 'feedbackIconGradient';

/** 피드백 탭 아이콘 (말풍선 모양) */
const FeedbackIcon = ({
  color = DEFAULT_ICON_COLOR,
  size = DEFAULT_ICON_SIZE,
  active = false,
}: IconProps) => {
  const stroke = active ? `url(#${GRADIENT_ID})` : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {active && <IconGradient id={GRADIENT_ID} />}
      <Path
        d="M21 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FeedbackIcon;
