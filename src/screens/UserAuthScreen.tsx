import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '../assets/images/vector.svg';

const UserAuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleEditProfile = () => navigation.navigate('EditProfile');
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white px-5 pt-6">
      <View className="relative flex-row items-center justify-center">
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity className="absolute left-5 z-10" onPress={() => navigation.goBack()}>
          <BackArrow width={20} height={20} />
        </TouchableOpacity>
        {/* 타이틀 */}
        <Text className="text-center font-notoSansKRBold text-2xl text-black">사용자 인증</Text>
      </View>

      {/* 아이디 */}
      <View className="ml-3 mr-3 mt-6">
        <Text className="mb-2 mt-40 font-notoSansKRRegular text-sm text-gray-500">아이디</Text>
        <View className="rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">cye4526</Text>
        </View>
      </View>

      {/* 이메일 */}
      <View className="ml-3 mr-3 mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">이메일</Text>
        <View className="flex-row">
          <View className="flex-1 flex-row items-center justify-between rounded-l-xl border border-gray-200 px-5 py-3">
            <Text className="font-notoSansKRRegular text-base text-black ">cye4526@naver.com</Text>
          </View>
          <TouchableOpacity className="-ml-2 rounded-xl bg-gray-500 px-5 py-3">
            <Text className="text-base text-white">전송</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 인증 코드 */}
      <View className="ml-3 mr-3 mt-6">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">인증 코드</Text>
        <View className="flex-row items-center justify-between rounded-xl border border-gray-200 px-5 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">111111</Text>
          <Text className="font-notoSansKRRegular text-base text-red-500">05:00</Text>
        </View>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity
        className="mx-5 mt-40 rounded-full bg-gray-500 py-5 "
        onPress={handleEditProfile}>
        <Text className="text-center font-notoSansKRRegular text-xl text-white">확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UserAuthScreen;
