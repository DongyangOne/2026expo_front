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
  const handleLogout = () => navigation.navigate('Login');
  const handleDeleteAccount = () => navigation.navigate('DeleteAccount');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="mx-11 flex-1">
        {/* 타이틀 */}
        <Text
          className="mb-5 mt-11 text-center font-notoSansKRBold text-xl text-black"
          style={{
            textShadowColor: 'rgba(17, 24, 39, 0.25)',
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 3,
          }}>
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
          <View className="android:elevation-md rounded-xl border border-border bg-white px-3 shadow-md">
            <Text className="py-3 text-sm text-black">cye4526</Text>
          </View>
        </View>

        {/* 이메일 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">이메일</Text>
          <View className="android:elevation-md rounded-xl border border-border bg-white px-3 shadow-md">
            <Text className="py-3 text-sm text-black">cye4526@naver.com</Text>
          </View>
        </View>

        {/* 프로필 수정 / 로그아웃 */}
        <TouchableOpacity
          className="android:elevation-md mt-20 flex-row items-center justify-between rounded-xl border border-border bg-white px-3 py-4 shadow-md"
          onPress={handleCheck}>
          <Text className="font-notoSansKRDemiLight text-sm text-body">프로필 수정</Text>
          <Arrow></Arrow>
        </TouchableOpacity>

        <TouchableOpacity
          className="android:elevation-md mt-2 flex-row items-center justify-between rounded-xl border border-border bg-white px-3 py-4 shadow-md"
          onPress={handleLogout}>
          <Text className="font-notoSansKRDemiLight text-sm text-body">로그아웃</Text>
          <Arrow></Arrow>
        </TouchableOpacity>

        {/* 회원 탈퇴 */}
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text
            className="mt-16 text-center font-notoSansKRBold text-sm text-body"
            style={{
              textShadowColor: 'rgba(17, 24, 39, 0.25)',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 3,
            }}>
            회원 탈퇴
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
