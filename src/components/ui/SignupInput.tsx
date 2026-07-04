import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type SignupInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  secureTextEntry?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
};

const SignupInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
  secureTextEntry = false,
  actionLabel,
  onActionPress,
}: SignupInputProps) => {
  return (
    <View className="w-full">
      <Text className="mb-2 font-notoSansKRRegular text-sm text-body">
        {label}
        {required ? <Text className="font-notoSansKRRegular text-pink"> *</Text> : null}
      </Text>

      <View className="h-[68px] flex-row items-center overflow-hidden rounded-[10px] border border-border bg-white">
        <TextInput
          className="h-full flex-1 px-[14px] py-0 font-notoSansKRDemiLight text-[13px] text-black"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          underlineColorAndroid="transparent"
          value={value}
          onChangeText={onChangeText}
        />

        {actionLabel ? (
          <Pressable
            className="h-[68px] w-[98px] items-center justify-center overflow-hidden rounded-[10px]"
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
    </View>
  );
};

export default SignupInput;
