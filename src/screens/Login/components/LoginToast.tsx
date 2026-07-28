import React from 'react';
import { Text, View } from 'react-native';

interface LoginToastProps {
  message: string;
  visible: boolean;
}

const LoginToast = ({ message, visible }: LoginToastProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View className="absolute bottom-[112px] left-0 right-0 items-center">
      <View className="rounded-[6px] bg-[#E5E7EB] px-[13px] py-[12px]">
        <Text className="font-notoSansKRDemiLight text-xs text-black">{message}</Text>
      </View>
    </View>
  );
};

export default LoginToast;
