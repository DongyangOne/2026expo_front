import React from 'react';
import Svg, { Path } from 'react-native-svg';

import IconGradient from './IconGradient';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from './icon.types';
import type { IconProps } from './icon.types';

const GRADIENT_ID = 'homeIconGradient';

/** 홈 탭 아이콘 (지붕 + 문이 있는 집 모양) */
const HomeIcon = ({
  color = DEFAULT_ICON_COLOR,
  size = DEFAULT_ICON_SIZE,
  active = false,
}: IconProps) => {
  const stroke = active ? `url(#${GRADIENT_ID})` : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {active && <IconGradient id={GRADIENT_ID} />}
      <Path
        d="M3 9.5L12 3l9 6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 21v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HomeIcon;
