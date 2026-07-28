import React from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { useBlink } from '../hooks/useBlink';

interface SignupFieldProps {
  label: string;
  placeholder: string;
  value: string;
  maxLength?: number;
  secureTextEntry?: boolean;
  helperText?: string;
  helperVariant?: 'error' | 'success';
  blinkToken?: number;
  keyboardType?: TextInputProps['keyboardType'];
  onChangeText: (value: string) => void;
}

const SignupField = ({
  label,
  placeholder,
  value,
  maxLength,
  secureTextEntry = false,
  helperText,
  helperVariant = 'error',
  blinkToken,
  keyboardType,
  onChangeText,
}: SignupFieldProps) => {
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
      <TextInput
        autoCapitalize="none"
        className="h-[43.5px] rounded-[9.25px] border border-border bg-white px-[14px] py-0 font-notoSansKRDemiLight text-sm text-black"
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        style={{ includeFontPadding: false, textAlignVertical: 'center' }}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={onChangeText}
      />
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

export default SignupField;
