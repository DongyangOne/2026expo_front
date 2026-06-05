/**
 * 탭 바 등에서 사용하는 라인 아이콘 공통 props
 * color는 활성/비활성 상태에 따라 탭 네비게이터가 주입합니다.
 */
export interface IconProps {
  /** 아이콘 선 색상 (비활성 상태 tint). active가 true면 그라데이션이 우선합니다. */
  color?: string;
  /** 정사각형 기준 한 변의 크기(px) */
  size?: number;
  /** 선택된 탭 여부. true면 브랜드 그라데이션으로 그립니다. */
  active?: boolean;
}

/** color를 지정하지 않았을 때 사용하는 기본 회색 */
export const DEFAULT_ICON_COLOR = '#6B7280';

/** size를 지정하지 않았을 때 사용하는 기본 크기 */
export const DEFAULT_ICON_SIZE = 24;
