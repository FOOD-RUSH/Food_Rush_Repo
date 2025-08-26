import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  TextInput,
  HelperText,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { goBack } from '@/src/navigation/navigationHelpers';
import CommonView from '@/src/components/common/CommonView';
import { useRequestPasswordReset } from '@/src/hooks/customer/useAuthhooks';
import Toast from 'react-native-toast-message';
import { AuthStackScreenProps } from '@/src/navigation/types';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';

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

const ForgotPasswordScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<'ForgotPassword'>) => {
  const { colors } = useTheme();

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
  const {
    mutate: requestPasswordMutation,
    isPending,
    error,
  } = useRequestPasswordReset();

  const handleForgotPassword = useCallback(
    async (data: ForgotPasswordForm) => {
      try {
        console.log('Password reset requested for:', data.email);
        // Add your password reset API call here
        requestPasswordMutation(
          { email: data.email },

          {
            onSuccess: (res) => {
              Toast.show({ text1: res.message, visibilityTime: 5000 });
              navigation.navigate('ResetPassword', { email: data.email });
            },
            onError: (error) => {
              Toast.show({
                text1: error.message,
                visibilityTime: 5000,
                type: 'error',
              });
            },
          },
        );
      } catch (error) {
        console.error('Password reset failed:', error);
      }
    },
    [navigation, requestPasswordMutation],
  );

  const clearEmail = useCallback(() => {
    setValue('email', '', { shouldValidate: false });
  }, [setValue]);

  return (
    <CommonView>
      <View className="flex-1 px-6 pt-2">
        {/* Back Button */}
        <View className="mb-6">
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.onSurface}
            className="self-start -ml-2"
            onPress={goBack}
          />
        </View>

        {/* Header Section */}
        <View className="mb-10">
          <Text
            className={`text-3xl font-bold text-center mb-2 `}
            style={{ color: colors.onBackground }}
          >
            Reset Password
          </Text>
          <Text
            className={`text-sm text-center leading-5 `}
            style={{ color: colors.onBackground }}
          >
            Enter your email address and we will send you a{}code to reset your
            password
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
                style={{ backgroundColor: colors.surfaceVariant }}
                outlineStyle={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.email ? colors.error : colors.outline,
                }}
                contentStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                }}
                error={!!errors.email}
                left={
                  <TextInput.Icon
                    icon="lock-outline"
                    color={colors.onSurface}
                  />
                }
                right={
                  value ? (
                    <TextInput.Icon
                      icon="eye"
                      onPress={clearEmail}
                      color={colors.onSurface}
                    />
                  ) : null
                }
              />
              <HelperText
                type="error"
                visible={!!errors.email}
                className="text-xs mt-1"
              >
                {errors.email?.message}
              </HelperText>
              <Text
                className={`text-xs mt-1 `}
                style={{ color: colors.onBackground }}
              >
                Must have at least 8 characters
              </Text>
            </View>
          )}
        />

        {/* Error Display */}
        <ErrorDisplay error={error?.message || null} visible={!!error} />

        {/* Continue Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(handleForgotPassword)}
          loading={isPending}
          disabled={isPending || !emailValue}
          buttonColor={colors.primary}
          textColor="white"
          contentStyle={{ paddingVertical: 8 }}
          style={{ borderRadius: 25 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Continue
        </Button>
      </View>
    </CommonView>
  );
};

export default ForgotPasswordScreen;
