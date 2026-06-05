import React from 'react';
import { Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { FONTS, GRADIENT_ACTIVE } from '@/constants';

interface TabBarLabelProps {
  /** 탭 라벨 텍스트 */
  label: string;
  /** 선택된 탭 여부. true면 브랜드 그라데이션 텍스트로 렌더링합니다. */
  focused: boolean;
}

/** 캡션 라벨 폰트 크기 (README 캡션 규격) */
const FONT_SIZE = 11;
/** 그라데이션 SVG 높이 (디센더 잘림 방지 여유 포함) */
const LABEL_HEIGHT = 16;
/** 한글 한 글자의 대략적인 너비 — SVG 캔버스 폭 계산용 */
const CHAR_WIDTH = 12;
/** 비활성 라벨 색상 */
const INACTIVE_COLOR = '#9CA3AF';

/**
 * 탭 바 라벨
 * 선택 시 RN Text는 그라데이션을 지원하지 않으므로 react-native-svg의 Text로 그립니다.
 */
const TabBarLabel = ({ label, focused }: TabBarLabelProps) => {
  if (!focused) {
    return (
      <Text
        className="mt-0.5 font-notoSansKRDemiLight"
        style={{ fontSize: FONT_SIZE, color: INACTIVE_COLOR }}>
        {label}
      </Text>
    );
  }

  const gradientId = `tabLabelGradient-${label}`;
  const width = label.length * CHAR_WIDTH + 4;

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
        y={12}
        fontSize={FONT_SIZE}
        fontFamily={FONTS.demiLight}
        fill={`url(#${gradientId})`}
        textAnchor="middle">
        {label}
      </SvgText>
    </Svg>
  );
};

export default TabBarLabel;
