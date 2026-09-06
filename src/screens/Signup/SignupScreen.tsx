import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AxiosError } from 'axios';

import CheckedIcon from '@/components/ui/icons/checked.svg';
import CheckedActiveIcon from '@/components/ui/icons/checked-active.svg';
import type { RootStackParamList } from '@/navigation/types';
import { checkLoginIdDuplicate, sendVerificationEmail, signup, verifyEmailCode } from '@/services';
import type { ApiResponse } from '@/types';

import GradientButton from './components/GradientButton';
import LoginGradientLink from './components/LoginGradientLink';
import SignupField from './components/SignupField';
import SignupFieldWithAction from './components/SignupFieldWithAction';
import SignupToast from './components/SignupToast';
import VerificationCodeField from './components/VerificationCodeField';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type FieldKey =
  | 'name'
  | 'email'
  | 'code'
  | 'organization'
  | 'id'
  | 'password'
  | 'passwordConfirm'
  | 'agreed';

const EMAIL_CODE_DURATION_SECONDS = 5 * 60;
const TOAST_DURATION_MS = 2500;

const EMAIL_SEND_ERROR_MESSAGE = '인증번호 발송에 실패했습니다.';
const EMAIL_CHECK_ERROR_MESSAGE = '인증번호 확인에 실패했습니다.';
const ID_CHECK_ERROR_MESSAGE = '아이디 중복 확인에 실패했습니다.';
const SIGNUP_ERROR_MESSAGE = '회원가입에 실패했습니다.';

const NAME_PATTERN = /^[가-힣a-zA-Z]{2,8}$/;
const ID_PATTERN = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{4,12}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[\x21-\x7E]{8,16}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const KEYBOARD_ROWS = ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

const hasSequentialPattern = (value: string) => {
  const lower = value.toLowerCase();

  for (let i = 0; i <= lower.length - 4; i += 1) {
    const chunk = lower.slice(i, i + 4);
    const codes = [...chunk].map((char) => char.charCodeAt(0));
    const isAscending = codes.every((code, index) => index === 0 || code === codes[index - 1] + 1);
    const isDescending = codes.every((code, index) => index === 0 || code === codes[index - 1] - 1);

    if (isAscending || isDescending) {
      return true;
    }
  }

  return KEYBOARD_ROWS.some((row) => {
    for (let i = 0; i <= row.length - 4; i += 1) {
      const forward = row.slice(i, i + 4);
      const backward = [...forward].reverse().join('');

      if (lower.includes(forward) || lower.includes(backward)) {
        return true;
      }
    }

    return false;
  });
};

const formatRemainingTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const SignupScreen = ({ navigation, route }: Props) => {
  const socialInfo = route.params;
  const isSocialSignup = !!socialInfo;

  const [name, setName] = useState(socialInfo?.prefillUsername ?? '');
  const [email, setEmail] = useState(socialInfo?.prefillEmail ?? '');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'duplicate' | 'verified'>(
    isSocialSignup ? 'verified' : 'idle',
  );
  const [remainingSeconds, setRemainingSeconds] = useState(EMAIL_CODE_DURATION_SECONDS);
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'mismatch'>('idle');
  const [organization, setOrganization] = useState('');
  const [id, setId] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [idStatus, setIdStatus] = useState<'idle' | 'available' | 'duplicate'>('idle');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [blinkState, setBlinkState] = useState<{ field: FieldKey; token: number } | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isCodeChecking, setIsCodeChecking] = useState(false);
  const [isIdChecking, setIsIdChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameError = useMemo(() => {
    if (!name) {
      return '이름을 입력해 주세요.';
    }

    if (!NAME_PATTERN.test(name)) {
      return '이름은 문자로만 2~8자 입력해 주세요.';
    }

    return '';
  }, [name]);

  const emailFormatError = useMemo(() => {
    if (!email) {
      return '이메일을 입력해 주세요.';
    }

    if (!EMAIL_PATTERN.test(email)) {
      return '올바른 이메일 형식이 아닙니다.';
    }

    return '';
  }, [email]);

  const organizationError = useMemo(() => {
    if (!organization) {
      return '소속을 입력해 주세요.';
    }

    return '';
  }, [organization]);

  const idFormatError = useMemo(() => {
    if (!id) {
      return '아이디를 입력해 주세요.';
    }

    if (!ID_PATTERN.test(id)) {
      return '아이디는 영문 소문자와 숫자를 모두 포함하여 4~12자로 입력해 주세요.';
    }

    return '';
  }, [id]);

  const passwordError = useMemo(() => {
    if (isSocialSignup) {
      return '';
    }

    if (!password) {
      return '비밀번호를 입력해 주세요.';
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return '비밀번호는 영문, 숫자, 특수문자를 모두 포함해 8~16자로 입력해 주세요.';
    }

    if (hasSequentialPattern(password)) {
      return '연속되거나 나열된 문자/숫자는 4자리 이상 사용할 수 없습니다.';
    }

    return '';
  }, [isSocialSignup, password]);

  const nameInvalid = !!nameError;
  const emailInvalid = !!emailFormatError || emailStatus === 'duplicate';
  const emailNotVerified = emailStatus !== 'sent' && emailStatus !== 'verified';
  const codeInvalid = emailStatus !== 'verified';
  const codeExpired = emailStatus === 'sent' && remainingSeconds <= 0;
  const organizationInvalid = !!organizationError;
  const idInvalid = !!idFormatError || idStatus !== 'available';
  const passwordInvalid = !!passwordError;
  const passwordConfirmInvalid =
    !isSocialSignup && (!passwordConfirm || passwordConfirm !== password);
  const agreedInvalid = !agreed;

  const emailHelper = useMemo((): { text: string; variant: 'error' | 'success' } => {
    if (emailStatus === 'duplicate') {
      return { text: '이미 사용중인 이메일 입니다.', variant: 'error' };
    }

    if (emailStatus === 'verified') {
      return { text: '이메일 인증 완료되었습니다.', variant: 'success' };
    }

    if (emailStatus === 'sent') {
      return { text: '인증번호가 전송되었습니다.', variant: 'success' };
    }

    if ((submitAttempted || emailTouched) && emailFormatError) {
      return { text: emailFormatError, variant: 'error' };
    }

    if (submitAttempted && emailNotVerified) {
      return { text: '이메일 인증을 진행해 주세요.', variant: 'error' };
    }

    return { text: '', variant: 'error' };
  }, [emailStatus, submitAttempted, emailTouched, emailFormatError, emailNotVerified]);

  const codeHelper = useMemo((): { text: string; variant: 'error' | 'success' } => {
    if (emailStatus === 'verified') {
      return { text: '이메일 인증이 완료되었습니다.', variant: 'success' };
    }

    if (codeExpired) {
      return { text: '인증 시간이 초과되었습니다. 다시 시도해 주세요.', variant: 'error' };
    }

    if (codeStatus === 'mismatch') {
      return { text: '인증번호가 일치하지 않습니다.', variant: 'error' };
    }

    if (submitAttempted && codeInvalid) {
      return { text: '이메일 인증을 완료해 주세요.', variant: 'error' };
    }

    return { text: '', variant: 'error' };
  }, [emailStatus, codeExpired, codeStatus, submitAttempted, codeInvalid]);

  const idHelper = useMemo((): { text: string; variant: 'error' | 'success' } => {
    if (idStatus === 'duplicate') {
      return { text: '이미 사용중인 아이디 입니다.', variant: 'error' };
    }

    if (idStatus === 'available') {
      return { text: '사용 가능한 아이디 입니다.', variant: 'success' };
    }

    if ((submitAttempted || idTouched) && idFormatError) {
      return { text: idFormatError, variant: 'error' };
    }

    return { text: '', variant: 'error' };
  }, [idStatus, submitAttempted, idTouched, idFormatError]);

  const passwordConfirmHelper = useMemo((): { text: string; variant: 'error' | 'success' } => {
    if (isSocialSignup) {
      return { text: '', variant: 'error' };
    }

    if (!passwordConfirm) {
      return submitAttempted
        ? { text: '비밀번호를 다시 입력해 주세요.', variant: 'error' }
        : { text: '', variant: 'error' };
    }

    if (passwordConfirm !== password) {
      return { text: '비밀번호가 일치하지 않습니다.', variant: 'error' };
    }

    return { text: '비밀번호가 일치합니다.', variant: 'success' };
  }, [isSocialSignup, passwordConfirm, password, submitAttempted]);

  useEffect(() => {
    if (emailStatus !== 'sent' || remainingSeconds <= 0) {
      return;
    }

    const timer = setTimeout(() => setRemainingSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [emailStatus, remainingSeconds]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    setEmailStatus('idle');
    setCode('');
    setCodeStatus('idle');
  };

  const handleChangeId = (value: string) => {
    setId(value.replace(/[^a-z0-9]/g, ''));
    setIdStatus('idle');
  };

  const handleChangeCode = (value: string) => {
    setCode(value.replace(/[^0-9]/g, ''));
    setCodeStatus('idle');
  };

  const handleCodeConfirm = async () => {
    if (code.length !== 6 || codeExpired || isCodeChecking) {
      return;
    }

    setIsCodeChecking(true);

    try {
      const response = await verifyEmailCode({ email, authCode: code });

      if (!response.data.verified) {
        setCodeStatus('mismatch');
        return;
      }

      setEmailStatus('verified');
      setToastMessage(response.data.message || '이메일 인증이 완료되었습니다.');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorCode = axiosError.response?.data.code;

      if (errorCode === 'AUTH_CODE_EXPIRED') {
        setRemainingSeconds(0);
        return;
      }

      if (errorCode === 'AUTH_CODE_MISMATCH') {
        setCodeStatus('mismatch');
        return;
      }

      setToastMessage(axiosError.response?.data.message ?? EMAIL_CHECK_ERROR_MESSAGE);
    } finally {
      setIsCodeChecking(false);
    }
  };

  const handleEmailVerify = async () => {
    setEmailTouched(true);

    if (emailFormatError || isEmailSending) {
      return;
    }

    setIsEmailSending(true);

    try {
      const response = await sendVerificationEmail({ email });
      const remaining = Math.max(
        0,
        Math.round((new Date(response.data.expiredAt).getTime() - Date.now()) / 1000),
      );

      setEmailStatus('sent');
      setRemainingSeconds(remaining);
      setCode('');
      setCodeStatus('idle');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      setToastMessage(axiosError.response?.data.message ?? EMAIL_SEND_ERROR_MESSAGE);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleIdCheck = async () => {
    setIdTouched(true);

    if (idFormatError || isIdChecking) {
      return;
    }

    setIsIdChecking(true);

    try {
      const response = await checkLoginIdDuplicate(id);
      const isDuplicate = response.data.exists === 'Y';

      setIdStatus(isDuplicate ? 'duplicate' : 'available');

      if (!isDuplicate) {
        setToastMessage('아이디 중복 확인 완료');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      setToastMessage(axiosError.response?.data.message ?? ID_CHECK_ERROR_MESSAGE);
    } finally {
      setIsIdChecking(false);
    }
  };

  const getFirstInvalidField = (): FieldKey | null => {
    if (nameInvalid) return 'name';
    if (emailInvalid || emailNotVerified) return 'email';
    if (codeInvalid) return 'code';
    if (organizationInvalid) return 'organization';
    if (idInvalid) return 'id';
    if (passwordInvalid) return 'password';
    if (passwordConfirmInvalid) return 'passwordConfirm';
    if (agreedInvalid) return 'agreed';
    return null;
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    const firstInvalidField = getFirstInvalidField();

    if (firstInvalidField) {
      if (firstInvalidField === 'agreed') {
        setToastMessage('이용약관에 동의해 주세요');
      }

      setBlinkState((current) => ({
        field: firstInvalidField,
        token: current?.field === firstInvalidField ? current.token + 1 : 1,
      }));
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        username: name,
        loginId: id,
        email,
        team: organization,
        agreeTerms: agreed ? ('Y' as const) : ('N' as const),
        social: socialInfo?.socialType ?? ('LOCAL' as const),
        ...(isSocialSignup ? { providerId: socialInfo.socialProviderId } : { password }),
      });

      setToastMessage('가입완료. 다시 로그인 해주세요.');
      setTimeout(() => {
        navigation.replace('SignupComplete');
      }, TOAST_DURATION_MS);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      // TODO: 디버깅용 임시 로그, 확인 후 제거
      console.log('[SignupScreen] signup 요청 실패, status:', axiosError.response?.status);
      console.log('[SignupScreen] signup 요청 실패, response.data:', axiosError.response?.data);
      console.log('[SignupScreen] signup 요청 실패, error.message:', axiosError.message);
      console.log('[SignupScreen] signup 요청 실패, 원본 error:', error);

      const errorCode = axiosError.response?.data.code;

      if (errorCode === 'DUPLICATE_USER') {
        setIdStatus('duplicate');
      }

      if (errorCode === 'DUPLICATE_EMAIL') {
        setEmailStatus('duplicate');
      }

      setToastMessage(axiosError.response?.data.message ?? SIGNUP_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBlinkToken = (field: FieldKey) => (blinkState?.field === field ? blinkState.token : 0);

  const handlePressAgreement = () => {
    if (agreed) {
      setAgreed(false);
      return;
    }

    navigation.navigate('Terms', { onAgree: () => setAgreed(true) });
  };

  const renderAgreementIcon = () => {
    if (agreed) {
      return <CheckedActiveIcon height={16} width={16} />;
    }

    return <CheckedIcon height={16} width={16} />;
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1 px-11"
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text
            className="mb-[28px] text-center font-notoSansKRBold text-xl text-black"
            style={{ includeFontPadding: false }}>
            회원가입
          </Text>

          <SignupField
            blinkToken={getBlinkToken('name')}
            editable={!isSocialSignup}
            helperText={submitAttempted ? nameError : ''}
            label="이름"
            maxLength={8}
            placeholder="이름을 입력해 주세요."
            value={name}
            onChangeText={(value) => setName(value.replace(/[^가-힣ㄱ-ㆎa-zA-Z]/g, ''))}
          />

          <View className="mt-[4px]">
            <SignupFieldWithAction
              actionDisabled={isSocialSignup || isEmailSending}
              actionLabel="이메일 인증"
              blinkToken={getBlinkToken('email')}
              editable={!isSocialSignup}
              gradientId="signup-email-verify-gradient"
              helperText={emailHelper.text}
              helperVariant={emailHelper.variant}
              keyboardType="email-address"
              label="이메일"
              placeholder="이메일을 입력해 주세요."
              value={email}
              onChangeText={handleChangeEmail}
              onPressAction={handleEmailVerify}
            />
          </View>

          {!isSocialSignup && (emailStatus === 'sent' || emailStatus === 'verified') && (
            <View className="mt-[4px]">
              <VerificationCodeField
                actionDisabled={code.length !== 6 || codeExpired || isCodeChecking}
                actionLabel="확인"
                blinkToken={getBlinkToken('code')}
                gradientId="signup-code-confirm-gradient"
                helperText={codeHelper.text}
                helperVariant={codeHelper.variant}
                label="인증번호"
                placeholder="인증번호를 입력해 주세요."
                remainingLabel={
                  emailStatus === 'sent' ? formatRemainingTime(remainingSeconds) : '05:00'
                }
                value={code}
                onChangeText={handleChangeCode}
                onPressAction={handleCodeConfirm}
              />
            </View>
          )}

          <View className="mt-[4px]">
            <SignupField
              blinkToken={getBlinkToken('organization')}
              helperText={submitAttempted ? organizationError : ''}
              label="소속"
              placeholder="소속을 입력해 주세요."
              value={organization}
              onChangeText={setOrganization}
            />
          </View>

          <View className="mt-[4px]">
            <SignupFieldWithAction
              actionDisabled={isIdChecking}
              actionLabel="중복 확인"
              blinkToken={getBlinkToken('id')}
              gradientId="signup-id-check-gradient"
              helperText={idHelper.text}
              helperVariant={idHelper.variant}
              label="아이디"
              maxLength={12}
              placeholder="아이디를 입력해 주세요."
              value={id}
              onChangeText={handleChangeId}
              onPressAction={handleIdCheck}
            />
          </View>

          <View className="mt-[4px]">
            <SignupField
              blinkToken={getBlinkToken('password')}
              editable={!isSocialSignup}
              helperText={submitAttempted ? passwordError : ''}
              label="비밀번호"
              maxLength={16}
              placeholder="비밀번호를 입력해 주세요."
              secureTextEntry
              value={password}
              onChangeText={(value) => setPassword(value.replace(/[^\x21-\x7E]/g, ''))}
            />
          </View>

          <View className="mt-[4px]">
            <SignupField
              blinkToken={getBlinkToken('passwordConfirm')}
              editable={!isSocialSignup}
              helperText={passwordConfirmHelper.text}
              helperVariant={passwordConfirmHelper.variant}
              label="비밀번호 확인"
              maxLength={16}
              placeholder="비밀번호를 다시 입력해 주세요."
              secureTextEntry
              value={passwordConfirm}
              onChangeText={(value) => setPasswordConfirm(value.replace(/[^\x21-\x7E]/g, ''))}
            />
          </View>

          <Pressable
            className="ml-[14px] mt-[3px] flex-row items-center self-start"
            hitSlop={8}
            onPress={handlePressAgreement}>
            {renderAgreementIcon()}
            <Text
              className="ml-[6px] font-notoSansKRDemiLight text-sm text-black"
              style={{ includeFontPadding: false }}>
              이용약관 동의
            </Text>
          </Pressable>

          <GradientButton
            className="mt-[24px] h-[50px] w-[250px] self-center rounded-full"
            disabled={isSubmitting}
            gradientId="signup-submit-gradient"
            label="가입하기"
            radius={25}
            textClassName="font-notoSansKRBold text-[15.5px] text-white"
            onPress={handleSubmit}
          />

          <View className="mt-[18px] flex-row items-center justify-center">
            <Text
              className="font-notoSansKRDemiLight text-sm text-gray"
              style={{ includeFontPadding: false }}>
              이미 계정이 있으신가요?
            </Text>
            <LoginGradientLink onPress={() => navigation.navigate('Login')} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <SignupToast message={toastMessage ?? ''} visible={!!toastMessage} />
    </View>
  );
};

export default SignupScreen;
