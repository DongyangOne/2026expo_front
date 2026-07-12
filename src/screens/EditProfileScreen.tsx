import React, { useState } from 'react';
import { cssInterop } from 'nativewind';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/navigation/types';
import { useRoute, RouteProp } from '@react-navigation/native';

type EditProfileRouteProp = RouteProp<RootTabParamList, 'EditProfile'>;

cssInterop(LinearGradient, {
  className: 'style',
});

import ProfileImage from '../assets/images/profile.svg';
import BackArrow from '../assets/images/vector.svg';

const EditProfileScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const route = useRoute<EditProfileRouteProp>();

  const { email } = route.params;

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');

  // 아이디 : 4~12자, 영문 소문자+숫자
  const ID_REGEX = /^(?=.*[a-z])(?=.*\d)[a-z\d]{4,12}$/;

  // 비밀번호 : 8~16자, 영문+숫자+특수문자
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

  const hasSequentialChars = (str: string) => {
    for (let i = 0; i < str.length - 3; i++) {
      const a = str.charCodeAt(i);
      const b = str.charCodeAt(i + 1);
      const c = str.charCodeAt(i + 2);
      const d = str.charCodeAt(i + 3);

      if (b === a + 1 && c === b + 1 && d === c + 1) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = () => {
    if (!ID_REGEX.test(id)) {
      setIdError('최소 4자 이상, 최대 12자 이하, 영문 소문자와 숫자만 사용할 수 있습니다.');
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError('8~16자, 영문/숫자/특수문자를 모두 포함해야 합니다.');
      return;
    }

    if (/[ㄱ-ㅎㅏ-ㅣ가-힣\s]/.test(password)) {
      setPasswordError('한글과 공백은 사용할 수 없습니다.');
      return;
    }

    if (hasSequentialChars(password)) {
      setPasswordError('연속된 문자 또는 숫자는 사용할 수 없습니다.');
      return;
    }

    if (password !== passwordCheck) {
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
      return;
    }

    navigation.navigate('Account');
  };
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="mx-11 flex-1">
        <View className="relative flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            className="absolute left-5 z-10"
            onPress={() => navigation.navigate('Account')}>
            <BackArrow />
          </TouchableOpacity>
          {/* 타이틀 */}
          <Text className="mb-[20px] text-center font-notoSansKRBold text-xl text-black">
            프로필 수정
          </Text>
        </View>

        {/* 프로필 이미지 */}
        <View className="items-center">
          <ProfileImage />
        </View>

        {/* 이름 */}
        <Text className="mt-[35px] text-center font-notoSansKRBold text-xl text-black">최예은</Text>

        {/* 아이디 */}
        <View className="mt-6">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">아이디</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput
              value={id}
              onChangeText={(text) => {
                setId(text);
                setIdError('');
              }}
            />

            {idError !== '' && <Text className="mt-1 text-xs text-red">{idError}</Text>}
          </View>
        </View>

        {/* 이메일 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">이메일</Text>
          <View className="rounded-xl border border-border bg-white px-3 py-4">
            <Text className="font-notoSansKRDemiLight text-sm text-black">{email}</Text>
          </View>
        </View>

        {/* 비밀번호 */}
        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
            />

            {passwordError !== '' && <Text className="mt-1 text-xs text-red">{passwordError}</Text>}
          </View>
        </View>

        <View className="mt-4">
          <Text className="mb-2 font-notoSansKRRegular text-sm text-body">비밀번호 확인</Text>
          <View className="rounded-xl border border-border bg-white px-3">
            <TextInput
              secureTextEntry
              value={passwordCheck}
              onChangeText={(text) => {
                setPasswordCheck(text);
                setPasswordCheckError('');
              }}
            />

            {passwordCheckError !== '' && (
              <Text className="mt-1 text-xs text-red">{passwordCheckError}</Text>
            )}
          </View>
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity className="mx-5 mt-40" onPress={() => handleSubmit()}>
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
