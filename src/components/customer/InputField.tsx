import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { InputFieldProps } from '@/src/types';

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
              className={`text-base mb-2 font-semibold text-gray-700 ${labelStyle || ''}`}
            >
              {label}
            </Text>
          )}
          <View className={`px-3 py-[10px] bg-gray-200 rounded-2xl mx-2 flex-row items-center ${inputStyle || ''}`}>
            {leftIcon && (
              <View className="mx-2">
                {leftIcon}
              </View>
            )}
            <TextInput
              placeholder={placeholder}
              autoCapitalize="none"
             className='flex-1 text-lg bg-gray-200 '
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
