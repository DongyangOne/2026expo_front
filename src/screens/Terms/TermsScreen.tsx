import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowLeftIcon from '@/components/ui/icons/arrowLeft.svg';
import type { RootStackParamList } from '@/navigation/types';
import GradientButton from '@/screens/Signup/components/GradientButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

const ARTICLES = [
  {
    title: '제 1조 (목적)',
    body: '본 약관은 ONE(이하 "운영자")이 운영하는 OOO 서비스의 이용과 관련하여 운영자와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (서비스 정의)',
    body: 'OOO은 AI 카메라 분리수거 스테이션과 연동해 배출 기록·피드백·퀴즈를 제공하는 재활용 관리 앱입니다.',
  },
  {
    title: '제3조 (이용자의 권리 및 의무)',
    body: '이용자는 본 서비스를 관련 법령 및 서비스 운영 정책에 따라 이용해야 하며, 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.',
  },
  {
    title: '제4조 (서비스 제공 및 변경)',
    body: '운영자는 서비스 운영상 필요에 따라 서비스의 일부 또는 전부를 변경하거나 일시적으로 중단할 수 있습니다.',
  },
  {
    title: '제5조 (책임의 제한)',
    body: '운영자는 서비스 이용 과정에서 발생하는 결과에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.',
  },
  {
    title: '제6조 (분쟁 해결)',
    body: '서비스 이용과 관련하여 발생한 분쟁은 대한민국 법을 따르며, 관할 법원에 따릅니다.',
  },
];

const TermsScreen = ({ navigation, route }: Props) => {
  const handleAgree = () => {
    route.params?.onAgree();
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="h-[100px] flex-row items-center justify-center px-[23px]">
          <Pressable
            className="absolute left-[23px] top-[25px] size-[50px] items-center justify-center"
            hitSlop={8}
            onPress={() => navigation.goBack()}>
            <ArrowLeftIcon height={24} width={24} />
          </Pressable>
          <Text
            className="font-notoSansKRBold text-xl text-black"
            style={{ includeFontPadding: false }}>
            이용약관 동의서
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-[23px]"
          contentContainerStyle={{ paddingTop: 92, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}>
          {ARTICLES.map((article) => (
            <View className="mb-[24px]" key={article.title}>
              <Text
                className="font-notoSansKRDemiLight text-sm text-body"
                style={{ includeFontPadding: false }}>
                {article.title}
              </Text>
              <Text
                className="mt-[2px] font-notoSansKRDemiLight text-sm leading-[20px] text-body"
                style={{ includeFontPadding: false }}>
                {article.body}
              </Text>
            </View>
          ))}
        </ScrollView>

        <GradientButton
          className="mb-[24px] h-[50px] w-[250px] self-center rounded-full"
          gradientId="terms-agree-gradient"
          label="동의"
          radius={25}
          textClassName="font-notoSansKRBold text-[15.5px] text-white"
          onPress={handleAgree}
        />
      </SafeAreaView>
    </View>
  );
};

export default TermsScreen;
