import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';

interface TopBarProps {
  title: string;
  onBack?: () => void;
}

const TopBar = ({ title, onBack }: TopBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 12 }} className="bg-background">
      <View className="flex-row items-center px-10 pb-4">
        {onBack ? (
          <TouchableOpacity
            className="w-10 items-start justify-center"
            onPress={onBack}
            activeOpacity={0.7}>
            <Svg width={10} height={16} viewBox="0 0 10 16" fill="none">
              <Path
                d="M0.236172 8.49844L8.72219 15.8099C8.86378 15.9319 9.0519 16 9.24752 16C9.44314 16 9.63126 15.9319 9.77285 15.8099L9.78199 15.8016C9.85087 15.7424 9.90571 15.6712 9.94319 15.5923C9.98067 15.5133 10 15.4283 10 15.3424C10 15.2565 9.98067 15.1715 9.94319 15.0925C9.90571 15.0136 9.85087 14.9424 9.78199 14.8832L1.79085 7.99862L9.78199 1.11681C9.85087 1.05764 9.90571 0.986416 9.94319 0.907473C9.98067 0.82853 10 0.74352 10 0.657609C10 0.571699 9.98067 0.486687 9.94319 0.407744C9.90571 0.328802 9.85087 0.257579 9.78199 0.198408L9.77285 0.190146C9.63126 0.0680903 9.44314 8.25546e-07 9.24752 8.08444e-07C9.0519 7.91342e-07 8.86378 0.0680903 8.72219 0.190146L0.236172 7.50156C0.161541 7.56586 0.102127 7.64319 0.0615302 7.72887C0.0209339 7.81455 7.07531e-07 7.90679 6.99382e-07 8C6.91233e-07 8.09321 0.0209338 8.18545 0.0615302 8.27113C0.102127 8.35681 0.161541 8.43415 0.236172 8.49844Z"
                fill="#111827"
              />
            </Svg>
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
        <Text className="flex-1 text-center font-notoSansKRBold text-xl text-black">{title}</Text>
        <View className="w-10" />
      </View>
    </View>
  );
};

export default TopBar;
