import React, { useEffect, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Video, { ResizeMode } from 'react-native-video';

import CanIcon from '@/assets/icons/can.svg';
import CharacterIcon from '@/assets/icons/character.svg';
import LoadingIcon from '@/assets/icons/loading.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import WatchIcon from '@/assets/icons/watch.svg';
import XIcon from '@/assets/icons/x.svg';
import retryGuideVideo from '@/assets/videos/retryGuide.mp4';
import { GRADIENT_ACTIVE } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

const COUNTDOWN_START_SECONDS = 20;

const FEEDBACK_CARD_SHADOW_STYLE: ViewStyle = {
  elevation: 4,
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
};

type Props = NativeStackScreenProps<RootStackParamList, 'TabletTrashFeedback'>;

type TrashFeedbackStep =
  | 'waitingTrash'
  | 'loading'
  | 'canResult'
  | 'success'
  | 'failed'
  | 'retryGuide';

const TabletTrashFeedbackScreen = ({ navigation }: Props): React.JSX.Element => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(COUNTDOWN_START_SECONDS);
  const [currentStep, setCurrentStep] = useState<TrashFeedbackStep>('waitingTrash');
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [loadingRotation] = useState<Animated.Value>(() => new Animated.Value(0));

  const loadingSpin = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleNextPress = (): void => {
    setCurrentStep((previousStep) => {
      if (previousStep === 'waitingTrash') {
        return 'loading';
      }

      if (previousStep === 'loading') {
        return 'canResult';
      }

      if (previousStep === 'canResult') {
        return 'success';
      }

      return 'failed';
    });
  };

  const handleHomePress = (): void => {
    navigation.replace('TabletMain');
  };

  const handleRetryGuidePress = (): void => {
    setHasVideoError(false);
    setCurrentStep('retryGuide');
  };

  const handleRestartPress = (): void => {
    setRemainingSeconds(COUNTDOWN_START_SECONDS);
    setHasVideoError(false);
    setCurrentStep('waitingTrash');
  };

  const handleVideoError = (): void => {
    setHasVideoError(true);
  };

  useEffect((): (() => void) | undefined => {
    if (remainingSeconds <= 0) {
      return undefined;
    }

    const timerId = setTimeout((): void => {
      setRemainingSeconds((currentRemainingSeconds) => currentRemainingSeconds - 1);
    }, 1000);

    return (): void => {
      clearTimeout(timerId);
    };
  }, [remainingSeconds]);

  useEffect((): (() => void) | undefined => {
    if (currentStep !== 'loading') {
      loadingRotation.setValue(0);
      return undefined;
    }

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
  }, [currentStep, loadingRotation]);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View
          className="mx-[50px] my-[40px] flex-1 rounded-[15px] bg-white"
          style={FEEDBACK_CARD_SHADOW_STYLE}>
          <View className="flex-1 overflow-hidden rounded-[15px]">
            <View className="absolute inset-0">
              <Svg height="100%" width="100%">
                <Defs>
                  <LinearGradient
                    id="tablet-trash-feedback-border-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1">
                    <Stop offset="0" stopColor="#7B61FF" />
                    <Stop offset="1" stopColor="#FF4FD8" />
                  </LinearGradient>
                </Defs>
                <Rect
                  fill="url(#tablet-trash-feedback-border-gradient)"
                  height="100%"
                  rx={15}
                  ry={15}
                  width="100%"
                />
              </Svg>
            </View>
            <View className="absolute inset-[1px] rounded-[14px] bg-white px-[60px] py-[40px]">
              {currentStep === 'waitingTrash' ? (
                <>
                  <TouchableOpacity
                    className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
                    activeOpacity={0.8}
                    onPress={handleNextPress}>
                    <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">
                      다음
                    </Text>
                  </TouchableOpacity>
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
                </>
              ) : null}
              {currentStep === 'loading' ? (
                <>
                  <TouchableOpacity
                    className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
                    activeOpacity={0.8}
                    onPress={handleNextPress}>
                    <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">
                      다음
                    </Text>
                  </TouchableOpacity>
                  <View
                    className="absolute inset-0 items-center justify-center"
                    pointerEvents="none">
                    <Animated.View style={{ transform: [{ rotate: loadingSpin }] }}>
                      <LoadingIcon height={300} width={300} />
                    </Animated.View>
                    <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
                      쓰레기를 <Text className="text-trashAction">인식</Text> 중입니다...
                    </Text>
                  </View>
                </>
              ) : null}
              {currentStep === 'canResult' ? (
                <>
                  <TouchableOpacity
                    className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
                    activeOpacity={0.8}
                    onPress={handleNextPress}>
                    <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">
                      다음
                    </Text>
                  </TouchableOpacity>
                  <View
                    className="absolute inset-0 items-center justify-center"
                    pointerEvents="none">
                    <CanIcon height={300} width={300} />
                    <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
                      <Text className="text-trashAction">캔</Text>이네요
                    </Text>
                  </View>
                </>
              ) : null}
              {currentStep === 'success' ? (
                <>
                  <TouchableOpacity
                    className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
                    activeOpacity={0.8}
                    onPress={handleNextPress}>
                    <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">
                      다음
                    </Text>
                  </TouchableOpacity>
                  <View className="absolute inset-0 items-center justify-center">
                    <CharacterIcon height={260} width={260} />
                    <Text className="mt-[8px] font-notoSansKRRegular text-[24px] leading-[30px] text-black">
                      LV.5
                    </Text>
                    <View className="mt-[10px] h-[14px] w-[160px] overflow-hidden rounded-full border border-border bg-background">
                      <View className="h-full w-[58px] overflow-hidden rounded-full">
                        <Svg height="100%" width="100%">
                          <Defs>
                            <LinearGradient
                              id="tablet-trash-feedback-progress-gradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0">
                              <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
                              <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
                            </LinearGradient>
                          </Defs>
                          <Rect
                            fill="url(#tablet-trash-feedback-progress-gradient)"
                            height="100%"
                            rx={7}
                            ry={7}
                            width="100%"
                          />
                        </Svg>
                      </View>
                    </View>
                    <Text className="mt-[36px] font-notoSansKRRegular text-[40px] leading-[50px] text-black">
                      분리수거 성공!
                    </Text>
                    <TouchableOpacity
                      className="mt-[54px] h-[60px] w-[288px] overflow-hidden rounded-[12px]"
                      activeOpacity={0.85}
                      onPress={handleHomePress}>
                      <View className="absolute inset-0">
                        <Svg height="100%" width="100%">
                          <Defs>
                            <LinearGradient
                              id="tablet-trash-feedback-home-gradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0">
                              <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
                              <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
                            </LinearGradient>
                          </Defs>
                          <Rect
                            fill="url(#tablet-trash-feedback-home-gradient)"
                            height="100%"
                            rx={12}
                            ry={12}
                            width="100%"
                          />
                        </Svg>
                      </View>
                      <View className="h-full items-center justify-center">
                        <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
                          홈으로 이동
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}
              {currentStep === 'failed' ? (
                <View className="absolute inset-0 items-center justify-center">
                  <TouchableOpacity
                    className="absolute left-[24px] top-[24px] z-10 rounded-full border border-border px-[16px] py-[8px]"
                    activeOpacity={0.8}
                    onPress={handleRetryGuidePress}>
                    <Text className="font-notoSansKRRegular text-[16px] leading-[20px] text-body">
                      다음
                    </Text>
                  </TouchableOpacity>
                  <XIcon height={220} width={220} />
                  <Text className="mt-[58px] font-notoSansKRRegular text-[40px] leading-[50px] text-black">
                    인식에 실패했어요!
                  </Text>
                  <TouchableOpacity
                    className="mt-[72px] h-[60px] w-[288px] overflow-hidden rounded-[12px]"
                    activeOpacity={0.85}
                    onPress={handleRestartPress}>
                    <View className="absolute inset-0">
                      <Svg height="100%" width="100%">
                        <Defs>
                          <LinearGradient
                            id="tablet-trash-feedback-retry-gradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0">
                            <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
                            <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          fill="url(#tablet-trash-feedback-retry-gradient)"
                          height="100%"
                          rx={12}
                          ry={12}
                          width="100%"
                        />
                      </Svg>
                    </View>
                    <View className="h-full items-center justify-center">
                      <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
                        재시도
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {currentStep === 'retryGuide' ? (
                <View className="absolute inset-0 items-center justify-center">
                  <View className="h-[300px] w-[660px] overflow-hidden border border-border bg-disabledBg">
                    {hasVideoError ? (
                      <View className="h-full items-center justify-center">
                        <Text className="font-notoSansKRRegular text-[20px] leading-[28px] text-body">
                          동영상을 불러오지 못했어요.
                        </Text>
                      </View>
                    ) : (
                      <Video
                        controls
                        onError={handleVideoError}
                        repeat
                        resizeMode={ResizeMode.CONTAIN}
                        source={{ uri: retryGuideVideo }}
                        style={{ height: '100%', width: '100%' }}
                      />
                    )}
                  </View>
                  <Text className="mt-[58px] font-notoSansKRRegular text-[40px] leading-[50px] text-black">
                    분리수거를 재시도해 주세요.
                  </Text>
                  <TouchableOpacity
                    className="mt-[32px] h-[60px] w-[288px] overflow-hidden rounded-[12px]"
                    activeOpacity={0.85}
                    onPress={handleRestartPress}>
                    <View className="absolute inset-0">
                      <Svg height="100%" width="100%">
                        <Defs>
                          <LinearGradient
                            id="tablet-trash-feedback-guide-retry-gradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0">
                            <Stop offset="0" stopColor={GRADIENT_ACTIVE.to} />
                            <Stop offset="1" stopColor={GRADIENT_ACTIVE.from} />
                          </LinearGradient>
                        </Defs>
                        <Rect
                          fill="url(#tablet-trash-feedback-guide-retry-gradient)"
                          height="100%"
                          rx={12}
                          ry={12}
                          width="100%"
                        />
                      </Svg>
                    </View>
                    <View className="h-full items-center justify-center">
                      <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
                        재시도
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {currentStep === 'waitingTrash' ? (
                <View className="items-end">
                  <View className="w-[96px] items-center">
                    <WatchIcon height={96} width={96} />
                    <Text className="mt-[20px] font-notoSansKRRegular text-[40px] leading-[40px] text-black">
                      {remainingSeconds}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletTrashFeedbackScreen;
