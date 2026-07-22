import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface LoginFieldProps {
  label: string;
  placeholder: string;
  value: string;
  maxLength: number;
  secureTextEntry?: boolean;
  errorText?: string;
  onChangeText: (value: string) => void;
}

const LoginField = ({
  label,
  placeholder,
  value,
  maxLength,
  secureTextEntry = false,
  errorText,
  onChangeText,
}: LoginFieldProps) => {
  return (
    <View className="w-full">
      <Text
        className="mb-[8px] font-notoSansKRRegular text-sm text-body"
        style={{ includeFontPadding: false }}>
        {label}
        <Text className="text-pink"> *</Text>
      </Text>
      <TextInput
        autoCapitalize="none"
        className="h-[45px] rounded-[10px] border border-border bg-white px-[14px] py-0 font-notoSansKRDemiLight text-sm text-black"
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
        className="mt-[2px] h-[14px] font-notoSansKRRegular text-[10px] text-danger"
        minimumFontScale={0.75}
        numberOfLines={1}
        style={{ includeFontPadding: false }}>
        {errorText || ' '}
      </Text>
    </View>
  );
};

export default LoginField;
