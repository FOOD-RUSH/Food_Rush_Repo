import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextInput, HelperText, IconButton } from 'react-native-paper';

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const emailValue = watch('email');

  const handleForgotPassword = useCallback(async (data: ForgotPasswordForm) => {
    try {
      console.log('Password reset requested for:', data.email);
      // Add your password reset API call here
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  }, []);

  const clearEmail = useCallback(() => {
    setValue('email', '', { shouldValidate: false });
  }, [setValue]);

  const goBack = useCallback(() => {
    // Handle navigation back
    console.log('Go back');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-2">
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
            Enter your email address and we'll send you a{'\n'}code to reset your password
          </Text>
        </View>

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-8">
              <TextInput
                placeholder="Enter your email address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                style={{ backgroundColor: 'white' }}
                outlineStyle={{ 
                  borderRadius: 12, 
                  borderWidth: 1,
                  borderColor: errors.email ? '#ef4444' : '#e5e7eb'
                }}
                contentStyle={{ 
                  paddingHorizontal: 16, 
                  paddingVertical: 16 
                }}
                error={!!errors.email}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  value ? (
                    <TextInput.Icon
                      icon="eye"
                      onPress={clearEmail}
                    />
                  ) : null
                }
              />
              <HelperText type="error" visible={!!errors.email} className="text-xs mt-1">
                {errors.email?.message}
              </HelperText>
              <Text className="text-xs text-gray-500 mt-1">
                Must have at least 8 characters
              </Text>
            </View>
          )}
        />

        {/* Continue Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(handleForgotPassword)}
          loading={isSubmitting}
          disabled={isSubmitting || !emailValue}
          buttonColor="#1E90FF"
          textColor="white"
          contentStyle={{ paddingVertical: 8 }}
          style={{ borderRadius: 25 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
