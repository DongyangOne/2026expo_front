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
      <Text className="mb-[8px] font-notoSansKRRegular text-sm text-body">
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
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={onChangeText}
      />
      <Text
        adjustsFontSizeToFit
        className="mt-[3px] h-[18px] font-notoSansKRRegular text-xs text-pink"
        minimumFontScale={0.75}
        numberOfLines={1}>
        {errorText || ' '}
      </Text>
    </View>
  );
};

export default LoginField;
