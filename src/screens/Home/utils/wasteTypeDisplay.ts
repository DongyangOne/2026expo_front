import type { ImageSourcePropType } from 'react-native';

import recyclingCan from '@/assets/images/recycling-can.png';
import recyclingEtc from '@/assets/images/recycling-etc.png';
import recyclingPaper from '@/assets/images/recycling-paper.png';
import recyclingPlastic from '@/assets/images/recycling-plastic.png';
import type { WasteType } from '@/types';

export const WASTE_TYPE_LABEL: Record<WasteType, string> = {
  CAN: '캔',
  PET: '페트병',
  PAPER: '종이',
  TRASH: '일반쓰레기',
};

// 전용 이미지가 없는 재질은 recycling-etc.png로 폴백한다.
const WASTE_TYPE_IMAGE: Record<WasteType, ImageSourcePropType> = {
  CAN: recyclingCan,
  PET: recyclingPlastic,
  PAPER: recyclingPaper,
  TRASH: recyclingEtc,
};

export const getWasteTypeImage = (wasteType: WasteType): ImageSourcePropType =>
  WASTE_TYPE_IMAGE[wasteType];
