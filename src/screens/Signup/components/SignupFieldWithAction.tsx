import React from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { useBlink } from '../hooks/useBlink';
import GradientButton from './GradientButton';

interface SignupFieldWithActionProps {
  label: string;
  placeholder: string;
  value: string;
  actionLabel: string;
  gradientId: string;
  maxLength?: number;
  helperText?: string;
  helperVariant?: 'error' | 'success';
  blinkToken?: number;
  actionDisabled?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  onChangeText: (value: string) => void;
  onPressAction: () => void;
}

const SignupFieldWithAction = ({
  label,
  placeholder,
  value,
  actionLabel,
  gradientId,
  maxLength,
  helperText,
  helperVariant = 'error',
  blinkToken,
  actionDisabled = false,
  keyboardType,
  onChangeText,
  onPressAction,
}: SignupFieldWithActionProps) => {
  const flashOn = useBlink(blinkToken);
  const helperColorClassName = helperVariant === 'success' ? 'text-success' : 'text-error';

  return (
    <View className="w-full">
      <Text
        className="mb-[6px] font-notoSansKRRegular text-sm text-body"
        style={{ includeFontPadding: false }}>
        {label}
        <Text className="text-pink"> *</Text>
      </Text>
      <View className="relative">
        <TextInput
          autoCapitalize="none"
          className="h-[43.5px] rounded-[9.25px] border border-border bg-white py-0 pl-[14px] pr-[110px] font-notoSansKRDemiLight text-sm text-black"
          keyboardType={keyboardType}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={{ includeFontPadding: false, textAlignVertical: 'center' }}
          underlineColorAndroid="transparent"
          value={value}
          onChangeText={onChangeText}
        />
        <GradientButton
          className="absolute right-0 top-0 h-[45px] w-[98px] rounded-[10px]"
          disabled={actionDisabled}
          gradientId={gradientId}
          label={actionLabel}
          radius={10}
          onPress={onPressAction}
        />
      </View>
      <Text
        adjustsFontSizeToFit
        className={`mt-[2px] h-[14px] font-notoSansKRRegular text-[10px] ${helperColorClassName} ${
          flashOn ? 'opacity-30' : 'opacity-100'
        }`}
        minimumFontScale={0.75}
        numberOfLines={1}
        style={{ includeFontPadding: false }}>
        {helperText || ' '}
      </Text>
    </View>
  );
};

export default SignupFieldWithAction;
