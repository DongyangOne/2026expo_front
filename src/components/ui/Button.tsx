import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const VARIANT_STYLES = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  danger: 'bg-danger',
} as const;

const Button = ({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`items-center justify-center rounded-lg px-6 py-3
        ${VARIANT_STYLES[variant]}
        ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Text className="text-base font-notoSansKRSemiBold text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
