import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedbackdetailScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Text className="text-gray-800 font-notoSansKRRegular text-xl">피드백 목록</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackdetailScreen;
