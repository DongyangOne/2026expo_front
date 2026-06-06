import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import IconGradient from './IconGradient';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from './icon.types';
import type { IconProps } from './icon.types';

const GRADIENT_ID = 'searchIconGradient';

/** 검색 탭 아이콘 (돋보기 모양) */
const SearchIcon = ({
  color = DEFAULT_ICON_COLOR,
  size = DEFAULT_ICON_SIZE,
  active = false,
}: IconProps) => {
  const stroke = active ? `url(#${GRADIENT_ID})` : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {active && <IconGradient id={GRADIENT_ID} />}
      <Circle cx={11} cy={11} r={7} stroke={stroke} strokeWidth={1.8} />
      <Path
        d="M16.5 16.5L21 21"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
