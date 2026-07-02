import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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

      <View className="h-[63px] flex-row items-center overflow-hidden rounded-[10px] border border-border bg-white">
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
            className="h-[63px] w-[98px] overflow-hidden rounded-[10px]"
            onPress={onActionPress}>
            <LinearGradient
              className="h-full w-full items-center justify-center"
              colors={['#7B61FF', '#FF4FD8']}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}>
              <Text className="font-notoSansKRRegular text-[15px] text-white">{actionLabel}</Text>
            </LinearGradient>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default SignupInput;
