import React from 'react';
import { Pressable, View } from 'react-native';

import SocialGoogle from '@/assets/images/login/socialGoogle.svg';
import SocialKakao from '@/assets/images/login/socialKakao.svg';
import SocialNaver from '@/assets/images/login/socialNaver.svg';

type SocialProvider = 'google' | 'naver' | 'kakao';

interface SocialLoginRowProps {
  onPressSocial: (provider: SocialProvider) => void;
}

const SocialLoginRow = ({ onPressSocial }: SocialLoginRowProps) => {
  return (
    <View className="flex-row items-center justify-center gap-[48px]">
      <Pressable
        className="size-[50px] overflow-hidden rounded-full"
        hitSlop={8}
        onPress={() => onPressSocial('google')}>
        <SocialGoogle height="100%" pointerEvents="none" width="100%" />
      </Pressable>
      <Pressable
        className="size-[50px] overflow-hidden rounded-full"
        hitSlop={8}
        onPress={() => onPressSocial('naver')}>
        <SocialNaver height="100%" pointerEvents="none" width="100%" />
      </Pressable>
      <Pressable
        className="size-[50px] overflow-hidden rounded-full"
        hitSlop={8}
        onPress={() => onPressSocial('kakao')}>
        <SocialKakao height="100%" pointerEvents="none" width="100%" />
      </Pressable>
    </View>
  );
};

export default SocialLoginRow;
