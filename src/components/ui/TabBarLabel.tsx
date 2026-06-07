import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { FONTS, GRADIENT_ACTIVE } from '@/constants';

interface TabBarLabelProps {
  /** 탭 라벨 텍스트 */
  label: string;
  /** 선택된 탭 여부 */
  focused: boolean;
}

/** 캡션 라벨 폰트 크기 */
const FONT_SIZE = 11;

/** SVG 높이 */
const LABEL_HEIGHT = 18;

/** 비활성 라벨 색상 */
const INACTIVE_COLOR = '#9CA3AF';

const TabBarLabel = ({ label, focused }: TabBarLabelProps) => {
  const gradientId = `tabLabelGradient-${label}`;

  /**
   * 기존 CHAR_WIDTH 방식보다 안정적인 폭 계산
   * 한글/영문 섞여도 중앙 정렬 덜 흔들림
   */
  const width = FONT_SIZE * label.length + 14;

  return (
    <Svg width={width} height={LABEL_HEIGHT} style={{ marginTop: 2 }}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={GRADIENT_ACTIVE.from} />
          <Stop offset="1" stopColor={GRADIENT_ACTIVE.to} />
        </LinearGradient>
      </Defs>

      <SvgText
        x={width / 2}
        y={13}
        fontSize={FONT_SIZE}
        fontFamily={FONTS.demiLight}
        fill={focused ? `url(#${gradientId})` : INACTIVE_COLOR}
        textAnchor="middle">
        {label}
      </SvgText>
    </Svg>
  );
};

export default TabBarLabel;
