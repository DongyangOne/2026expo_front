import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { TabletBackgroundCircles } from '@/components/layout';
import { SignupInput } from '@/components/ui';
import { FONTS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletSignup'>;

const GradientText = ({ label }: { label: string }) => {
  return (
    <Svg height={20} width={80}>
      <Defs>
        <SvgLinearGradient id="back-button-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#7B61FF" />
          <Stop offset="1" stopColor="#FF4FD8" />
        </SvgLinearGradient>
      </Defs>
      <SvgText
        fill="url(#back-button-text-gradient)"
        fontFamily={FONTS.bold}
        fontSize={16}
        textAnchor="middle"
        x={40}
        y={16}>
        {label}
      </SvgText>
    </Svg>
  );
};

const TabletSignup = ({ navigation }: Props) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [affiliation, setAffiliation] = useState('');

  useEffect(() => {
    console.log('TabletSignup window dimensions:', Dimensions.get('window'));
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="min-h-full"
      keyboardShouldPersistTaps="handled">
      <View className="flex-1 overflow-hidden bg-background">
        <TabletBackgroundCircles />

        <SafeAreaView className="flex-1 items-center" edges={['top', 'bottom']}>
          <Text className="mt-[50px] text-center font-notoSansKRBold text-5xl text-black">
            관리자 회원가입
          </Text>

          <View className="mt-[40px] w-[306px]">
            <View className="gap-[19px]">
              <SignupInput
                label="아이디"
                placeholder="아이디를 입력해 주세요"
                required
                actionLabel="중복 확인"
                value={id}
                onChangeText={setId}
              />

              <SignupInput
                label="비밀번호"
                placeholder="비밀번호를 입력해 주세요"
                required
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <SignupInput
                label="비밀번호 확인"
                placeholder="비밀번호를 입력해 주세요"
                required
                secureTextEntry
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
              />

              <SignupInput
                label="소속"
                placeholder="소속을 입력해 주세요"
                required
                value={affiliation}
                onChangeText={setAffiliation}
              />
            </View>

            <Pressable className="mt-[43px] h-[68px] items-center justify-center overflow-hidden rounded-[20px]">
              <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
                <Defs>
                  <SvgLinearGradient id="signup-submit-gradient" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#7B61FF" />
                    <Stop offset="1" stopColor="#FF4FD8" />
                  </SvgLinearGradient>
                </Defs>
                <Rect fill="url(#signup-submit-gradient)" height="100%" rx={20} width="100%" />
              </Svg>
              <Text className="font-notoSansKRBold text-[16px] text-white">회원가입</Text>
            </Pressable>

            <Pressable
              className="mx-auto mt-[28px] h-[52px] w-[222px] items-center justify-center overflow-hidden rounded-full bg-background"
              onPress={() => navigation.goBack()}>
              <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
                <Defs>
                  <SvgLinearGradient id="signup-back-border-gradient" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#7B61FF" />
                    <Stop offset="1" stopColor="#FF4FD8" />
                  </SvgLinearGradient>
                </Defs>
                <Rect
                  fill="transparent"
                  height="51"
                  rx={25.5}
                  stroke="url(#signup-back-border-gradient)"
                  strokeWidth="1"
                  width="221"
                  x="0.5"
                  y="0.5"
                />
              </Svg>
              <View className="items-center justify-center">
                <GradientText label="뒤로가기" />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default TabletSignup;
