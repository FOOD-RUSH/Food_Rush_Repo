import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextInput, HelperText, IconButton } from 'react-native-paper';
import { navigate } from '@/navigation/navigationHelpers';

// Validation schema
const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = useCallback(async (data: ResetPasswordForm) => {
    try {
      console.log('Password reset:', data);
      // Add your password reset API call here
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const goBack = useCallback(() => {
    // Handle navigation back
    console.log('Go back');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-2">
          {/* Back Button */}
          <View className="mb-6">
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#000000"
              className="self-start -ml-2"
              onPress={goBack}
            />
          </View>

          {/* Header Section */}
          <View className="mb-10">
            <Text className="text-3xl font-bold text-black text-center mb-2">
              Reset Password
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              Enter your email address and we will send you a{'\n'}code to reset
              your password
            </Text>
          </View>

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-6">
                <TextInput
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={{ backgroundColor: 'white' }}
                  outlineStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: errors.password ? '#ef4444' : '#e5e7eb',
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                  error={!!errors.password}
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={togglePasswordVisibility}
                    />
                  }
                />
                <HelperText
                  type="error"
                  visible={!!errors.password}
                  className="text-xs mt-1"
                >
                  {errors.password?.message}
                </HelperText>
                <Text className="text-xs text-gray-500 mt-1">
                  Must have at least 8 characters
                </Text>
              </View>
            )}
          />

          {/* Confirm Password Input */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-8">
                <TextInput
                  placeholder="Confirm your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={{ backgroundColor: 'white' }}
                  outlineStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: errors.confirmPassword ? '#ef4444' : '#1E90FF',
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                  error={!!errors.confirmPassword}
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={toggleConfirmPasswordVisibility}
                    />
                  }
                />
                <HelperText
                  type="error"
                  visible={!!errors.confirmPassword}
                  className="text-xs mt-1"
                >
                  {errors.confirmPassword?.message}
                </HelperText>
                <Text className="text-xs text-gray-500 mt-1">
                  Both passwords must match
                </Text>
              </View>
            )}
          />

          {/* Continue Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting || !passwordValue || !confirmPasswordValue}
            buttonColor="#1E90FF"
            textColor="white"
            contentStyle={{ paddingVertical: 8 }}
            style={{ borderRadius: 25 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
