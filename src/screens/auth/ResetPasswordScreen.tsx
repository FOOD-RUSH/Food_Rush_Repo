import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextInput, HelperText, IconButton } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

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
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-background';
  const textColor = theme === 'light' ? 'text-black' : 'text-text';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-text-secondary';
  const inputBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const inputBorderColor = (error: boolean) => error ? '#ef4444' : (theme === 'light' ? '#e5e7eb' : '#334155');
  const primaryColor = theme === 'light' ? '#1E90FF' : '#3b82f6';

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
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-2">
          {/* Back Button */}
          <View className="mb-6">
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={theme === 'light' ? '#000000' : 'white'}
              className="self-start -ml-2"
              onPress={goBack}
            />
          </View>

          {/* Header Section */}
          <View className="mb-10">
            <Text className={`text-3xl font-bold text-center mb-2 ${textColor}`}>
              Reset Password
            </Text>
            <Text className={`text-sm text-center leading-5 ${secondaryTextColor}`}>
              Enter your email address and we will send you code to reset
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
                  style={{ backgroundColor: inputBackgroundColor }}
                  outlineStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: inputBorderColor(!!errors.password),
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                  error={!!errors.password}
                  left={<TextInput.Icon icon="lock-outline" color={theme === 'light' ? 'black' : 'white'} />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={togglePasswordVisibility}
                      color={theme === 'light' ? 'black' : 'white'}
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
                <Text className={`text-xs mt-1 ${secondaryTextColor}`}>
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
                  style={{ backgroundColor: inputBackgroundColor }}
                  outlineStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: inputBorderColor(!!errors.confirmPassword),
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                  error={!!errors.confirmPassword}
                  left={<TextInput.Icon icon="lock-outline" color={theme === 'light' ? 'black' : 'white'} />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={toggleConfirmPasswordVisibility}
                      color={theme === 'light' ? 'black' : 'white'}
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
                <Text className={`text-xs mt-1 ${secondaryTextColor}`}>
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
            buttonColor={primaryColor}
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
