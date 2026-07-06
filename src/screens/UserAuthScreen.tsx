import React from 'react';
import { cssInterop } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';
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
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F5F5F5] px-5 pt-6">
      <View className="relative flex-row items-center justify-center">
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity className="absolute left-5 z-10" onPress={() => navigation.goBack()}>
          <BackArrow />
        </TouchableOpacity>
        {/* 타이틀 */}
        <Text className="text-center font-notoSansKRBold text-2xl text-black">사용자 인증</Text>
      </View>

      {/* 아이디 */}
      <View className="ml-3 mr-3 mt-6">
        <Text className="mb-2 mt-40 font-notoSansKRRegular text-lg text-body">아이디</Text>
        <View className="rounded-xl border border-border bg-white px-4 py-3">
          <Text className="font-notoSansKRRegular text-lg text-black">cye4526</Text>
        </View>
      </View>

      {/* 이메일 */}
      <View className="ml-3 mr-3 mt-4">
        <Text className="mb-2 font-notoSansKRRegular text-lg text-black">이메일</Text>
        <View className="flex-row">
          <View className="flex-1 flex-row items-center justify-between rounded-l-xl border border-border bg-white px-5 py-3">
            <Text className="font-notoSansKRRegular text-lg text-black">cye4526@naver.com</Text>
          </View>
          <TouchableOpacity className="-ml-2 rounded-xl bg-gray px-5 py-3">
            <Text className="text-base text-white">전송</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 인증 코드 */}
      <View className="ml-3 mr-3 mt-6">
        <Text className="mb-2 font-notoSansKRRegular text-lg text-body">인증 코드</Text>
        <View className="flex-row items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-5 py-3">
          <Text className="font-notoSansKRRegular text-lg text-[#4B5563]">111111</Text>
          <Text className="text-red-500 font-notoSansKRRegular text-lg">05:00</Text>
        </View>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity className="mx-5 mt-40" onPress={handleEditProfile}>
        <LinearGradient
          colors={['#7B61FF', '#FF4FD8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="mx-7 items-center justify-center rounded-full py-5">
          <Text className="text-center font-notoSansKRRegular text-xl text-white">확인</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UserAuthScreen;
