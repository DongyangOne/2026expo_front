import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
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
import { checkAdminIdExists, signupAdmin } from '@/services';
import type { ApiResponse } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletSignup'>;

const KEYBOARD_SEQUENCES = ['qwer', 'wert'];
const ID_AVAILABLE_MESSAGE = '사용 가능한 아이디입니다.';
const ID_DUPLICATE_MESSAGE = '이미 사용 중인 아이디입니다.';
const ID_CHECK_REQUIRED_MESSAGE = '중복확인 인증을 해주세요.';
const ID_CHECK_ERROR_MESSAGE = '아이디 중복 확인 중 오류가 발생했습니다.';
const SIGNUP_ERROR_MESSAGE = '회원가입 중 오류가 발생했습니다.';
const SIGNUP_SUCCESS_MESSAGE = '가입완료';

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

const hasSequentialRun = (value: string) => {
  const lowerValue = value.toLowerCase();

  for (let index = 0; index <= lowerValue.length - 4; index += 1) {
    const slice = lowerValue.slice(index, index + 4);
    const chars = [...slice].map((char) => char.charCodeAt(0));
    const isAscending = chars.every((charCode, charIndex) => {
      return charIndex === 0 || charCode === chars[charIndex - 1] + 1;
    });
    const isDescending = chars.every((charCode, charIndex) => {
      return charIndex === 0 || charCode === chars[charIndex - 1] - 1;
    });

    if (isAscending || isDescending || KEYBOARD_SEQUENCES.includes(slice)) {
      return true;
    }
  }

  return false;
};

const validateId = (value: string) => {
  if (!/^[a-z0-9]{4,12}$/.test(value)) {
    return '아이디는 영문 소문자와 숫자 조합으로 4~12자만 입력해 주세요';
  }

  return '';
};

const validatePassword = (value: string) => {
  if (!/^[\x21-\x7E]{8,16}$/.test(value)) {
    return '비밀번호는 영문, 숫자, 특수문자 조합으로 8~16자만 입력해 주세요';
  }

  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
    return '비밀번호에는 영문, 숫자, 특수문자가 모두 포함되어야 합니다';
  }

  if (hasSequentialRun(value)) {
    return '연속된 문자 또는 숫자 4자리 이상은 사용할 수 없습니다';
  }

  return '';
};

const validatePasswordConfirm = (password: string, passwordConfirm: string) => {
  if (!passwordConfirm) {
    return '비밀번호 확인을 입력해 주세요';
  }

  if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다';
  }

  return '';
};

const validateAffiliation = (value: string) => {
  if (!/^[가-힣A-Za-z]{2,20}$/.test(value)) {
    return '소속은 문자만 2~20자로 입력해 주세요';
  }

  return '';
};

const TabletSignup = ({ navigation }: Props) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [idCheckedValue, setIdCheckedValue] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idError = useMemo(() => validateId(id), [id]);
  const passwordError = useMemo(() => validatePassword(password), [password]);
  const passwordConfirmError = useMemo(
    () => validatePasswordConfirm(password, passwordConfirm),
    [password, passwordConfirm],
  );
  const affiliationError = useMemo(() => validateAffiliation(affiliation), [affiliation]);
  const isIdAvailable = idCheckMessage === ID_AVAILABLE_MESSAGE && idCheckedValue === id;

  const handleIdChange = (value: string) => {
    setId(value.replace(/[^a-z0-9]/g, '').slice(0, 12));
    setIdCheckMessage('');
    setIdCheckedValue('');
    setFormMessage('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value.replace(/[^\x21-\x7E]/g, '').slice(0, 16));
    setFormMessage('');
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value.replace(/[^\x21-\x7E]/g, '').slice(0, 16));
    setFormMessage('');
  };

  const handleAffiliationChange = (value: string) => {
    setAffiliation(value.replace(/[^가-힣A-Za-z]/g, '').slice(0, 20));
    setFormMessage('');
  };

  const handleCheckDuplicate = async (): Promise<void> => {
    if (idError || isCheckingId) {
      setIdCheckMessage(idError);
      return;
    }

    setIsCheckingId(true);

    try {
      const existsResponse = await checkAdminIdExists({ adminId: id });

      if (!existsResponse.success) {
        setIdCheckMessage(existsResponse.message || ID_CHECK_ERROR_MESSAGE);
        return;
      }

      setIdCheckedValue(id);
      setIdCheckMessage(
        existsResponse.data.exists === 'Y' ? ID_DUPLICATE_MESSAGE : ID_AVAILABLE_MESSAGE,
      );
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage = axiosError.response?.data.message ?? ID_CHECK_ERROR_MESSAGE;

      setIdCheckMessage(errorMessage);
    } finally {
      setIsCheckingId(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setSubmitAttempted(true);

    if (!idError && !isIdAvailable) {
      setIdCheckMessage(ID_CHECK_REQUIRED_MESSAGE);
      setFormMessage('');
      return;
    }

    if (
      idError ||
      !isIdAvailable ||
      passwordError ||
      passwordConfirmError ||
      affiliationError ||
      isSubmitting
    ) {
      setFormMessage('입력칸에 내용을 입력해 주세요');
      return;
    }

    setIsSubmitting(true);
    setFormMessage('');

    try {
      const signupResponse = await signupAdmin({
        adminId: id,
        adminPassword: password,
        team: affiliation,
      });

      if (!signupResponse.success) {
        setFormMessage(signupResponse.message || SIGNUP_ERROR_MESSAGE);
        return;
      }

      ToastAndroid.show(SIGNUP_SUCCESS_MESSAGE, ToastAndroid.SHORT);
      Alert.alert(SIGNUP_SUCCESS_MESSAGE, undefined, [
        {
          text: '확인',
          onPress: () => navigation.replace('TabletLogin'),
        },
      ]);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage = axiosError.response?.data.message ?? SIGNUP_ERROR_MESSAGE;

      setFormMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <View className="gap-0">
              <SignupInput
                label="아이디"
                placeholder="아이디를 입력해 주세요"
                required
                actionLabel={isCheckingId ? '확인 중' : '중복 확인'}
                value={id}
                errorText={idCheckMessage || (submitAttempted ? idError : '')}
                messageVariant={isIdAvailable ? 'success' : 'error'}
                inputProps={{ autoCapitalize: 'none', maxLength: 12 }}
                onActionPress={handleCheckDuplicate}
                onChangeText={handleIdChange}
              />

              <SignupInput
                label="비밀번호"
                placeholder="비밀번호를 입력해 주세요"
                required
                secureTextEntry
                value={password}
                errorText={submitAttempted ? passwordError : ''}
                inputProps={{ autoCapitalize: 'none', maxLength: 16 }}
                onChangeText={handlePasswordChange}
              />

              <SignupInput
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력해 주세요"
                required
                secureTextEntry
                value={passwordConfirm}
                errorText={submitAttempted ? passwordConfirmError : ''}
                inputProps={{ autoCapitalize: 'none', maxLength: 16 }}
                onChangeText={handlePasswordConfirmChange}
              />

              <SignupInput
                label="소속"
                placeholder="소속을 입력해 주세요"
                required
                value={affiliation}
                errorText={submitAttempted ? affiliationError : ''}
                inputProps={{ maxLength: 20 }}
                onChangeText={handleAffiliationChange}
              />
            </View>

            <Pressable
              className="mt-[30px] h-[68px] items-center justify-center overflow-hidden rounded-[20px]"
              disabled={isSubmitting}
              onPress={handleSubmit}>
              <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
                <Defs>
                  <SvgLinearGradient id="signup-submit-gradient" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#7B61FF" />
                    <Stop offset="1" stopColor="#FF4FD8" />
                  </SvgLinearGradient>
                </Defs>
                <Rect fill="url(#signup-submit-gradient)" height="100%" rx={20} width="100%" />
              </Svg>
              <Text className="font-notoSansKRBold text-[16px] text-white">
                {isSubmitting ? '가입 중' : '회원가입'}
              </Text>
            </Pressable>

            <Text className="h-[18px] text-center font-notoSansKRRegular text-sm text-danger">
              {formMessage || ' '}
            </Text>

            <Pressable
              className="mx-auto mt-[28px] h-[52px] w-[222px] items-center justify-center overflow-hidden rounded-full bg-background"
              onPress={() => navigation.replace('TabletLogin')}>
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
