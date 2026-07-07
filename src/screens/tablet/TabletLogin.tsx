import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { TabletBackgroundCircles } from '@/components/layout';
import CheckedIcon from '@/components/ui/icons/checked.svg';
import { FONTS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletLogin'>;

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'Admin123!';

type LoginInputProps = {
  label: string;
  placeholder: string;
  value: string;
  maxLength: number;
  secureTextEntry?: boolean;
  errorText?: string;
  onChangeText: (value: string) => void;
};

const LoginInput = ({
  label,
  placeholder,
  value,
  maxLength,
  secureTextEntry = false,
  errorText,
  onChangeText,
}: LoginInputProps) => {
  return (
    <View className="w-full">
      <Text
        className="mb-[5px] font-notoSansKRRegular text-[12px] text-body"
        style={{ lineHeight: 14 }}>
        {label}
        <Text className="text-pink"> *</Text>
      </Text>
      <TextInput
        className="h-[63px] rounded-[10px] border border-border bg-white px-[10px] py-0 font-notoSansKRRegular text-[12px] text-black"
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={onChangeText}
      />
      <Text
        adjustsFontSizeToFit
        className="mt-[3px] h-[21px] font-notoSansKRRegular text-sm text-danger"
        minimumFontScale={0.75}
        numberOfLines={1}>
        {errorText || ' '}
      </Text>
    </View>
  );
};

const SignupGradientText = () => {
  return (
    <Svg height={22} width={62}>
      <Defs>
        <LinearGradient id="login-signup-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#7B61FF" />
          <Stop offset="1" stopColor="#FF4FD8" />
        </LinearGradient>
      </Defs>
      <SvgText
        fill="url(#login-signup-text-gradient)"
        fontFamily={FONTS.bold}
        fontSize={15}
        textAnchor="middle"
        x={31}
        y={16}>
        회원가입
      </SvgText>
    </Svg>
  );
};

const TabletLogin = ({ navigation }: Props) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const idError = useMemo(() => {
    if (!id) {
      return '아이디를 입력해 주세요.';
    }

    return '';
  }, [id]);

  const passwordError = useMemo(() => {
    if (!password) {
      return '비밀번호를 입력해 주세요.';
    }

    return '';
  }, [password]);

  const handleSubmit = () => {
    setSubmitAttempted(true);

    if (idError || passwordError) {
      return;
    }

    if (id !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      ToastAndroid.show('아이디/비밀번호 가 맞지 않습니다.', ToastAndroid.SHORT);
      return;
    }

    navigation.replace('TabletReport');
  };

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <TabletBackgroundCircles />
      <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
        <View className="mt-[50px] ">
          <Text className="mb-[100px] text-center font-notoSansKRBold text-5xl text-black">
            관리자 로그인
          </Text>
          <View className="w-[288px]">
            <LoginInput
              label="아이디"
              placeholder="아이디를 입력해 주세요."
              maxLength={12}
              value={id}
              errorText={submitAttempted ? idError : ''}
              onChangeText={(value) => setId(value.replace(/[^a-z0-9]/g, ''))}
            />

            <View>
              <LoginInput
                label="비밀번호"
                placeholder="비밀번호를 입력해 주세요."
                maxLength={16}
                secureTextEntry
                value={password}
                errorText={submitAttempted ? passwordError : ''}
                onChangeText={(value) => setPassword(value.replace(/[^\x21-\x7E]/g, ''))}
              />
            </View>
          </View>

          <Pressable
            className="mt-[5px] flex-row items-center self-start"
            hitSlop={8}
            onPress={() => setAutoLogin((current) => !current)}>
            <View
              className={`h-[16px] w-[16px] items-center justify-center rounded-[4px] ${
                autoLogin ? 'bg-purple' : 'border border-border bg-white'
              }`}>
              {autoLogin ? <CheckedIcon height={9} width={10} /> : null}
            </View>
            <Text className="ml-[5px] font-notoSansKRRegular text-[14px] text-body">
              자동 로그인
            </Text>
          </Pressable>

          <Pressable
            className="mt-[27px] h-[63px] items-center justify-center overflow-hidden rounded-[20px]"
            onPress={handleSubmit}>
            <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
              <Defs>
                <LinearGradient id="login-submit-gradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#7B61FF" />
                  <Stop offset="1" stopColor="#FF4FD8" />
                </LinearGradient>
              </Defs>
              <Rect fill="url(#login-submit-gradient)" height="100%" rx={14} width="100%" />
            </Svg>
            <Text className="font-notoSansKRBold text-[15px] text-white">로그인</Text>
          </Pressable>

          <View className="mt-[22px] flex-row items-center justify-center">
            <Text className="font-notoSansKRDemiLight text-[15px] text-gray">
              계정이 없으신가요?
            </Text>
            <Pressable
              className="ml-[16px] h-[24px] justify-center"
              hitSlop={8}
              onPress={() => navigation.replace('TabletSignup')}>
              <SignupGradientText />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TabletLogin;
