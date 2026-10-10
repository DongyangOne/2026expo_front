import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Video, { ResizeMode } from 'react-native-video';

import XIcon from '@/assets/icons/x.svg';
import { GRADIENT_ACTIVE } from '@/constants';
import type { TabletClassificationData } from '@/types';

import { getGuidanceMessage } from '../guidance';

const GUIDE_VIDEO_MAX_PLAY_COUNT = 3;
const GUIDE_VIDEO_PREPARATION_TIMEOUT_MS = 15000;

interface RetryGuideStepProps {
  classificationResult: TabletClassificationData | null;
  isPreparingVideo?: boolean;
  isRestarting: boolean;
  onRestart: () => void;
  onVideoPrepared?: () => void;
}

const RetryGuideStep = ({
  classificationResult,
  isPreparingVideo = false,
  isRestarting,
  onRestart,
  onVideoPrepared,
}: RetryGuideStepProps): React.JSX.Element => {
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [guideVideoPlaybackKey, setGuideVideoPlaybackKey] = useState<number>(0);

  const isRecognitionFailure = classificationResult?.status === 'NOT_DETECTED';
  const guidanceMessage = getGuidanceMessage(classificationResult?.guidanceCode);
  const hasVideoSource = Boolean(classificationResult?.guideVideoUrl);

  const handleVideoError = useCallback((): void => {
    setHasVideoError(true);
    onVideoPrepared?.();
  }, [onVideoPrepared]);

  useEffect((): (() => void) | undefined => {
    if (!isPreparingVideo) {
      return undefined;
    }

    // 준비 이벤트가 오지 않는 영상도 로딩 화면에 계속 머물지 않고 재시도할 수 있게 한다.
    const timerId = setTimeout(handleVideoError, GUIDE_VIDEO_PREPARATION_TIMEOUT_MS);
    return (): void => clearTimeout(timerId);
  }, [handleVideoError, isPreparingVideo]);

  const handleVideoEnd = useCallback((): void => {
    setGuideVideoPlaybackKey((currentPlaybackKey) =>
      currentPlaybackKey + 1 < GUIDE_VIDEO_MAX_PLAY_COUNT
        ? currentPlaybackKey + 1
        : currentPlaybackKey,
    );
  }, []);

  return (
    <View
      accessibilityElementsHidden={isPreparingVideo}
      importantForAccessibility={isPreparingVideo ? 'no-hide-descendants' : 'auto'}
      pointerEvents={isPreparingVideo ? 'none' : 'auto'}
      className="absolute inset-0 overflow-hidden rounded-[14px] bg-black">
      {isRecognitionFailure ? (
        <View className="flex-1 items-center justify-center">
          <XIcon height={220} width={220} />
        </View>
      ) : hasVideoError || !hasVideoSource ? (
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="font-notoSansKRRegular text-[20px] leading-[28px] text-body">
            {hasVideoError ? '동영상을 불러오지 못했어요.' : '안내 동영상이 없어요.'}
          </Text>
        </View>
      ) : (
        <Video
          key={`${classificationResult?.guideVideoUrl}-${guideVideoPlaybackKey}`}
          controls={false}
          muted
          onEnd={handleVideoEnd}
          onError={handleVideoError}
          onReadyForDisplay={onVideoPrepared}
          paused={isPreparingVideo}
          resizeMode={ResizeMode.COVER}
          source={{ uri: classificationResult?.guideVideoUrl ?? undefined }}
          style={{ height: '100%', width: '100%' }}
        />
      )}
      <View className="absolute left-0 right-0 top-[30px] items-center px-[40px]">
        <View className="max-w-[900px] rounded-[12px] bg-white px-[24px] py-[12px]">
          <Text className="text-center font-notoSansKRBold text-[30px] leading-[44px] text-black">
            {guidanceMessage ??
              classificationResult?.message ??
              (isRecognitionFailure ? '인식에 실패했어요!' : '분리수거를 재시도해 주세요.')}
          </Text>
        </View>
      </View>
      <View className="absolute bottom-[40px] left-0 right-0 items-center px-[40px]">
        <TouchableOpacity
          className="h-[60px] w-[288px] overflow-hidden rounded-[12px]"
          activeOpacity={isRestarting ? 1 : 0.85}
          disabled={isRestarting}
          onPress={onRestart}>
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
            <Text className="font-notoSansKRBold text-[32px] leading-[28px] text-white">
              {isRestarting ? '준비 중...' : '재시도'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RetryGuideStep;
