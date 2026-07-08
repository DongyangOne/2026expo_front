import React from 'react';
import { cssInterop } from 'nativewind';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

cssInterop(LinearGradient, {
  className: 'style',
});

import type { RootStackParamList } from '@/navigation/types';
import ProfileImage from '../assets/images/profile.svg';
import BackArrow from '../assets/images/vector.svg';

const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary-backgorund">
      <View className="mx-11 flex-1">
        <View className="relative flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity className="absolute left-5 z-10" onPress={() => navigation.goBack()}>
            <BackArrow />
          </TouchableOpacity>
          {/* 타이틀 */}
          <Text className="text-center font-notoSansKRBold text-xl text-black">프로필 수정</Text>
        </View>

        {/* 프로필 이미지 */}
        <View className="items-center">
          <ProfileImage />
        </View>

        {/* 이름 */}
        <Text className="mt-4 text-center font-notoSansKRBold text-xl text-black">최예은</Text>

        {/* 아이디 */}
        <View className="mt-6">
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

        {/* 비밀번호 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput className="text-sm text-black" placeholder="*****1"></TextInput>
          </View>
        </View>

        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호 확인</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput className="text-sm text-black" placeholder="*****1"></TextInput>
          </View>
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity className="mx-5 mt-40" onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#7B61FF', '#FF4FD8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="mx-7 items-center justify-center rounded-full py-5">
            <Text className="text-center font-notoSansKRBold text-base text-white">확인</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
