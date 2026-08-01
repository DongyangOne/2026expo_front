import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import Video, { ResizeMode } from 'react-native-video';

import CanIcon from '@/assets/icons/can.svg';
import CharacterIcon from '@/assets/icons/character.svg';
import LoadingIcon from '@/assets/icons/loading.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import WatchIcon from '@/assets/icons/watch.svg';
import XIcon from '@/assets/icons/x.svg';
import PaperIcon from '@/assets/images/paper.svg';
import PlasticBagIcon from '@/assets/images/plasticBag.svg';
import PlasticBottleIcon from '@/assets/images/plasticBottle.svg';
import { GRADIENT_ACTIVE } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { getTabletClassification, requestHardwareClassification } from '@/services';
import type { TabletClassificationData } from '@/types';

const COUNTDOWN_START_SECONDS = 20;
const CLASSIFICATION_POLL_INTERVAL_MS = 1000;
const CLASSIFICATION_ERROR_MESSAGE = '분류 결과를 불러오지 못했어요.';
const GUIDE_VIDEO_MAX_PLAY_COUNT = 3;

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

type TrashFeedbackStep = 'waitingTrash' | 'loading' | 'canResult' | 'success' | 'retryGuide';
type WasteTypeIcon = React.FC<SvgProps>;

const WASTE_TYPE_ICONS: Record<string, WasteTypeIcon> = {
  CAN: CanIcon,
  PAPER: PaperIcon,
  PET: PlasticBottleIcon,
  PLASTIC: PlasticBottleIcon,
  PLASTIC_BOTTLE: PlasticBottleIcon,
  PLASTIC_BAG: PlasticBagIcon,
  VINYL: PlasticBagIcon,
};

const TabletTrashFeedbackScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const clientId = route.params?.clientId;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(COUNTDOWN_START_SECONDS);
  const [currentStep, setCurrentStep] = useState<TrashFeedbackStep>('loading');
  const [classificationResult, setClassificationResult] = useState<TabletClassificationData | null>(
    null,
  );
  const [classificationErrorMessage, setClassificationErrorMessage] = useState<string | null>(null);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [guideVideoPlaybackKey, setGuideVideoPlaybackKey] = useState<number>(0);
  const [loadingRotation] = useState<Animated.Value>(() => new Animated.Value(0));

  const loadingSpin = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const currentLevel = classificationResult?.currentLevel ?? classificationResult?.level ?? 0;
  const expProgressPercentage = classificationResult?.expPercent ?? 0;
  const isRecognitionFailure =
    classificationResult?.guidanceCode === 'LOW_CONFIDENCE' ||
    classificationResult?.status === 'NOT_DETECTED';
  const WasteTypeIcon =
    WASTE_TYPE_ICONS[classificationResult?.wasteType?.toUpperCase() ?? ''] ?? TrashIcon;

  const handleNextPress = (): void => {
    if (currentStep === 'waitingTrash') {
      setCurrentStep('loading');
      return;
    }

    if (currentStep === 'canResult' && classificationResult?.status === 'ALLOWED') {
      setCurrentStep('success');
      return;
    }

    setHasVideoError(false);
    setGuideVideoPlaybackKey(0);
    setCurrentStep('retryGuide');
  };

  const handleClassificationRetryPress = (): void => {
    setClassificationErrorMessage(null);
  };

  const handleHomePress = (): void => {
    navigation.replace('TabletMain');
  };

  const handleRestartPress = (): void => {
    setRemainingSeconds(COUNTDOWN_START_SECONDS);
    setClassificationResult(null);
    setClassificationErrorMessage(null);
    setHasVideoError(false);
    setGuideVideoPlaybackKey(0);
    setCurrentStep('waitingTrash');
  };

  const handleVideoError = (): void => {
    setHasVideoError(true);
  };

  const handleVideoEnd = (): void => {
    setGuideVideoPlaybackKey((currentPlaybackKey) =>
      currentPlaybackKey + 1 < GUIDE_VIDEO_MAX_PLAY_COUNT
        ? currentPlaybackKey + 1
        : currentPlaybackKey,
    );
  };

  useEffect((): (() => void) | undefined => {
    if (currentStep !== 'waitingTrash') {
      return undefined;
    }

    if (remainingSeconds <= 0) {
      navigation.replace('TabletMain');
      return undefined;
    }

    const timerId = setTimeout((): void => {
      setRemainingSeconds((currentRemainingSeconds) => currentRemainingSeconds - 1);
    }, 1000);

    return (): void => {
      clearTimeout(timerId);
    };
  }, [currentStep, navigation, remainingSeconds]);

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

  useEffect((): (() => void) | undefined => {
    if (currentStep !== 'loading' || classificationErrorMessage) {
      return undefined;
    }

    let isCancelled = false;
    let pollTimerId: ReturnType<typeof setTimeout> | undefined;

    const fetchClassificationResult = async (clientId: string): Promise<void> => {
      try {
        const response = await getTabletClassification(clientId);

        if (isCancelled) {
          return;
        }

        if (!response.success) {
          throw new Error(response.message);
        }

        if (response.data.completed && response.data.status !== 'WAITING') {
          console.warn('[분류 흐름 11] 분류 완료, 결과 화면 전환', {
            clientId,
            status: response.data.status,
            wasteType: response.data.wasteType,
          });
          setClassificationResult(response.data);

          if (
            response.data.guidanceCode === 'LOW_CONFIDENCE' ||
            response.data.status === 'NOT_DETECTED' ||
            response.data.status === 'REJECTED'
          ) {
            setCurrentStep('retryGuide');
            return;
          }

          setCurrentStep('canResult');
          return;
        }

        console.warn('[분류 흐름 11] 분류 대기 중, 1초 후 재조회', {
          clientId,
          status: response.data.status,
          completed: response.data.completed,
        });
        pollTimerId = setTimeout((): void => {
          void fetchClassificationResult(clientId);
        }, CLASSIFICATION_POLL_INTERVAL_MS);
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        console.error('[TabletTrashFeedbackScreen] 분류 결과 조회 실패', error);
        setClassificationErrorMessage(CLASSIFICATION_ERROR_MESSAGE);
      }
    };

    const startClassification = async (): Promise<void> => {
      try {
        if (!clientId) {
          throw new Error('clientId가 없습니다.');
        }

        console.warn('[분류 흐름 6] 로딩 화면 진입, 하드웨어 요청 시작', { clientId });
        await requestHardwareClassification(clientId);
        await fetchClassificationResult(clientId);
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        console.error('[TabletTrashFeedbackScreen] 감지 요청 실패', error);
        setClassificationErrorMessage(CLASSIFICATION_ERROR_MESSAGE);
      }
    };

    void startClassification();

    return (): void => {
      isCancelled = true;

      if (pollTimerId) {
        clearTimeout(pollTimerId);
      }
    };
  }, [classificationErrorMessage, clientId, currentStep]);

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
                <View
                  className="absolute inset-0 items-center justify-center"
                  pointerEvents={classificationErrorMessage ? 'auto' : 'none'}>
                  <Animated.View style={{ transform: [{ rotate: loadingSpin }] }}>
                    <LoadingIcon height={300} width={300} />
                  </Animated.View>
                  <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
                    {classificationErrorMessage ?? (
                      <>
                        쓰레기를 <Text className="text-trashAction">인식</Text> 중입니다...
                      </>
                    )}
                  </Text>
                  {classificationErrorMessage ? (
                    <TouchableOpacity
                      className="mt-[32px] rounded-[12px] bg-purple px-[40px] py-[16px]"
                      activeOpacity={0.85}
                      onPress={handleClassificationRetryPress}>
                      <Text className="font-notoSansKRBold text-[15px] text-white">다시 조회</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
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
                    <WasteTypeIcon height={300} width={300} />
                    <Text className="mt-[48px] font-notoSansKRRegular text-[44px] leading-[56px] text-black">
                      <Text className="text-trashAction">
                        {classificationResult?.wasteTypeLabel ?? '분류 결과'}
                      </Text>
                      입니다
                    </Text>
                  </View>
                </>
              ) : null}
              {currentStep === 'success' ? (
                <View className="absolute inset-0 items-center justify-center">
                  {classificationResult?.characterImageUrl ? (
                    <Image
                      className="h-[260px] w-[260px]"
                      resizeMode="contain"
                      source={{ uri: classificationResult.characterImageUrl }}
                    />
                  ) : (
                    <CharacterIcon height={260} width={260} />
                  )}
                  <Text className="mt-[8px] font-notoSansKRRegular text-[24px] leading-[30px] text-black">
                    LV.{currentLevel}
                  </Text>
                  <View className="mt-[10px] h-[14px] w-[160px] overflow-hidden rounded-full border border-border bg-background">
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
                        width={`${expProgressPercentage}%`}
                      />
                    </Svg>
                  </View>
                  <Text className="mt-[36px] font-notoSansKRRegular text-[40px] leading-[50px] text-black">
                    {classificationResult?.message ?? '분리배출 성공!'}
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
              ) : null}
              {currentStep === 'retryGuide' ? (
                <View className="absolute inset-0 items-center justify-center">
                  {isRecognitionFailure ? (
                    <XIcon height={220} width={220} />
                  ) : (
                    <View className="h-[300px] w-[720px] overflow-hidden bg-white">
                      {hasVideoError || !classificationResult?.guideVideoUrl ? (
                        <View className="h-full items-center justify-center">
                          <Text className="font-notoSansKRRegular text-[20px] leading-[28px] text-body">
                            {hasVideoError
                              ? '동영상을 불러오지 못했어요.'
                              : '안내 동영상이 없어요.'}
                          </Text>
                        </View>
                      ) : (
                        <Video
                          key={`${classificationResult.guideVideoUrl}-${guideVideoPlaybackKey}`}
                          controls={false}
                          onEnd={handleVideoEnd}
                          onError={handleVideoError}
                          paused={false}
                          resizeMode={ResizeMode.CONTAIN}
                          source={{
                            uri: classificationResult.guideVideoUrl,
                          }}
                          style={{ height: '100%', width: '100%' }}
                        />
                      )}
                    </View>
                  )}
                  <Text className="mt-[40px] max-w-[800px] text-center font-notoSansKRRegular text-[30px] leading-[44px] text-black">
                    {classificationResult?.message ??
                      (isRecognitionFailure ? '인식에 실패했어요!' : '분리수거를 재시도해 주세요.')}
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
