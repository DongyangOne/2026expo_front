import React from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletDisplay'>;

const TabletDisplayScreen = ({ navigation }: Props) => {
  return (
    <View className="bg-gray-100 flex-1 px-10 py-8">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-gray-800 font-notoSansKRBold text-2xl">분리배출 태블릿 화면</Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <View className="h-64 w-64 items-center justify-center rounded-lg bg-white">
          <View className="border-gray-800 h-44 w-44 items-center justify-center rounded-lg border-2">
            <Text className="text-gray-800 font-notoSansKRBold text-3xl">QR</Text>
          </View>
        </View>

        <Text className="text-gray-800 mt-8 text-center font-notoSansKRBold text-3xl">
          휴대폰으로 QR을 스캔해주세요
        </Text>
      </View>
    </View>
  );
};

export default TabletDisplayScreen;
