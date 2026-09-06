import React, { useEffect, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';

import LoadingIcon from '@/assets/icons/loading.svg';

interface LoadingStepProps {
  errorMessage: string | null;
  isRetrying: boolean;
  onRetry: () => void;
  onHome: () => void;
}

const LoadingStep = ({
  errorMessage,
  isRetrying,
  onRetry,
  onHome,
}: LoadingStepProps): React.JSX.Element => {
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
        <View className="mt-[32px] flex-row items-center">
          <TouchableOpacity
            className="h-[60px] w-[220px] items-center justify-center rounded-[12px] bg-purple"
            activeOpacity={isRetrying ? 1 : 0.85}
            disabled={isRetrying}
            onPress={onRetry}>
            <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
              {isRetrying ? '준비 중...' : '다시 시도'}
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
      ) : null}
    </View>
  );
};

export default LoadingStep;
