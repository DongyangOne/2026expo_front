import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import type { ImageSourcePropType } from 'react-native';

import CanImage from '@/assets/icons/can.png';
import PaperImage from '@/assets/icons/paper.png';
import PlasticImage from '@/assets/icons/plastic.png';
import TrashIcon from '@/assets/icons/trash.svg';
import VinylImage from '@/assets/icons/vinyl.png';
import type { WasteType } from '@/types';
import { getWasteTypeLabel } from '@/utils';

const WASTE_TYPE_IMAGES: Record<WasteType, ImageSourcePropType | null> = {
  CAN: CanImage,
  PAPER: PaperImage,
  PLASTIC: PlasticImage,
  VINYL: VinylImage,
  GLASS: null,
  BATTERY: null,
  FLUORESCENT: null,
  STYROFOAM: null,
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
  const wasteTypeImage = wasteType ? WASTE_TYPE_IMAGES[wasteType] : null;
  const displayWasteTypeLabel = wasteTypeLabel ?? getWasteTypeLabel(wasteType, '분류 결과');

  return (
    <>
      <TouchableOpacity
        className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
        activeOpacity={0.8}
        onPress={onNext}>
        <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">다음</Text>
      </TouchableOpacity>
      <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
        {wasteTypeImage ? (
          <Image source={wasteTypeImage} className="h-[300px] w-[300px]" resizeMode="contain" />
        ) : !wasteType ? (
          <TrashIcon height={300} width={300} />
        ) : (
          <View className="h-[300px] w-[300px] items-center justify-center rounded-full border-4 border-purple bg-purple/[0.08]">
            <Text className="text-center font-notoSansKRBold text-[40px] leading-[52px] text-purple">
              {displayWasteTypeLabel}
            </Text>
          </View>
        )}
        <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
          <Text className="text-trashAction">{displayWasteTypeLabel}</Text>입니다
        </Text>
      </View>
    </>
  );
};

export default CanResultStep;
