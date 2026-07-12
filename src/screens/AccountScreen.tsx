import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/navigation/types';

import ProfileImage from '../assets/images/profile.svg';
import Arrow from '../assets/images/arrow.svg';

const AccountScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const handleCheck = () => navigation.navigate('UserAuth');
  return (
    <SafeAreaView edges={['top']} className="bg-primary-backgorund flex-1">
      <View className="mx-11 flex-1">
        {/* 타이틀 */}
        <Text className="mb-5 mt-11 text-center font-notoSansKRBold text-xl text-black">
          프로필
        </Text>

        {/* 프로필 이미지 */}
        <View className="mb-9 items-center">
          <ProfileImage />
        </View>

        {/* 이름 */}
        <Text className="text-center font-notoSansKRBold text-xl text-black">최예은</Text>

        {/* 아이디 */}
        <View className="mt-7">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">아이디</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput className="text-sm text-black" placeholder="cye4526"></TextInput>
          </View>
        </View>

        {/* 이메일 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">이메일</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput className="text-sm text-black" placeholder="cye4526@naver.com"></TextInput>
          </View>
        </View>

        {/* 프로필 수정 / 로그아웃 */}
        <TouchableOpacity
          className="mt-20 flex-row items-center justify-between rounded-xl border border-border bg-white px-3 py-4"
          onPress={handleCheck}>
          <Text className="font-notoSansKRDemiLight text-sm text-body">프로필 수정</Text>
          <Arrow></Arrow>
        </TouchableOpacity>

        <TouchableOpacity className="mt-2 flex-row items-center justify-between rounded-xl border border-border bg-white px-3 py-4">
          <Text className="font-notoSansKRDemiLight text-sm text-body">로그아웃</Text>
          <Arrow></Arrow>
        </TouchableOpacity>

        {/* 회원 탈퇴 */}
        <TouchableOpacity>
          <Text className="mt-16 text-center font-notoSansKRBold text-sm text-body">회원 탈퇴</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
