import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import TrashIcon from '@/assets/icons/trash.svg';
import WatchIcon from '@/assets/icons/watch.svg';

interface WaitingTrashStepProps {
  detectionErrorMessage: string | null;
  remainingSeconds: number;
  onHome: () => void;
  onNext: () => void;
  onRetry: () => void;
}

const WaitingTrashStep = ({
  detectionErrorMessage,
  remainingSeconds,
  onHome,
  onNext,
  onRetry,
}: WaitingTrashStepProps): React.JSX.Element => {
  return (
    <>
      <TouchableOpacity
        className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
        activeOpacity={0.8}
        onPress={onNext}>
        <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">다음</Text>
      </TouchableOpacity>
      {detectionErrorMessage ? (
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-center font-notoSansKRRegular text-[40px] leading-[52px] text-black">
            {detectionErrorMessage}
          </Text>
          <View className="mt-[32px] flex-row items-center">
            <TouchableOpacity
              className="h-[60px] w-[220px] items-center justify-center rounded-[12px] bg-purple"
              activeOpacity={0.85}
              onPress={onRetry}>
              <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
                다시 시도
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-[16px] h-[60px] w-[220px] items-center justify-center rounded-[12px] border border-border bg-white"
              activeOpacity={0.85}
              onPress={onHome}>
              <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-body">
                홈으로 이동
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View
            className="absolute inset-0 -translate-y-[30px] items-center justify-center"
            pointerEvents="none">
            <TrashIcon height={300} width={300} />
          </View>
          <View
            className="absolute inset-0 translate-y-[180px] items-center justify-center"
            pointerEvents="none">
            <Text className="font-notoSansKRRegular text-[44px] leading-[56px] text-black">
              쓰레기를 <Text className="text-trashAction">올려</Text> 주세요!
            </Text>
          </View>
          <View className="items-end">
            <View className="w-[96px] items-center">
              <WatchIcon height={96} width={96} />
              <Text className="mt-[20px] font-notoSansKRRegular text-[40px] leading-[40px] text-black">
                {remainingSeconds}
              </Text>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default WaitingTrashStep;
