import type { ImageSourcePropType } from 'react-native';

import recyclingCan from '@/assets/images/recycling-can.png';
import recyclingEtc from '@/assets/images/recycling-etc.png';
import recyclingGlass from '@/assets/images/recycling-glass.png';
import recyclingPaper from '@/assets/images/recycling-paper.png';
import recyclingPlastic from '@/assets/images/recycling-plastic.png';
import recyclingVinyl from '@/assets/images/recycling-vinyl.png';
import type { WasteType } from '@/types';

export const WASTE_TYPE_LABEL: Record<WasteType, string> = {
  PLASTIC: '플라스틱',
  CAN: '캔',
  PAPER: '종이',
  VINYL: '비닐',
  GLASS: '유리',
  BATTERY: '건전지',
  FLUORESCENT: '형광등',
  STYROFOAM: '스티로폼',
};

// 전용 이미지가 없는 재질은 recycling-etc.png로 폴백한다.
const WASTE_TYPE_IMAGE: Record<WasteType, ImageSourcePropType> = {
  PLASTIC: recyclingPlastic,
  CAN: recyclingCan,
  PAPER: recyclingPaper,
  VINYL: recyclingVinyl,
  GLASS: recyclingGlass,
  BATTERY: recyclingEtc,
  FLUORESCENT: recyclingEtc,
  STYROFOAM: recyclingEtc,
};

export const getWasteTypeImage = (wasteType: WasteType): ImageSourcePropType =>
  WASTE_TYPE_IMAGE[wasteType];
