import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const EditProfileScreen = () => {
  return (
    <View className="flex-1 bg-white px-5 pt-6">
      {/* 타이틀 */}
      <Text className="text-center font-notoSansKRBold text-xl text-black">프로필</Text>

      {/* 프로필 이미지 */}
      <View className="mt-6 items-center">
        <View className="h-24 w-24 rounded-full bg-gray-200" />
      </View>

      {/* 이름 */}
      <Text className="mt-4 text-center font-notoSansKRBold text-lg text-black">최예은</Text>

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
        <View className="rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">cye4526@naver.com</Text>
        </View>
      </View>

      {/* 비밀번호 */}
      <View className="mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">비밀번호</Text>
        <View className="rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">******</Text>
        </View>
      </View>

      <View className="mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">비밀번호 확인</Text>
        <View className="rounded-xl border border-gray-200 px-4 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">******</Text>
        </View>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity className="mx-5 mt-20 rounded-full bg-gray-500 py-5 ">
        <Text className="text-center font-notoSansKRRegular text-xl text-white">확인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;
