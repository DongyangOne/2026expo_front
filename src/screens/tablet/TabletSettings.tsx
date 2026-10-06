import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, ToastAndroid, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabletBackgroundCircles } from '@/components/layout';
import type { RootStackParamList } from '@/navigation/types';
import { getHardwareBaseUrl, saveHardwareBaseUrl } from '@/services';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletSettings'>;

const LOAD_ERROR_MESSAGE = '현재 하드웨어 주소를 불러오지 못했어요.';
const SAVE_ERROR_MESSAGE = '주소를 저장하지 못했어요. 입력값을 확인해 주세요.';
const SAVE_SUCCESS_MESSAGE = '하드웨어 주소를 저장했어요.';

const TabletSettings = ({ navigation }: Props): React.JSX.Element => {
  const [hardwareAddress, setHardwareAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect((): (() => void) => {
    let isCancelled = false;

    void getHardwareBaseUrl()
      .then((hardwareBaseUrl) => {
        if (!isCancelled) {
          setHardwareAddress(hardwareBaseUrl);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setErrorMessage(LOAD_ERROR_MESSAGE);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return (): void => {
      isCancelled = true;
    };
  }, []);

  const handleSave = async (): Promise<void> => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      console.warn('[TabletSettings] 하드웨어 주소 저장 시도', {
        inputValue: hardwareAddress,
      });
      const savedHardwareBaseUrl = await saveHardwareBaseUrl(hardwareAddress);
      console.warn('[TabletSettings] 하드웨어 주소 저장 결과', {
        savedHardwareBaseUrl,
      });
      ToastAndroid.show(SAVE_SUCCESS_MESSAGE, ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : SAVE_ERROR_MESSAGE);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <TabletBackgroundCircles />
      <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
        <View className="mt-[50px] w-[360px]">
          <Text className="text-center font-notoSansKRBold text-4xl text-black">하드웨어 설정</Text>
          <Text className="mt-[20px] text-center font-notoSansKRRegular text-[15px] leading-[24px] text-body">
            라즈베리파이의 현재 IP 주소를 입력해 주세요.
          </Text>

          <View className="mt-[50px]">
            <Text className="mb-[8px] font-notoSansKRBold text-[15px] text-body">
              라즈베리파이 주소
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              className="h-[60px] rounded-[10px] border border-border bg-white px-[16px] font-notoSansKRRegular text-[16px] text-black"
              editable={!isLoading && !isSaving}
              keyboardType="url"
              placeholder="예: http://192.168.0.10:8080"
              placeholderTextColor="#9CA3AF"
              value={hardwareAddress}
              onChangeText={(value) => {
                setHardwareAddress(value);
                setErrorMessage('');
              }}
            />
            <Text className="mt-[8px] font-notoSansKRRegular text-[13px] text-danger">
              {errorMessage || 'http://까지 포함한 전체 주소를 입력해 주세요.'}
            </Text>
          </View>

          <Pressable
            className="mt-[36px] h-[60px] items-center justify-center rounded-[16px] bg-purple"
            disabled={isLoading || isSaving}
            onPress={() => void handleSave()}>
            {isLoading || isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-notoSansKRBold text-[16px] text-white">저장</Text>
            )}
          </Pressable>

          <Pressable
            className="mt-[16px] h-[52px] items-center justify-center"
            disabled={isSaving}
            onPress={() => navigation.goBack()}>
            <Text className="font-notoSansKRRegular text-[15px] text-body">뒤로가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletSettings;
