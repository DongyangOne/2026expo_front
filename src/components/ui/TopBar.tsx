import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackIcon from '@/assets/icons/backicon.svg';

export interface TopBarProps {
  title: string;
  onBack?: () => void;
  onPress?: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, onPress, className }) => {
  const insets = useSafeAreaInsets();
  const handleBack = onPress ?? onBack;

  return (
    <View className={`relative mt-10 h-14 justify-center bg-background px-6 ${className ?? ''}`}>
      {handleBack ? (
        <Pressable
          onPress={handleBack}
          className="z-10 ml-10 h-10 w-10 items-start justify-center"
          accessibilityRole="button"
          accessibilityLabel="뒤로가기">
          <BackIcon width={10} height={16} />
        </Pressable>
      ) : (
        <View className="ml-10 h-10 w-10" />
      )}

      <Text
        numberOfLines={1}
        className="absolute left-14 right-14 text-center font-notoSansKRBold text-xl text-black">
        {title}
      </Text>
    </View>
  );
};

TopBar.displayName = 'TopBar';
