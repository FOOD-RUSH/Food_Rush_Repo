import { View, Text } from 'react-native';
import React from 'react';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { InputFieldProps } from '@/src/types';

const InputField = ({
  inputStyle,
  labelStyle,
  label,
  error,
  placeholder,
  leftIcon,
  rightIcon,
  errorMessage,
  ...props
}: InputFieldProps & { errorMessage?: string }) => {
  const { colors } = useTheme();

  return (
    <View className="mb-4">
      {/* Label */}
      {label && (
        <Text
          className={`text-base mb-2 font-semibold ${labelStyle || ''}`}
          style={{ color: colors.onSurface }}
        >
          {label}
        </Text>
      )}

      <TextInput
        placeholder={placeholder}
        mode="outlined"
        left={leftIcon ? <TextInput.Icon icon={() => leftIcon} /> : undefined}
        right={
          rightIcon ? <TextInput.Icon icon={() => rightIcon} /> : undefined
        }
        outlineStyle={{
          borderRadius: 16,
          borderColor: error ? colors.error : colors.surfaceVariant,
        }}
        style={{ backgroundColor: colors.surfaceVariant }}
        contentStyle={{
          paddingHorizontal: 16,
          color: colors.onSurfaceVariant,
        }}
        error={!!error}
        value={props.value}
        onChangeText={props.onChangeText}
        keyboardType={props.keyboardType}
        autoCapitalize={props.autoCapitalize}
        autoComplete={props.autoComplete}
        autoCorrect={props.autoCorrect}
        secureTextEntry={props.secureTextEntry}
        editable={props.editable}
        maxLength={props.maxLength}
      />

      {error && errorMessage && (
        <HelperText type="error" visible={!!error}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
};

export default InputField;
