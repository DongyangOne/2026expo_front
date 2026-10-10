import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

import RetryGuideStep from './trashFeedback/components/RetryGuideStep';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletVideoFeedback'>;

const TabletVideoFeedbackScreen = ({ navigation }: Props): React.JSX.Element => {
  const handleHomePress = (): void => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="mx-[50px] my-[40px] flex-1 overflow-hidden rounded-[15px] bg-white">
          <RetryGuideStep
            classificationResult={null}
            isRestarting={false}
            onHome={handleHomePress}
            onRestart={handleHomePress}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletVideoFeedbackScreen;
