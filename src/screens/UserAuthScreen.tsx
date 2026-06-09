import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const UserAuthScreen = () => {
  return (
    <View className="flex-1 bg-white px-5 pt-6">
      {/* 타이틀 */}
      <Text className="text-center font-notoSansKRBold text-xl text-black">사용자 인증</Text>

      {/* 아이디 */}
      <View className="mt-6">
        <Text className="mb-2 mt-40 font-notoSansKRRegular text-sm text-gray-500">아이디</Text>
        <View className="rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">cye4526</Text>
        </View>
      </View>

      {/* 이메일 */}
      <View className="mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">이메일</Text>
        <View className="flex-row">
          <View className="flex-1 flex-row items-center justify-between rounded-l-xl border border-gray-200 px-4 py-3">
            <Text className="font-notoSansKRRegular text-base text-black ">cye4526@naver.com</Text>
          </View>
          <TouchableOpacity className="-ml-2 rounded-xl bg-gray-500 px-4 py-3">
            <Text className="text-base text-white">전송</Text>
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

      {/* 확인 버튼 */}
      <TouchableOpacity className="mx-5 mt-40 rounded-full bg-gray-500 py-5 ">
        <Text className="text-center font-notoSansKRRegular text-xl text-white">확인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserAuthScreen;
