import React from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GradientButton, GradientBorderButton } from '@/components/ui';
import UserIcon from '@/assets/icons/usericon.svg';
import type { RootStackParamList } from '@/navigation/types';

type FindIdResultScreenProps = NativeStackScreenProps<RootStackParamList, 'FindIdResult'>;

const FindIdResultScreen = ({ navigation, route }: FindIdResultScreenProps) => {
  const { userId } = route.params;

  return (
    <View className="flex-1 justify-center bg-background px-8">
      <Text className="text-center font-notoSansKRBold text-xl text-black">
        <Text className="text-purple">아이디</Text>를 찾았습니다!
      </Text>
      <Text className="mt-5 text-center font-notoSansKRRegular text-sm text-body">
        회원님의 아이디는 다음과 같습니다.
      </Text>

      <View className="mx-8 mb-10 mt-10 flex-row items-center gap-4 rounded-2xl bg-purple/10 px-10 py-6">
        <UserIcon width={50} height={50} />
        <Text className="ml-5 font-notoSansKRBold text-2xl text-purple">{userId}</Text>
      </View>

      <View className="mt-16 px-10">
        <GradientButton
          label="로그인 하기   →"
          onPress={() => navigation.navigate('Login', { loginId: userId })}
          height={54}
          borderRadius={10}
          fontSize={16}
        />
        <View className="mt-9">
          <GradientBorderButton
            label="비밀번호 찾기   →"
            onPress={() => {}}
            height={54}
            borderRadius={10}
            fontSize={16}
          />
        </View>
      </View>
    </View>
  );
};

export default FindIdResultScreen;
