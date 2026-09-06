import type { ImageSourcePropType } from 'react-native';

import recyclingCan from '@/assets/images/recycling-can.png';
import recyclingEtc from '@/assets/images/recycling-etc.png';
import recyclingGlass from '@/assets/images/recycling-glass.png';
import recyclingPaper from '@/assets/images/recycling-paper.png';
import recyclingPlastic from '@/assets/images/recycling-plastic.png';
import recyclingVinyl from '@/assets/images/recycling-vinyl.png';
import { getWasteTypeLabel } from '@/utils';

/**
 * 대시보드 응답에만 있는 재질 코드. 그 외 코드(PLASTIC/VINYL/GLASS/BATTERY 등)는
 * 공용 getWasteTypeLabel이 처리하고, 거기서도 모르는 코드는 "분리배출 품목"으로 폴백한다.
 */
const DASHBOARD_WASTE_TYPE_LABEL: Record<string, string> = {
  PET: '페트병',
  TRASH: '일반쓰레기',
};

// 전용 이미지가 없는 재질은 recycling-etc.png로 폴백한다.
const WASTE_TYPE_IMAGE: Record<string, ImageSourcePropType> = {
  CAN: recyclingCan,
  PET: recyclingPlastic,
  PLASTIC: recyclingPlastic,
  PAPER: recyclingPaper,
  VINYL: recyclingVinyl,
  GLASS: recyclingGlass,
  TRASH: recyclingEtc,
};

/** 서버가 타입에 없는 재질 코드를 내려줘도 종류가 빈 칸으로 보이지 않도록 폴백한다. */
export const getWasteTypeDisplayLabel = (wasteType: string): string =>
  DASHBOARD_WASTE_TYPE_LABEL[wasteType] ?? getWasteTypeLabel(wasteType);

export const getWasteTypeImage = (wasteType: string): ImageSourcePropType =>
  WASTE_TYPE_IMAGE[wasteType] ?? recyclingEtc;
