import React from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type SignupInputMessageVariant = 'error' | 'success';

interface SignupInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  secureTextEntry?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  errorText?: string;
  messageVariant?: SignupInputMessageVariant;
  inputProps?: TextInputProps;
}

const SignupInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
  secureTextEntry = false,
  actionLabel,
  onActionPress,
  errorText,
  messageVariant = 'error',
  inputProps,
}: SignupInputProps) => {
  const messageColorClass = messageVariant === 'success' ? 'text-success' : 'text-danger';

  return (
    <View className="w-full">
      <Text
        className="mb-[5px] font-notoSansKRRegular text-sm text-body"
        style={{ lineHeight: 16 }}>
        {label}
        {required ? <Text className="font-notoSansKRRegular text-pink"> *</Text> : null}
      </Text>

      <View className="h-[63px] flex-row items-center overflow-hidden rounded-[10px] border border-border bg-white">
        <TextInput
          className="h-full flex-1 px-[14px] py-0 font-notoSansKRDemiLight text-[13px] text-black"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          underlineColorAndroid="transparent"
          value={value}
          onChangeText={onChangeText}
          {...inputProps}
        />

        {actionLabel ? (
          <Pressable
            className="h-[63px] w-[98px] items-center justify-center overflow-hidden rounded-[10px]"
            onPress={onActionPress}>
            <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
              <Defs>
                <LinearGradient id="signup-input-action-gradient" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#7B61FF" />
                  <Stop offset="1" stopColor="#FF4FD8" />
                </LinearGradient>
              </Defs>
              <Rect fill="url(#signup-input-action-gradient)" height="100%" rx={10} width="100%" />
            </Svg>
            <Text className="font-notoSansKRRegular text-[15px] text-white">{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text
        adjustsFontSizeToFit
        className={`mt-[3px] h-[21px] font-notoSansKRRegular text-sm ${messageColorClass}`}
        minimumFontScale={0.75}
        numberOfLines={1}>
        {errorText || ' '}
      </Text>
    </View>
  );
};

export default SignupInput;
