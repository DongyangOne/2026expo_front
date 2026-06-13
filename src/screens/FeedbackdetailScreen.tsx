import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedbackdetailScreen = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 items-center bg-white">
      <View>
        <Text className="text-gray-800 font-notoSansKRRegular text-xl">피드백 상세</Text>
        <Text>뒤로가기 버튼</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackdetailScreen;
