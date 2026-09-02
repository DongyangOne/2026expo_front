import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { SvgProps } from 'react-native-svg';

import CanIcon from '@/assets/icons/can.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import PaperIcon from '@/assets/images/paper.svg';
import PlasticBagIcon from '@/assets/images/plasticBag.svg';
import PlasticBottleIcon from '@/assets/images/plasticBottle.svg';
import type { WasteType } from '@/types';

type WasteTypeIcon = React.FC<SvgProps>;

const WASTE_TYPE_ICONS: Record<WasteType, WasteTypeIcon | null> = {
  CAN: CanIcon,
  PAPER: PaperIcon,
  PLASTIC: PlasticBottleIcon,
  VINYL: PlasticBagIcon,
  GLASS: null,
  BATTERY: null,
  FLUORESCENT: null,
  STYROFOAM: null,
};

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

interface CanResultStepProps {
  wasteType?: WasteType;
  wasteTypeLabel?: string;
  onNext: () => void;
}

const CanResultStep = ({
  wasteType,
  wasteTypeLabel,
  onNext,
}: CanResultStepProps): React.JSX.Element => {
  const WasteTypeIconComponent = wasteType ? WASTE_TYPE_ICONS[wasteType] : TrashIcon;
  const displayWasteTypeLabel =
    wasteTypeLabel ?? (wasteType ? WASTE_TYPE_LABELS[wasteType] : '분류 결과');

  return (
    <>
      <TouchableOpacity
        className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
        activeOpacity={0.8}
        onPress={onNext}>
        <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">다음</Text>
      </TouchableOpacity>
      <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
        {WasteTypeIconComponent ? <WasteTypeIconComponent height={300} width={300} /> : null}
        {!WasteTypeIconComponent ? (
          <View className="h-[300px] w-[300px] items-center justify-center rounded-full border-4 border-purple bg-purple/[0.08]">
            <Text className="text-center font-notoSansKRBold text-[40px] leading-[52px] text-purple">
              {displayWasteTypeLabel}
            </Text>
          </View>
        ) : null}
        <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
          <Text className="text-trashAction">{displayWasteTypeLabel}</Text>입니다
        </Text>
      </View>
    </>
  );
};

export default CanResultStep;
