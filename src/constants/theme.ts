/**
 * Tailwind 테마와 동기화된 상수값
 * 동적으로 색상을 참조해야 하는 경우 (예: StatusBar, 차트 라이브러리) 사용
 * 일반적인 스타일링은 NativeWind className을 사용합니다.
 */
export const COLORS = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  secondary: '#6B7280',
  danger: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
  purple: '#7B61FF',
  pink: '#FF4FD8',
  linear: {
    start: '#FF6363',
    end: '#FF7A59',
  },
  gray: {
    100: '#F3F4F6',
    200: '#E5E7EB',
    500: '#6B7280',
    700: '#374151',
    800: '#1F2937',
  },
} as const;

/**
 * 활성(선택) 상태에 사용하는 브랜드 그라데이션 색상
 * 탭 바의 선택된 아이콘·라벨에 좌상단 → 우하단 방향으로 적용합니다.
 */
export const GRADIENT_ACTIVE = {
  from: '#FF4FD8',
  to: '#7B61FF',
} as const;

/**
 * NotoSansKR 폰트 패밀리
 * NativeWind에서는 font-notoSansKRDemiLight, font-notoSansKRRegular, font-notoSansKRBold로 사용
 * 동적으로 폰트를 지정해야 하는 경우에만 이 상수를 사용합니다.
 */
export const FONTS = {
  demiLight: 'NotoSansKR-DemiLight',
  regular: 'NotoSansKR-Regular',
  bold: 'NotoSansKR-Bold',
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
} as const;
