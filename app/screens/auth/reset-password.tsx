import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, HelperText, TextInput } from 'react-native-paper';

const ResetPasswordScreen = () => {
  interface ResetPassword {
    password: string;
    confirmPassword: string;
  }

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirmation required'),
  });
  // state variable
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //
  const onSubmit = (data: ResetPassword) => {
    console.log('Form Data:', data);
    // Add API call or logic to handle password reset here
  };
  // form controller for reset password
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <ScrollView className="bg-white flex-1 ">
      <View className="px-6 py-8">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 leading-tight">
            Reset your Password
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            your new password must be different from the old password
          </Text>
        </View>
        <Controller
          key="formPassword"
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Password
              </Text>
              <TextInput
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                outlineStyle={{ borderRadius: 12 }}
                style={{ backgroundColor: 'white' }}
                contentStyle={{ paddingHorizontal: 16 }}
                error={!!errors.password}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.password && (
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password.message}
                </HelperText>
              )}
            </View>
          )}
        />
        {/* confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Confirm Password
              </Text>
              <TextInput
                placeholder="Confirm your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                outlineStyle={{ borderRadius: 12 }}
                style={{ backgroundColor: 'white' }}
                contentStyle={{ paddingHorizontal: 16 }}
                error={!!errors.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          buttonColor="#007aff"
          contentStyle={{ paddingVertical: 12 }}
          style={{ borderRadius: 12, marginTop: 8 }}
          labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
        >
          Reset Password
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResetPasswordScreen;
