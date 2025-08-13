import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import React from 'react';
import { InputFieldProps } from '@/src/types';
import { useTheme } from 'react-native-paper';

const InputField = ({
  inputStyle,
  labelStyle,
  label,
  error,
  placeholder,
  leftIcon,
  rightIcon,
  ...props
}: InputFieldProps) => {
  const { colors } = useTheme();
  const backgroundColor = colors.tertiary;
  const textColor = colors.onBackground;
  const placeholderTextColor = colors.onBackground;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full`}>
          {/* Label */}
          {label && (
            <Text
              className={`text-base mb-2 font-semibold ${labelStyle || ''} text-[${textColor}]`}
            >
              {label}
            </Text>
          )}
          <View
            className={`px-4 py-[10px] rounded-2xl mx-2 flex-row items-center ${inputStyle || ''} `}
            style={{backgroundColor: backgroundColor}}
          >
            {leftIcon && <View className="mx-2">{leftIcon}</View>}
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              autoCapitalize="none"
              className={`flex-1 text-lg bg-[${backgroundColor}] text-[${textColor}]`}
            />
            {rightIcon && <View className="mr-2">{rightIcon}</View>}
          </View>
          {/* Input Container */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
