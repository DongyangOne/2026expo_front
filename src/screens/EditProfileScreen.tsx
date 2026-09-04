import React, { useState, useEffect } from 'react';
import { cssInterop } from 'nativewind';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateProfile, getProfile } from '@/services';
import { useAuthStore } from '@/store';

cssInterop(LinearGradient, {
  className: 'style',
});

import ProfileImage from '@/assets/images/profile.svg';
import BackArrow from '@/assets/images/vector.svg';

const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const authUser = useAuthStore((state) => state.authUser);

  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');

  // TODO: 실제 프로필 조회 API로 교체 (예: GET /user/profile)
  // 화면 진입 시 서버에서 현재 아이디/비밀번호를 받아와 TextInput에 채워 넣습니다.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setEmail(res.data.data.email);
        setId(res.data.data.loginId);
      } catch (e) {
        console.log('프로필 조회 실패:', e);
      }
      setPassword('');
      setPasswordCheck('');
    };
    fetchProfile();
  }, []);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const goToAccount = () => {
    navigation.navigate('MobileTabs', { screen: 'Account' });
  };

  const handleSubmit = async () => {
    console.log('handleSubmit 시작, id:', id, 'password:', password);
    // 빈 값 체크 먼저
    if (id.trim() === '') {
      setIdError('아이디를 입력해주세요.');
      return;
    }

    if (!ID_REGEX.test(id)) {
      console.log('ID_REGEX 실패');
      setIdError('최소 4자 이상, 최대 12자 이하, 영문 소문자와 숫자만 사용할 수 있습니다.');
      return;
    }

    if (password.trim() === '') {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      console.log('PASSWORD_REGEX 실패, password:', password);
      setPasswordError('8~16자, 영문/숫자/특수문자를 모두 포함해야 합니다.');
      return;
    }

    if (/[ㄱ-ㅎㅏ-ㅣ가-힣\s]/.test(password)) {
      console.log('한글/공백 포함');
      setPasswordError('한글과 공백은 사용할 수 없습니다.');
      return;
    }

    if (hasSequentialChars(password)) {
      console.log('연속문자 감지, password:', password);
      setPasswordError('연속된 문자 또는 숫자는 사용할 수 없습니다.');
      return;
    }

    if (passwordCheck.trim() === '') {
      console.log('passwordCheck 비어있음');
      setPasswordCheckError('비밀번호 확인을 입력해주세요.');
      return;
    }

    if (password !== passwordCheck) {
      console.log('불일치, password:', password, 'passwordCheck:', passwordCheck);
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('모든 검증 통과, updateProfile 호출 직전');
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const res = await updateProfile({
        loginId: id,
        password,
        passwordConfirm: passwordCheck,
      });
      console.log('updateProfile 응답:', JSON.stringify(res));

      goToAccount();
    } catch (error) {
      console.log('updateProfile 에러:', error);
      const message = error instanceof Error ? error.message : '프로필 수정에 실패했어요.';

      if (message.includes('이미 사용 중인 아이디')) {
        setIdError(message);
      } else {
        setSubmitError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="mx-11 flex-1">
        <View className="relative mt-[37px] flex-row items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity className="absolute left-0" onPress={goToAccount}>
            <BackArrow />
          </TouchableOpacity>
          {/* 타이틀 */}
          <Text className=" text-center font-notoSansKRBold text-xl text-black">프로필 수정</Text>
        </View>

        {/* 프로필 이미지 */}
        <View className="mt-[28px] items-center">
          <ProfileImage />
        </View>

        {/* 이름 */}
        <Text className="mt-[35px] text-center font-notoSansKRBold text-xl text-black">
          {authUser?.username}
        </Text>

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
          </View>
          {idError !== '' && <Text className="mt-1 text-xs text-red">{idError}</Text>}
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
          </View>
          {passwordError !== '' && <Text className="mt-1 text-xs text-red">{passwordError}</Text>}
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
          </View>
          {passwordCheckError !== '' && (
            <Text className="mt-1 text-xs text-red">{passwordCheckError}</Text>
          )}
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity
          className="mx-5 mt-40"
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={isSubmitting ? 1 : 0.7}>
          <LinearGradient
            colors={['#7B61FF', '#FF4FD8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="mx-7 items-center justify-center rounded-full py-5"
            style={{ opacity: isSubmitting ? 0.6 : 1 }}>
            <Text className="text-center font-notoSansKRBold text-base text-white">확인</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 서버 에러 메시지 */}
        {submitError !== '' && (
          <Text className="mx-5 mt-2 text-center text-xs text-red">{submitError}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
