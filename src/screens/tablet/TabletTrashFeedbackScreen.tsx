import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { RootStackParamList } from '@/navigation/types';
import type { TabletClassificationData } from '@/types';

import {
  CanResultStep,
  LoadingStep,
  RetryGuideStep,
  SuccessStep,
  useTabletClassification,
  WaitingTrashStep,
} from './trashFeedback';

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

type TrashFeedbackStep = 'waitingTrash' | 'loading' | 'canResult' | 'success' | 'retryGuide';

const TabletTrashFeedbackScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const clientId = route.params?.clientId;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(COUNTDOWN_START_SECONDS);
  const [currentStep, setCurrentStep] = useState<TrashFeedbackStep>('loading');

  const handleClassificationCompleted = useCallback(
    (classificationResult: TabletClassificationData): void => {
      const shouldShowRetryGuide =
        classificationResult.guidanceCode === 'LOW_CONFIDENCE' ||
        classificationResult.status === 'NOT_DETECTED' ||
        classificationResult.status === 'REJECTED';

      setCurrentStep(shouldShowRetryGuide ? 'retryGuide' : 'canResult');
    },
    [],
  );

  const {
    classificationResult,
    classificationErrorMessage,
    resetClassification,
    retryClassification,
  } = useTabletClassification({
    clientId,
    isActive: currentStep === 'loading',
    onCompleted: handleClassificationCompleted,
  });

  const handleNextPress = useCallback((): void => {
    if (currentStep === 'waitingTrash') {
      setCurrentStep('loading');
      return;
    }

    if (currentStep === 'canResult' && classificationResult?.status === 'ALLOWED') {
      setCurrentStep('success');
      return;
    }

    setCurrentStep('retryGuide');
  }, [classificationResult?.status, currentStep]);

  const handleHomePress = useCallback((): void => {
    navigation.replace('TabletMain');
  }, [navigation]);

  const handleRestartPress = useCallback((): void => {
    setRemainingSeconds(COUNTDOWN_START_SECONDS);
    resetClassification();
    setCurrentStep('waitingTrash');
  }, [resetClassification]);

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
                <WaitingTrashStep onNext={handleNextPress} remainingSeconds={remainingSeconds} />
              ) : null}
              {currentStep === 'loading' ? (
                <LoadingStep
                  errorMessage={classificationErrorMessage}
                  onRetry={retryClassification}
                />
              ) : null}
              {currentStep === 'canResult' ? (
                <CanResultStep
                  onNext={handleNextPress}
                  wasteType={classificationResult?.wasteType}
                  wasteTypeLabel={classificationResult?.wasteTypeLabel}
                />
              ) : null}
              {currentStep === 'success' ? (
                <SuccessStep classificationResult={classificationResult} onHome={handleHomePress} />
              ) : null}
              {currentStep === 'retryGuide' ? (
                <RetryGuideStep
                  classificationResult={classificationResult}
                  onRestart={handleRestartPress}
                />
              ) : null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletTrashFeedbackScreen;
