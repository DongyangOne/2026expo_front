import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import ProfileImage from '../assets/images/profile.svg';

const AccountScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCheck = () => navigation.navigate('UserAuth');
  const handleLogout = () => navigation.navigate('DeleteAccount');
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white px-5 pt-6">
      {/* 타이틀 */}
      <Text className="text-center font-notoSansKRBold text-2xl text-black">프로필</Text>

      {/* 프로필 이미지 */}
      <View className="items-center">
        <ProfileImage width={245} height={163} />
      </View>

      {/* 이름 */}
      <Text className="mt-4 text-center font-notoSansKRBold text-2xl text-black">최예은</Text>

      {/* 아이디 */}
      <View className="ml-3 mr-3 mt-6">
        <Text className="text-gray-500 mb-2 font-notoSansKRRegular text-sm">아이디</Text>
        <View className="border-gray-200 rounded-xl border px-5 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">cye4526</Text>
        </View>
      </View>

      {/* 이메일 */}
      <View className="ml-3 mr-3 mt-4">
        <Text className="text-gray-500 mb-2 font-notoSansKRRegular text-sm">이메일</Text>
        <View className="border-gray-200 rounded-xl border px-5 py-3">
          <Text className="font-notoSansKRRegular text-base text-black">cye4526@naver.com</Text>
        </View>
      </View>

      {/* 프로필 수정 / 로그아웃 */}
      <TouchableOpacity
        className="border-gray-200 ml-3 mr-3 mt-12 flex-row items-center justify-between rounded-xl border px-5 py-3"
        onPress={handleCheck}>
        <Text className="text-gray-500 font-notoSansKRRegular text-base">프로필 수정</Text>
        <Text className="text-gray-500 font-notoSansKRRegular text-2xl">›</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-6 rounded-full bg-purple px-8 py-3"
        onPress={() => navigation.navigate('FindPassword')}
        activeOpacity={0.8}>
        <Text className="font-notoSansKRBold text-base text-white">비밀번호 찾기</Text>
      </TouchableOpacity>

      <TouchableOpacity className="border-gray-200 ml-3 mr-3 mt-3 flex-row items-center justify-between rounded-xl border px-5 py-3">
        <Text className="text-gray-500 font-notoSansKRRegular text-base">로그아웃</Text>
        <Text className="text-gray-500 font-notoSansKRRegular text-2xl">›</Text>
      </TouchableOpacity>

      {/* 회원 탈퇴 */}
      <TouchableOpacity onPress={handleLogout}>
        <Text className="text-gray-400 mt-14 text-center font-notoSansKRRegular text-sm">
          회원 탈퇴
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountScreen;
