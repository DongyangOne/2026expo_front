import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import TrashIcon from '@/assets/icons/trash.svg';

interface GeneralWasteStepProps {
  onHome: () => void;
}

const GeneralWasteStep = ({ onHome }: GeneralWasteStepProps): React.JSX.Element => {
  return (
    <View className="absolute inset-0 items-center justify-center">
      <TrashIcon height={280} width={280} />
      <Text className="mt-[40px] text-center font-notoSansKRRegular text-[36px] leading-[52px] text-black">
        일반쓰레기입니다.{`\n`}일반쓰레기함에 버려주세요.
      </Text>
      <TouchableOpacity
        className="mt-[48px] h-[60px] w-[288px] items-center justify-center rounded-[12px] bg-purple"
        activeOpacity={0.85}
        onPress={onHome}>
        <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
          홈으로 이동
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GeneralWasteStep;
