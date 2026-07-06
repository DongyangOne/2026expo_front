import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import ProfileImage from '../assets/images/profile.svg';
import Arrow from '../assets/images/arrow.svg';

const AccountScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCheck = () => navigation.navigate('UserAuth');
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary-backgorund px-5 pt-6">
      {/* 타이틀 */}
      <Text className="text-center font-notoSansKRBold text-2xl text-black">프로필</Text>

      {/* 프로필 이미지 */}
      <View className="my-5 items-center">
        <ProfileImage width={115} height={115} />
      </View>

      {/* 이름 */}
      <Text className="mt-4 text-center font-notoSansKRBold text-2xl text-black">최예은</Text>

      {/* 아이디 */}
      <View className="ml-3 mr-3 mt-6">
        <Text className="mb-2 font-notoSansKRRegular text-lg text-body">아이디</Text>
        <View className="rounded-xl border border-border bg-white px-5 py-3">
          <Text className="font-notoSansKRRegular text-lg text-black">cye4526</Text>
        </View>
      </View>

      {/* 이메일 */}
      <View className="ml-3 mr-3 mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-lg text-[#4B5563]">이메일</Text>
        <View className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-3">
          <Text className="font-notoSansKRRegular text-lg text-black">cye4526@naver.com</Text>
        </View>
      </View>

      {/* 프로필 수정 / 로그아웃 */}
      <TouchableOpacity
        className="mx-3 mt-28 flex-row items-center justify-between rounded-xl border border-border bg-white px-5 py-3"
        onPress={handleCheck}>
        <Text className="font-notoSansKRRegular text-base text-body">프로필 수정</Text>
        <Arrow></Arrow>
      </TouchableOpacity>

      <TouchableOpacity className="ml-3 mr-3 mt-3 flex-row items-center justify-between rounded-xl border border-border bg-white px-5 py-3">
        <Text className="font-notoSansKRRegular text-base text-body">로그아웃</Text>
        <Arrow></Arrow>
      </TouchableOpacity>

      {/* 회원 탈퇴 */}
      <TouchableOpacity>
        <Text className="mt-14 text-center font-notoSansKRBold text-lg text-[#4B5563]">
          회원 탈퇴
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountScreen;
