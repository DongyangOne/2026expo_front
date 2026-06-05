import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import IconGradient from './IconGradient';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from './icon.types';
import type { IconProps } from './icon.types';

const GRADIENT_ID = 'accountIconGradient';

/** 마이(계정) 탭 아이콘 (사람 상반신 모양) */
const AccountIcon = ({
  color = DEFAULT_ICON_COLOR,
  size = DEFAULT_ICON_SIZE,
  active = false,
}: IconProps) => {
  const stroke = active ? `url(#${GRADIENT_ID})` : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {active && <IconGradient id={GRADIENT_ID} />}
      <Circle cx={12} cy={8} r={4} stroke={stroke} strokeWidth={1.8} />
      <Path
        d="M5 20a7 7 0 0 1 14 0"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AccountIcon;
