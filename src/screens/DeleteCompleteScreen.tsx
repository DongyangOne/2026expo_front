import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CompleteImage from '../assets/images/leave.svg';

const DeleteCompleteScreen = () => {
  return (
    <SafeAreaView edges={['top']}>
      {/* 완료 이미지 */}
      <View className="items-center">
        <CompleteImage width={377} height={377} />
      </View>
      <Text className="mt-20 text-center font-notoSansKRBold text-2xl text-black">
        탈퇴가 완료되었습니다.{'\n'} 이용해 주셔서 감사합니다.
      </Text>
      {/* 처음으로 버튼 */}
      <TouchableOpacity className="mx-5 mt-20 rounded-full bg-gray-500 py-5 ">
        <Text className="text-center font-notoSansKRRegular text-xl text-white">처음으로</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DeleteCompleteScreen;
