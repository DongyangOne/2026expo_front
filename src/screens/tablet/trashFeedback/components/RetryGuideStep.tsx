import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Video, { ResizeMode } from 'react-native-video';

import XIcon from '@/assets/icons/x.svg';
import { GRADIENT_ACTIVE } from '@/constants';
import type { TabletClassificationData } from '@/types';

import { getGuidanceMessage } from '../guidance';

const GUIDE_VIDEO_MAX_PLAY_COUNT = 3;

interface RetryGuideStepProps {
  classificationResult: TabletClassificationData | null;
  isRestarting: boolean;
  onRestart: () => void;
}

const RetryGuideStep = ({
  classificationResult,
  isRestarting,
  onRestart,
}: RetryGuideStepProps): React.JSX.Element => {
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [guideVideoPlaybackKey, setGuideVideoPlaybackKey] = useState<number>(0);

  const isRecognitionFailure = classificationResult?.status === 'NOT_DETECTED';
  const guidanceMessage = getGuidanceMessage(classificationResult?.guidanceCode);

  const handleVideoError = useCallback((): void => {
    setHasVideoError(true);
  }, []);

  const handleVideoEnd = useCallback((): void => {
    setGuideVideoPlaybackKey((currentPlaybackKey) =>
      currentPlaybackKey + 1 < GUIDE_VIDEO_MAX_PLAY_COUNT
        ? currentPlaybackKey + 1
        : currentPlaybackKey,
    );
  }, []);

  return (
    <View className="absolute inset-0 items-center justify-center">
      {isRecognitionFailure ? (
        <XIcon height={220} width={220} />
      ) : (
        <View className="h-[300px] w-[720px] overflow-hidden bg-white">
          {hasVideoError || !classificationResult?.guideVideoUrl ? (
            <View className="h-full items-center justify-center">
              <Text className="font-notoSansKRRegular text-[20px] leading-[28px] text-body">
                {hasVideoError ? '동영상을 불러오지 못했어요.' : '안내 동영상이 없어요.'}
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
              source={{ uri: classificationResult.guideVideoUrl }}
              style={{ height: '100%', width: '100%' }}
            />
          )}
        </View>
      )}
      <Text className="mt-[40px] max-w-[800px] text-center font-notoSansKRRegular text-[30px] leading-[44px] text-black">
        {guidanceMessage ??
          classificationResult?.message ??
          (isRecognitionFailure ? '인식에 실패했어요!' : '분리수거를 재시도해 주세요.')}
      </Text>
      <TouchableOpacity
        className="mt-[32px] h-[60px] w-[288px] overflow-hidden rounded-[12px]"
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
          <Text className="font-notoSansKRBold text-[15px] leading-[20px] text-white">
            {isRestarting ? '준비 중...' : '재시도'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RetryGuideStep;
