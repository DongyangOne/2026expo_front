import React from 'react';
import { Text, View } from 'react-native';

interface SignupToastProps {
  message: string;
  visible: boolean;
}

const SignupToast = ({ message, visible }: SignupToastProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View className="absolute bottom-[40px] left-0 right-0 items-center" pointerEvents="none">
      <View className="rounded-[6px] bg-disabledBg px-[13px] py-[12px]">
        <Text
          className="font-notoSansKRDemiLight text-[12px] text-black"
          style={{ includeFontPadding: false }}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default SignupToast;
