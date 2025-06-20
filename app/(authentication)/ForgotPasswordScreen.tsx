import { View, Text } from 'react-native';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { emailValidation } from '@/utils/validation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';

// Move schema outside component to prevent recreation on every render
const schema = yup.object({
  email: emailValidation,
});

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleForgotPassword = useCallback((data: { email: string }) => {
    console.log('Password reset requested for:', data.email);
    // Add your password reset logic here
  }, []);

  const clearEmail = useCallback(() => {
    setValue('email', '', { shouldValidate: true });
  }, [setValue]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white px-6 py-8">
        {/* Header Section */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 leading-tight">
            Forgot your Password?
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            Enter your email so we can send you a verification link
          </Text>
        </View>

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Email Address
              </Text>
              <TextInput
                placeholder="Enter your email address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                outlineStyle={{ borderRadius: 12 }}
                style={{ backgroundColor: 'white' }}
                contentStyle={{ paddingHorizontal: 16 }}
                error={!!errors.email}
                right={
                  value ? (
                    <TextInput.Icon
                      icon="close-circle-outline"
                      onPress={clearEmail}
                    />
                  ) : null
                }
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email?.message || ''}
              </HelperText>
            </View>
          )}
        />

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(handleForgotPassword)}
          loading={isSubmitting}
          disabled={isSubmitting}
          buttonColor="#007aff"
          textColor="white"
          contentStyle={{ paddingVertical: 8 }}
          style={{ borderRadius: 12 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          {isSubmitting ? 'Sending...' : 'Continue'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
