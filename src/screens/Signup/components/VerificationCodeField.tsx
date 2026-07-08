import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { useBlink } from '../hooks/useBlink';

interface VerificationCodeFieldProps {
  label: string;
  placeholder: string;
  value: string;
  remainingLabel: string;
  helperText?: string;
  helperVariant?: 'error' | 'success';
  blinkToken?: number;
  onChangeText: (value: string) => void;
}

const VerificationCodeField = ({
  label,
  placeholder,
  value,
  remainingLabel,
  helperText,
  helperVariant = 'error',
  blinkToken,
  onChangeText,
}: VerificationCodeFieldProps) => {
  const flashOn = useBlink(blinkToken);
  const helperColorClassName = helperVariant === 'success' ? 'text-success' : 'text-pink';

  return (
    <View className="w-full">
      <Text
        className="mb-[8px] font-notoSansKRRegular text-sm text-body"
        style={{ includeFontPadding: false }}>
        {label}
        <Text className="text-pink"> *</Text>
      </Text>
      <View className="relative justify-center">
        <TextInput
          autoCapitalize="none"
          className="h-[43.5px] rounded-[9.25px] border border-border bg-white py-0 pl-[14px] pr-[70px] font-notoSansKRDemiLight text-sm text-black"
          keyboardType="number-pad"
          maxLength={6}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={{ includeFontPadding: false, textAlignVertical: 'center' }}
          underlineColorAndroid="transparent"
          value={value}
          onChangeText={onChangeText}
        />
        <Text
          className="absolute right-[14px] font-notoSansKRDemiLight text-sm text-pink"
          style={{ includeFontPadding: false }}>
          {remainingLabel}
        </Text>
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

export default VerificationCodeField;
