import { useAuthStore } from '@/store';
import { logout } from '@/services';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useEffect, useState } from 'react';
import { getProfile } from '@/services';

import ProfileImage from '../assets/images/profile.svg';
import Arrow from '../assets/images/arrow.svg';

interface Profile {
  userId: number;
  profileImageUrl: string;
  name: string;
  loginId: string;
  email: string;
}
const AccountScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.data);
      } catch (e) {
        console.log('에러:', e);
      }
    };
    fetchProfile();
  }, []);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const clearAuth = useAuthStore((state) => state.logout);

  const handleCheck = () => navigation.navigate('UserAuth');
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log('로그아웃 요청s 실패:', err);
    } finally {
      await clearAuth();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };
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
        <Text className="text-center font-notoSansKRBold text-xl text-black">{profile?.name}</Text>

        {/* 아이디 */}
        <View className="mt-7">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">아이디</Text>
          <View className="android:elevation-md rounded-xl border border-border bg-white px-3 shadow-md">
            <Text className="py-3 text-sm text-black">{profile?.loginId}</Text>
          </View>
        </View>

        {/* 이메일 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">이메일</Text>
          <View className="android:elevation-md rounded-xl border border-border bg-white px-3 shadow-md">
            <Text className="py-3 text-sm text-black">{profile?.email}</Text>
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
