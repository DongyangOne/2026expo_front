import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';
import { approveQrLogin } from '@/services';
import { useAuthStore } from '@/store';

type Props = NativeStackScreenProps<RootStackParamList, 'QrLogin'>;

const QR_TOKEN_ERROR_MESSAGE = '유효한 QR 로그인 정보가 없습니다.';
const LOGIN_REQUIRED_MESSAGE = 'QR 로그인을 승인하려면 먼저 로그인해 주세요.';

const QrLoginScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isApproving, setIsApproving] = useState(false);
  const qrToken = route.params?.qrToken;

  const handleApprove = useCallback(async (): Promise<void> => {
    if (!qrToken || !accessToken || isApproving) {
      return;
    }

    setIsApproving(true);

    try {
      console.warn('[QrLoginScreen] 승인 요청 body의 QR 토큰', qrToken);
      await approveQrLogin(qrToken);
      Alert.alert('승인 완료', '태블릿 로그인이 승인되었습니다.', [
        {
          text: '확인',
          onPress: (): void => navigation.replace('MobileTabs'),
        },
      ]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : '태블릿 로그인 승인에 실패했습니다.';
      Alert.alert('승인 실패', errorMessage);
    } finally {
      setIsApproving(false);
    }
  }, [accessToken, isApproving, navigation, qrToken]);

  const handleLogin = useCallback((): void => {
    navigation.navigate('Login', { qrToken });
  }, [navigation, qrToken]);

  if (!qrToken) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-[32px]">
        <Text className="text-center font-notoSansKRRegular text-[18px] text-body">
          {QR_TOKEN_ERROR_MESSAGE}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-[32px]">
      <View className="w-full rounded-[20px] border border-border bg-white px-[24px] py-[32px]">
        <Text className="text-center font-notoSansKRBold text-[24px] text-black">
          태블릿 로그인
        </Text>
        <Text className="mt-[16px] text-center font-notoSansKRRegular text-[16px] leading-[24px] text-body">
          {accessToken
            ? '현재 계정으로 태블릿 로그인을 승인하시겠습니까?'
            : LOGIN_REQUIRED_MESSAGE}
        </Text>

        <Pressable
          className="mt-[28px] h-[52px] items-center justify-center rounded-[12px] bg-purple"
          disabled={isApproving}
          onPress={accessToken ? handleApprove : handleLogin}>
          {isApproving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-notoSansKRBold text-[16px] text-white">
              {accessToken ? '로그인 승인' : '로그인하기'}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default QrLoginScreen;
