import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const UserAuthScreen = () => {
  return (
    <View className="flex-1 bg-white px-5 pt-6">
      {/* 타이틀 */}
      <Text className="text-center font-notoSansKRBold text-xl text-black">사용자 인증</Text>

      {/* 아이디 */}
      <View className="mt-6">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">아이디</Text>
        <View className="rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">cye4526</Text>
        </View>
      </View>

      {/* 이메일 */}
      <View className="mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">이메일</Text>
        <View className="flex-row items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black ">cye4526@naver.com</Text>
          <TouchableOpacity className="rounded-lg bg-gray-500 px-3 py-2 ">
            <Text className="text-sm text-white">전송</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 인증 코드 */}
      <View className="mt-6">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">인증 코드</Text>
        <View className="flex-row items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">111111</Text>
          <Text className="font-notoSansKRRegular text-base text-red-500">05:00</Text>
        </View>
      </View>
      <TouchableOpacity className="rounded-2xl bg-gray-500 px-3 py-2">
        <Text>전송</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserAuthScreen;
