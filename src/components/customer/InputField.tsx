import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableNativeFeedback,
  Image,
  Keyboard,
} from 'react-native';
import React from 'react';
import { InputFieldProps } from '@/src/types';
import { TextInput } from 'react-native-paper';

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableNativeFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg mb-3 ${labelStyle}`}>{label}</Text>
          <View
            className={`bg-neutral-100 rounded-full 
          border border-neutral-100 focus:border-primaryColor ${containerStyle}
          `}
          >
            <TextInput
              className={`p-5 text-[15px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
            />
          </View>
        </View>
      </TouchableNativeFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
