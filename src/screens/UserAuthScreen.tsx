import React from 'react';
import { cssInterop } from 'nativewind';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

cssInterop(LinearGradient, {
  className: 'style',
});
import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '../assets/images/vector.svg';

const UserAuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleEditProfile = () => navigation.navigate('EditProfile');
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary-backgorund">
      <View className="mx-11 flex-1">
        <View className="relative flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-0">
            <BackArrow />
          </TouchableOpacity>
          {/* 타이틀 */}
          <Text className="text-center font-notoSansKRBold text-xl text-black">사용자 인증</Text>
        </View>

        {/* 아이디 */}
        <View className="mt-52">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">아이디</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput className="text-sm text-black" placeholder="cye4526"></TextInput>
          </View>
        </View>

        {/* 이메일 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-black">이메일</Text>
          <View className="flex-row">
            <View className="flex-1 flex-row items-center justify-between rounded-l-xl border border-border bg-white px-3">
              <TextInput placeholder="cye4526@naver.com" className="text-sm text-black"></TextInput>
            </View>
            <TouchableOpacity className="-ml-2 rounded-xl bg-gray px-5 py-3">
              <Text className="text-sm text-white">전송</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 인증 코드 */}
        <View className="mt-5">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">인증 코드</Text>
          <View className="flex-row items-center justify-between rounded-xl border border-border bg-white px-3">
            <TextInput placeholder="111111" className="text-sm text-black"></TextInput>
            <Text className="font-notoSansKRRegular text-sm text-red">05:00</Text>
          </View>
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity className="mx-5 mt-40" onPress={handleEditProfile}>
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

export default UserAuthScreen;
