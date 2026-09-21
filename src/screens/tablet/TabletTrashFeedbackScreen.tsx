import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { RootStackParamList } from '@/navigation/types';
import type { TabletClassificationData } from '@/types';

import {
  CanResultStep,
  getGuidanceMessage,
  issueClassificationClientId,
  GeneralWasteStep,
  LoadingStep,
  RetryGuideStep,
  SuccessStep,
  useTabletClassification,
  WaitingTrashStep,
} from './trashFeedback';

const COUNTDOWN_START_SECONDS = 20;
const ALLOWED_RESULT_DISPLAY_MS = 5000;
const CLIENT_ID_ISSUE_ERROR_MESSAGE = '재시도를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.';

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
  | 'generalWaste'
  | 'retryGuide';

const TabletTrashFeedbackScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const [clientId, setClientId] = useState<string | undefined>(route.params?.clientId);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(COUNTDOWN_START_SECONDS);
  const [currentStep, setCurrentStep] = useState<TrashFeedbackStep>('waitingTrash');
  const [isRestarting, setIsRestarting] = useState<boolean>(false);

  const handleClassificationCompleted = useCallback(
    (classificationResult: TabletClassificationData): void => {
      if (classificationResult.status === 'GENERAL_WASTE') {
        setCurrentStep('generalWaste');
        return;
      }

      const shouldShowRetryGuide =
        getGuidanceMessage(classificationResult.guidanceCode) !== undefined ||
        classificationResult.status === 'LOW_CONFIDENCE' ||
        classificationResult.status === 'NOT_DETECTED' ||
        classificationResult.status === 'REJECTED';

      setCurrentStep(shouldShowRetryGuide ? 'retryGuide' : 'canResult');
    },
    [],
  );

  const { classificationResult, classificationErrorMessage, resetClassification } =
    useTabletClassification({
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

  const handleRestartPress = useCallback(async (): Promise<void> => {
    setIsRestarting(true);
    console.warn('[분류 흐름 재시도 1] clientId 재발급 요청 시작', {
      previousClientId: clientId,
    });

    try {
      const issuedClientId = await issueClassificationClientId();
      console.warn('[분류 흐름 재시도 2] clientId 재발급 성공', {
        previousClientId: clientId,
        issuedClientId,
      });
      setClientId(issuedClientId);
      setRemainingSeconds(COUNTDOWN_START_SECONDS);
      resetClassification();
      setCurrentStep('waitingTrash');
    } catch (error: unknown) {
      console.error('[TabletTrashFeedbackScreen] clientId 재발급 실패', error);
      Alert.alert('재시도 준비 실패', CLIENT_ID_ISSUE_ERROR_MESSAGE);
    } finally {
      setIsRestarting(false);
    }
  }, [clientId, resetClassification]);

  useEffect((): (() => void) | undefined => {
    if (currentStep !== 'canResult' || classificationResult?.status !== 'ALLOWED') {
      return undefined;
    }

    const timerId = setTimeout((): void => {
      setCurrentStep('success');
    }, ALLOWED_RESULT_DISPLAY_MS);

    return (): void => {
      clearTimeout(timerId);
    };
  }, [classificationResult?.status, currentStep]);

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
                  isRetrying={isRestarting}
                  onHome={handleHomePress}
                  onRetry={handleRestartPress}
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
              {currentStep === 'generalWaste' ? (
                <GeneralWasteStep onHome={handleHomePress} />
              ) : null}
              {currentStep === 'retryGuide' ? (
                <RetryGuideStep
                  classificationResult={classificationResult}
                  isRestarting={isRestarting}
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
