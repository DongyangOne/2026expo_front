import React, { useEffect, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';

import LoadingIcon from '@/assets/icons/loading.svg';

interface LoadingStepProps {
  errorMessage: string | null;
  onRetry: () => void;
}

const LoadingStep = ({ errorMessage, onRetry }: LoadingStepProps): React.JSX.Element => {
  const [loadingRotation] = useState<Animated.Value>(() => new Animated.Value(0));

  const loadingSpin = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect((): (() => void) => {
    const loadingAnimation = Animated.loop(
      Animated.timing(loadingRotation, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loadingAnimation.start();

    return (): void => {
      loadingAnimation.stop();
    };
  }, [loadingRotation]);

  return (
    <View
      className="absolute inset-0 items-center justify-center"
      pointerEvents={errorMessage ? 'auto' : 'none'}>
      <Animated.View style={{ transform: [{ rotate: loadingSpin }] }}>
        <LoadingIcon height={300} width={300} />
      </Animated.View>
      <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
        {errorMessage ?? (
          <>
            쓰레기를 <Text className="text-trashAction">인식</Text> 중입니다...
          </>
        )}
      </Text>
      {errorMessage ? (
        <TouchableOpacity
          className="mt-[32px] rounded-[12px] bg-purple px-[40px] py-[16px]"
          activeOpacity={0.85}
          onPress={onRetry}>
          <Text className="font-notoSansKRBold text-[15px] text-white">다시 시도</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default LoadingStep;
