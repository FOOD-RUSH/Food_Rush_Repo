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
import { useTheme } from '@/src/hooks/useTheme';

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
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? 'bg-gray-200' : 'bg-secondary';
  const textColor = theme === 'light' ? 'text-gray-700' : 'text-text';
  const placeholderTextColor = theme === 'light' ? '#6b7280' : '#94a3b8';

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
              className={`text-base mb-2 font-semibold ${labelStyle || ''} ${textColor}`}>
              {label}
            </Text>
          )}
          <View className={`px-4 py-[10px] rounded-2xl mx-2 flex-row items-center ${inputStyle || ''} ${backgroundColor}`}>
            {leftIcon && (
              <View className="mx-2">
                {leftIcon}
              </View>
            )}
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              autoCapitalize="none"
              className={`flex-1 text-lg ${backgroundColor} ${textColor}`}
            />
            {rightIcon && (
              <View className="mr-2">
                {rightIcon}
              </View>
            )}
          </View>
          {/* Input Container */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
