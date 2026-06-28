import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletSignup'>;

const FieldLabel = ({ label, required = false }: { label: string; required?: boolean }) => {
  return (
    <Text className="mb-2 font-notoSansKRBold text-xs text-body">
      {label}
      {required ? <Text className="text-pink">*</Text> : null}
    </Text>
  );
};

const FormInput = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}: {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View className="h-12 justify-center rounded-lg border border-border bg-white">
      <TextInput
        className="h-full px-4 py-0 font-notoSansKRRegular text-sm text-black"
        placeholder={placeholder}
        placeholderTextColor="#B8BEC9"
        secureTextEntry={secureTextEntry}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const TabletSignup = ({ navigation }: Props) => {
  const { width, height } = useWindowDimensions();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const backgroundCircles = useMemo(
    () => [
      {
        color: 'bg-pink',
        hw: [0.32, 0.496],
        anchor: 'top',
        pos: [-0.126, -0.164],
      },
      {
        color: 'bg-pink',
        hw: [0.197, 0.305],
        anchor: 'top',
        pos: [0.021, 0.158],
      },
      {
        color: 'bg-pink',
        hw: [0.055, 0.085],
        anchor: 'top',
        pos: [0.126, 0.55],
      },
      {
        color: 'bg-purple',
        hw: [0.32, 0.496],
        anchor: 'bottom',
        pos: [0.77, -0.158],
      },
      {
        color: 'bg-purple',
        hw: [0.148, 0.23],
        anchor: 'bottom',
        pos: [0.77, 0.17],
      },
      {
        color: 'bg-purple',
        hw: [0.047, 0.075],
        anchor: 'bottom',
        pos: [0.835, 0.45],
      },
    ],
    [],
  );

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="min-h-full"
      keyboardShouldPersistTaps="handled">
      <View className="bg-gray-100 min-h-full overflow-hidden px-5 py-4">
        {backgroundCircles.map((circle, index) => (
          <View
            key={`${circle.color}-${index}`}
            className={`absolute rounded-full ${circle.color} opacity-15`}
            style={{
              height: circle.hw[1] * height,
              width: circle.hw[0] * width,
              left: circle.pos[0] * width,
              ...(circle.anchor === 'top'
                ? { top: circle.pos[1] * height }
                : { bottom: circle.pos[1] * height }),
            }}
          />
        ))}

        <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
          <View className="w-[264px]">
            <Text className="mb-12 text-center font-notoSansKRBold text-4xl text-black">
              관리자 회원가입
            </Text>

            <View className="mb-5">
              <FieldLabel label="아이디" required />
              <View className="flex-row gap-2">
                <View className="w-[176px]">
                  <FormInput
                    placeholder="아이디를 입력해 주세요."
                    value={id}
                    onChangeText={setId}
                  />
                </View>
                <Pressable className="h-12 w-20 items-center justify-center rounded-lg bg-pink">
                  <Text className="font-notoSansKRBold text-xs text-white">중복 확인</Text>
                </Pressable>
              </View>
            </View>

            <View className="mb-5">
              <FieldLabel label="비밀번호" required />
              <FormInput
                placeholder="비밀번호를 입력해 주세요."
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="mb-5">
              <FieldLabel label="비밀번호 확인" required />
              <FormInput
                placeholder="비밀번호를 입력해 주세요."
                secureTextEntry
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
              />
            </View>

            <View className="mb-9">
              <FieldLabel label="소속" required />
              <FormInput
                placeholder="소속을 입력해 주세요."
                value={affiliation}
                onChangeText={setAffiliation}
              />
            </View>

            <Pressable className="h-12 items-center justify-center rounded-xl bg-pink">
              <Text className="font-notoSansKRBold text-sm text-white">회원가입</Text>
            </Pressable>

            <View className="mt-6 flex-row items-center justify-center">
              <Text className="text-gray-400 font-notoSansKRRegular text-xs">
                계정이 있으신가요?
              </Text>
              <Pressable className="ml-4" onPress={() => navigation.navigate('TabletLogin')}>
                <Text className="font-notoSansKRBold text-xs text-pink">로그인</Text>
              </Pressable>
            </View>

            <Pressable
              className="mx-auto mt-6 h-10 w-40 items-center justify-center rounded-full border border-pink bg-white"
              onPress={() => navigation.goBack()}>
              <Text className="font-notoSansKRBold text-xs text-pink">뒤로가기</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
      </ScrollView>
  );
};

export default TabletSignup;
