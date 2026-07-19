import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import ProfileImage from '../assets/images/profile.svg';
import BackArrow from '../assets/images/vector.svg';

const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView edges={['top']} className="flex-1 ">
      <View className="bg-white px-5 pt-6">
        <View className="relative flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity className="absolute left-5 z-10" onPress={() => navigation.goBack()}>
            <BackArrow width={20} height={20} />
          </TouchableOpacity>
          {/* 타이틀 */}
          <Text className="text-center font-notoSansKRBold text-2xl text-black">프로필 수정</Text>
        </View>

        {/* 프로필 이미지 */}
        <View className="items-center">
          <ProfileImage width={245} height={163} />
        </View>

        {/* 이름 */}
        <Text className="mt-4 text-center font-notoSansKRBold text-2xl text-black">최예은</Text>

        {/* 아이디 */}
        <View className="ml-3 mr-3 mt-6">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">아이디</Text>
          <View className="rounded-xl border border-gray-200 px-5 py-3">
            <Text className="font-notoSansKRRegular text-base text-black">cye4526</Text>
          </View>
        </View>

        {/* 이메일 */}
        <View className="ml-3 mr-3 mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">이메일</Text>
          <View className="rounded-xl border border-gray-200 px-5 py-3">
            <Text className="font-notoSansKRRegular text-base text-black">cye4526@naver.com</Text>
          </View>
        </View>

        {/* 비밀번호 */}
        <View className="ml-3 mr-3 mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">비밀번호</Text>
          <View className="rounded-xl border border-gray-200 px-5 py-3">
            <Text className="font-notoSansKRRegular text-base text-black">******</Text>
          </View>
        </View>

        <View className="ml-3 mr-3 mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-gray-500">비밀번호 확인</Text>
          <View className="rounded-xl border border-gray-200 px-5 py-3">
            <Text className="font-notoSansKRRegular text-base text-black">******</Text>
          </View>
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity className="mx-5 mt-20 rounded-full bg-gray-500 py-5 ">
          <Text className="text-center font-notoSansKRRegular text-xl text-white">확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
