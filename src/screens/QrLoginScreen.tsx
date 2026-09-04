import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';
import { approveQrLogin } from '@/services';
import { useAuthStore } from '@/store';

type Props = NativeStackScreenProps<RootStackParamList, 'QrLogin'>;

const QR_TOKEN_ERROR_MESSAGE = '유효한 QR 로그인 정보가 없습니다.';
const APPROVAL_ERROR_MESSAGE = '태블릿 로그인 승인에 실패했습니다.';

const QrLoginScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const attemptedQrTokenRef = useRef<string | null>(null);
  const [approvalErrorMessage, setApprovalErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const qrToken = route.params?.qrToken;

  useEffect((): (() => void) | void => {
    if (isRestoring || !qrToken) {
      return;
    }

    if (!accessToken) {
      navigation.replace('Login', { qrToken });
      return;
    }

    if (attemptedQrTokenRef.current === qrToken) {
      return;
    }

    attemptedQrTokenRef.current = qrToken;
    let isActive = true;

    const approveLogin = async (): Promise<void> => {
      setApprovalErrorMessage(null);

      try {
        const approvalResponse = await approveQrLogin(qrToken);

        if (!approvalResponse.success) {
          throw new Error(approvalResponse.message || APPROVAL_ERROR_MESSAGE);
        }

        console.warn('[QrLoginScreen] QR 로그인 승인 성공', approvalResponse);

        if (isActive) {
          navigation.replace('MobileTabs');
        }
      } catch (error: unknown) {
        if (!isActive) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : APPROVAL_ERROR_MESSAGE;
        setApprovalErrorMessage(errorMessage);
      }
    };

    void approveLogin();

    return (): void => {
      isActive = false;
    };
  }, [accessToken, isRestoring, navigation, qrToken, retryCount]);

  const handleRetry = (): void => {
    attemptedQrTokenRef.current = null;
    setRetryCount((currentRetryCount) => currentRetryCount + 1);
  };

  if (!qrToken) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-[32px]">
        <Text className="text-center font-notoSansKRRegular text-[18px] text-body">
          {QR_TOKEN_ERROR_MESSAGE}
        </Text>
      </SafeAreaView>
    );
  }

  if (approvalErrorMessage) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-[32px]">
        <View className="w-full rounded-[20px] border border-border bg-white px-[24px] py-[32px]">
          <Text className="text-center font-notoSansKRBold text-[24px] text-black">승인 실패</Text>
          <Text className="mt-[16px] text-center font-notoSansKRRegular text-[16px] leading-[24px] text-body">
            {approvalErrorMessage}
          </Text>
          <Pressable
            className="mt-[28px] h-[52px] items-center justify-center rounded-[12px] bg-purple"
            onPress={handleRetry}>
            <Text className="font-notoSansKRBold text-[16px] text-white">다시 시도</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-[32px]">
      <ActivityIndicator color="#7866FF" size="large" />
      <Text className="mt-[16px] text-center font-notoSansKRRegular text-[16px] text-body">
        태블릿 로그인을 승인하고 있습니다.
      </Text>
    </SafeAreaView>
  );
};

export default QrLoginScreen;
