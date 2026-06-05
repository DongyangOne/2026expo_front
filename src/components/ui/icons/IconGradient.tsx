import React from 'react';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

import { GRADIENT_ACTIVE } from '@/constants';

interface IconGradientProps {
  /** stroke="url(#id)"로 참조할 그라데이션 식별자 (SVG 내 고유) */
  id: string;
}

/**
 * 선택된 아이콘 stroke에 적용할 브랜드 그라데이션 정의
 * 좌상단 → 우하단 방향으로 GRADIENT_ACTIVE 색상을 보간합니다.
 */
const IconGradient = ({ id }: IconGradientProps) => {
  return (
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={GRADIENT_ACTIVE.from} />
        <Stop offset="1" stopColor={GRADIENT_ACTIVE.to} />
      </LinearGradient>
    </Defs>
  );
};

export default IconGradient;
