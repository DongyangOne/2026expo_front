import type { WasteType } from '@/types';

const WASTE_TYPE_LABELS: Record<WasteType, string> = {
  PLASTIC: '플라스틱',
  CAN: '캔',
  PAPER: '종이',
  VINYL: '비닐',
  GLASS: '유리병',
  BATTERY: '건전지',
  FLUORESCENT: '형광등',
  STYROFOAM: '스티로폼',
};

const WASTE_TYPE_FALLBACK_LABEL = '분리배출 품목';
const ENGLISH_CODE_PATTERN = /^[A-Z_]+$/;

const isWasteType = (wasteType: string): wasteType is WasteType =>
  Object.prototype.hasOwnProperty.call(WASTE_TYPE_LABELS, wasteType);

export const getWasteTypeLabel = (
  wasteType: string | null | undefined,
  fallbackLabel: string = WASTE_TYPE_FALLBACK_LABEL,
): string => {
  if (!wasteType) {
    return fallbackLabel;
  }

  if (isWasteType(wasteType)) {
    return WASTE_TYPE_LABELS[wasteType];
  }

  return ENGLISH_CODE_PATTERN.test(wasteType) ? fallbackLabel : wasteType;
};
