import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { SvgProps } from 'react-native-svg';

import CanIcon from '@/assets/icons/can.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import PaperIcon from '@/assets/images/paper.svg';
import PlasticBagIcon from '@/assets/images/plasticBag.svg';
import PlasticBottleIcon from '@/assets/images/plasticBottle.svg';

type WasteTypeIcon = React.FC<SvgProps>;

const WASTE_TYPE_ICONS: Record<string, WasteTypeIcon> = {
  CAN: CanIcon,
  PAPER: PaperIcon,
  PET: PlasticBottleIcon,
  PLASTIC: PlasticBottleIcon,
  PLASTIC_BOTTLE: PlasticBottleIcon,
  PLASTIC_BAG: PlasticBagIcon,
  VINYL: PlasticBagIcon,
};

interface CanResultStepProps {
  wasteType?: string;
  wasteTypeLabel?: string;
  onNext: () => void;
}

const CanResultStep = ({
  wasteType,
  wasteTypeLabel,
  onNext,
}: CanResultStepProps): React.JSX.Element => {
  const WasteTypeIconComponent = WASTE_TYPE_ICONS[wasteType?.toUpperCase() ?? ''] ?? TrashIcon;

  return (
    <>
      <TouchableOpacity
        className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
        activeOpacity={0.8}
        onPress={onNext}>
        <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">다음</Text>
      </TouchableOpacity>
      <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
        <WasteTypeIconComponent height={300} width={300} />
        <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
          <Text className="text-trashAction">{wasteTypeLabel ?? '분류 결과'}</Text>입니다
        </Text>
      </View>
    </>
  );
};

export default CanResultStep;
