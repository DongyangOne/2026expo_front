import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { TabletBackgroundCircles } from '@/components/layout';
import LogoIcon from '@/assets/icons/Logo.svg';
import { FONTS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { issueQrToken } from '@/services';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletMain'>;

interface QrTapState {
  firstTapAt: number;
  count: number;
}

const QR_SIZE = 250;
const LOGIN_TAP_WINDOW_MS = 5000;
const LOGIN_TAP_COUNT = 5;
const QR_TOKEN_ERROR_MESSAGE = 'QR 코드를 불러오지 못했습니다.';

interface QrCodeProps {
  qrToken: string | null;
  isLoading: boolean;
}

const QrCode = ({ qrToken, isLoading }: QrCodeProps): React.JSX.Element => {
  return (
    <View className="h-[250px] w-[250px] items-center justify-center rounded-[8px] bg-[#E5E7EB] p-[14px]">
      {isLoading ? <ActivityIndicator color="#7B61FF" size="large" /> : null}
      {!isLoading && qrToken ? (
        <QRCode
          backgroundColor="#FFFFFF"
          color="#404040"
          size={QR_SIZE - 28}
          value={qrToken}
        />
      ) : null}
      {!isLoading && !qrToken ? (
        <Text className="text-center font-notoSansKRRegular text-[16px] text-body">
          {QR_TOKEN_ERROR_MESSAGE}
        </Text>
      ) : null}
    </View>
  );
};

const GradientGuideText = (): React.JSX.Element => {
  return (
    <Svg height={54} width={250}>
      <Defs>
        <LinearGradient id="tablet-main-guide-gradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#7B61FF" />
          <Stop offset="1" stopColor="#FF4FD8" />
        </LinearGradient>
      </Defs>
      <SvgText
        fill="url(#tablet-main-guide-gradient)"
        fontFamily={FONTS.bold}
        fontSize={40}
        textAnchor="middle"
        x={125}
        y={43}>
        이용해주세요
      </SvgText>
    </Svg>
  );
};

const TabletMain = ({ navigation }: Props): React.JSX.Element => {
  const qrTapState = useRef<QrTapState>({ firstTapAt: 0, count: 0 });
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(true);

  useEffect((): (() => void) => {
    let isMounted = true;

    const fetchQrToken = async (): Promise<void> => {
      try {
        const qrTokenResponse = await issueQrToken();

        if (isMounted && qrTokenResponse.success) {
          setQrToken(qrTokenResponse.data.qrToken);
        }
      } catch (error: unknown) {
        console.error('[TabletMain] QR 토큰 발급 실패', error);
      } finally {
        if (isMounted) {
          setIsQrLoading(false);
        }
      }
    };

    void fetchQrToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQrPress = useCallback((): void => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - qrTapState.current.firstTapAt;

    if (elapsedTime > LOGIN_TAP_WINDOW_MS) {
      qrTapState.current = { firstTapAt: currentTime, count: 1 };
      return;
    }

    const nextCount = qrTapState.current.count + 1;
    qrTapState.current = { ...qrTapState.current, count: nextCount };

    if (nextCount >= LOGIN_TAP_COUNT) {
      qrTapState.current = { firstTapAt: 0, count: 0 };
      navigation.navigate('TabletLogin');
    }
  }, [navigation]);

  const handleTemporaryFeedbackPress = useCallback((): void => {
    navigation.navigate('TabletTrashFeedback');
  }, [navigation]);

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <TabletBackgroundCircles />
      <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
        <View className="flex-1 items-center">
          <Pressable
            className="absolute top-[24px] z-10 h-[38px] min-w-[150px] items-center justify-center rounded-[10px] bg-purple px-[16px]"
            onPress={handleTemporaryFeedbackPress}>
            <Text className="font-notoSansKRBold text-[13px] text-white">임시 피드백 이동</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="QR 코드"
            accessibilityRole="button"
            className="mt-[80px] items-center"
            onPress={handleQrPress}>
            <QrCode isLoading={isQrLoading} qrToken={qrToken} />
          </Pressable>

          <Text className="mt-[20px] text-center font-notoSansKRBold text-[40px] leading-[48px] text-black">
            QR로 로그인 후
          </Text>
          <GradientGuideText />

          <View className="flex-1 items-center justify-end pb-[20px]">
            <LogoIcon height={204} width={306} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletMain;
