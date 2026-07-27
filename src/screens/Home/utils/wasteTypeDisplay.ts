import type { ImageSourcePropType } from 'react-native';

import recyclingGlass from '@/assets/images/recycling-glass.png';
import recyclingPaper from '@/assets/images/recycling-paper.png';
import recyclingPlastic from '@/assets/images/recycling-plastic.png';
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

// 에셋이 없는 wasteType은 매핑에서 비워 두어 PlaceholderCircle이 회색 폴백을 그리게 한다.
const WASTE_TYPE_IMAGE: Partial<Record<WasteType, ImageSourcePropType>> = {
  PLASTIC: recyclingPlastic,
  PAPER: recyclingPaper,
  GLASS: recyclingGlass,
};

export const getWasteTypeImage = (wasteType: WasteType): ImageSourcePropType | undefined =>
  WASTE_TYPE_IMAGE[wasteType];
