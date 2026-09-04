import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Video, { ResizeMode, VideoRef } from 'react-native-video';
import { cssInterop } from 'nativewind';
import BackArrow from '@/assets/images/vector.svg';

import { getFeedbackDetail } from '@/services';
import type { FeedbackDetailData } from '@/types';
import { COLORS } from '@/constants/theme';

cssInterop(LinearGradient, {
  className: 'style',
});

import type { RootStackParamList } from '@/navigation/types';

type FeedbackDetailRouteProp = RouteProp<RootStackParamList, 'FeedbackDetail'>;

const FeedbackDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<FeedbackDetailRouteProp>();
  const { id } = route.params;

  const [feedback, setFeedback] = useState<FeedbackDetailData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (isVideoLoaded) {
        videoRef.current?.seek(0);
      }
      setIsVideoPaused(true);
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      setIsVideoPaused(false);
    });

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, isVideoLoaded]);

  const fetchFeedbackDetail = useCallback(async () => {
    setHasVideoError(false);
    setIsVideoPaused(false);
    setIsVideoLoaded(false);
    setFetchError(null);
    try {
      const response = await getFeedbackDetail(id);
      setFeedback(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : '피드백을 불러오지 못했어요.';
      setFetchError(message);
    }
  }, [id]);

  useEffect(() => {
    void (async () => {
      await fetchFeedbackDetail();
    })();
  }, [fetchFeedbackDetail]);

  const handleGoSearch = () => {
    navigation.navigate('MobileTabs', { screen: 'Search' });
  };

  const handleVideoError = (error: unknown) => {
    console.error('동영상 재생 실패:', error, feedback?.videoUrl);
    setHasVideoError(true);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView>
        <View className="flex-row items-center px-6 pt-9">
          <TouchableOpacity className="w-10 p-2 pl-6" onPress={() => navigation.goBack()}>
            <BackArrow />
          </TouchableOpacity>
          <Text className="flex-1 text-center font-notoSansKRBold text-xl text-black">
            피드백 상세
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6">
          <View className="mt-3 flex-row items-center justify-center gap-2 py-6">
            <Text className="font-notoSansKRRegular text-base text-gray">
              {feedback ? `${feedback.date} - ${feedback.time}` : ''}
            </Text>
          </View>

          <Text className="my-4 text-center font-notoSansKRRegular text-lg text-black">
            {feedback?.title}
          </Text>

          {fetchError ? (
            <View className="mt-6 h-64 items-center justify-center gap-4">
              <Text className="text-center font-notoSansKRRegular text-sm text-gray">
                {fetchError}
              </Text>
              <TouchableOpacity
                className="rounded-full border border-gray px-6 py-2"
                onPress={fetchFeedbackDetail}>
                <Text className="font-notoSansKRRegular text-sm text-black">다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : !feedback ? (
            <View className="mt-6 h-64 items-center justify-center">
              <ActivityIndicator size="large" color={COLORS.purple} />
            </View>
          ) : feedback.isSuccess ? (
            <View className="mt-6 h-64 items-center justify-center rounded-xl bg-purple/[0.08] px-4">
              <Text className="text-center font-notoSansKRBold text-base text-black">
                {feedback.wasteType}을(를) 올바르게 분리배출했습니다.
                {'\n\n'}
                오늘도 지구를 위한{'\n'}
                좋은 행동을 했어요!
              </Text>
            </View>
          ) : (
            <>
              {feedback?.videoUrl && (
                <View className="mt-6 h-64 overflow-hidden rounded-xl bg-gray">
                  {hasVideoError ? (
                    <View className="h-full items-center justify-center">
                      <Text className="font-notoSansKRRegular text-base text-gray">
                        동영상을 불러오지 못했어요.
                      </Text>
                    </View>
                  ) : (
                    <Video
                      ref={videoRef}
                      muted
                      paused={isVideoPaused}
                      onLoad={() => setIsVideoLoaded(true)}
                      onError={handleVideoError}
                      repeat
                      resizeMode={ResizeMode.COVER}
                      source={{ uri: feedback.videoUrl }}
                      style={{ height: '100%', width: '100%' }}
                    />
                  )}
                </View>
              )}

              <View className="mt-6 rounded-xl bg-purple/[0.08] px-4 py-8">
                <Text className="font-notoSansKRBold text-base text-black">
                  {feedback?.wasteType}을(를) 버릴 때에는
                </Text>
                {feedback?.content?.split('\n').map((line, index) => (
                  <Text key={index} className="mt-6 font-notoSansKRDemiLight text-base text-body">
                    {line}
                  </Text>
                ))}
              </View>
            </>
          )}

          <View className="mt-4 px-8 py-6 pt-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="overflow-hidden rounded-full"
              onPress={handleGoSearch}>
              <LinearGradient
                colors={[COLORS.pink, COLORS.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center py-4">
                <Text className="font-notoSansKRBold text-base text-white">
                  자세한 분리수거 방법
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackDetailScreen;
