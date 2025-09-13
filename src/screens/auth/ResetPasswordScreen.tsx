import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
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
import CommonView from '@/src/components/common/CommonView';
import { useResetPassword } from '@/src/hooks/customer/useAuthhooks';
import Toast from 'react-native-toast-message';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import ResettingPassword from '@/src/components/auth/ResettingPassword';
import OTPInput from '@/src/components/auth/OTPInput';
import { AuthStackScreenProps } from '@/src/navigation/types';

// Validation schema
const validationSchema = yup.object({
  otp: yup.string().required('OTP is required'),
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
  otp: string;
  password: string;
  confirmPassword: string;
}

const ResetPasswordScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<'ResetPassword'>) => {
  const { colors } = useTheme();
  const { present, dismiss } = useBottomSheet();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  const { mutate: ResetPasswordMutation, isPending } = useResetPassword();

  const onSubmit = useCallback(
    async (data: ResetPasswordForm) => {
      present(<ResettingPassword isPending={isPending} />);
      const { email } = route.params;
      try {
        ResetPasswordMutation(
          { otp: data.otp, email, newPassword: data.password },
          {
            onSuccess: (res) => {
              dismiss();
              Toast.show({
                text1: res.data?.message || 'Password reset successfully',
                type: 'success',
              });
              // Redirect to login screen
              navigation.navigate('SignIn', { userType: 'customer' });
            },
            onError: (error: any) => {
              dismiss();
              Toast.show({
                text1: 'An error occurred',
                text2: error.message || 'Failed to reset password',
                type: 'error',
              });
            },
          },
        );
      } catch (error) {
        dismiss();
        console.error('Password reset failed:', error);
      }
    },
    [
      present,
      isPending,
      route.params,
      ResetPasswordMutation,
      dismiss,
      navigation,
    ],
  );

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
    <CommonView>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-2">
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
              className={`text-3xl font-bold text-center mb-2`}
              style={{ color: colors.background }}
            >
              Reset Password
            </Text>
            <Text
              className={`text-base text-center leading-5 `}
              style={{ color: colors.background }}
            >
              Enter your email address and we will send you code to reset your
              password
            </Text>
          </View>

          {/* OTP Input */}
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <View className="mb-6">
                <Text
                  className="text-base font-medium mb-3"
                  style={{ color: colors.onSurface }}
                >
                  Enter OTP Code
                </Text>
                <OTPInput
                  value={value}
                  onChange={onChange}
                  error={!!errors.otp}
                  disabled={isPending}
                />
                <HelperText
                  type="error"
                  visible={!!errors.otp}
                  className="text-xs mt-2 text-center"
                >
                  {errors.otp?.message}
                </HelperText>
              </View>
            )}
          />

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-6">
                <TextInput
                  disabled={isPending}
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={{ backgroundColor: colors.surfaceVariant }}
                  outlineStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: errors.password
                      ? colors.error
                      : colors.outline,
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                  error={!!errors.password}
                  left={
                    <TextInput.Icon
                      icon="lock-outline"
                      color={colors.onSurface}
                    />
                  }
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={togglePasswordVisibility}
                      color={colors.onSurface}
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
                <Text
                  className={`text-xs mt-1`}
                  style={{ color: colors.background }}
                >
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
                  disabled={isPending}
                  placeholder="Confirm your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={{ backgroundColor: colors.surfaceVariant }}
                  outlineStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: errors.confirmPassword
                      ? colors.error
                      : colors.outline,
                  }}
                  contentStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                  error={!!errors.confirmPassword}
                  left={
                    <TextInput.Icon
                      icon="lock-outline"
                      color={colors.onSurface}
                    />
                  }
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={toggleConfirmPasswordVisibility}
                      color={colors.onSurface}
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
                <Text
                  className={`text-xs mt-1`}
                  style={{ color: colors.background }}
                >
                  Both passwords must match
                </Text>
              </View>
            )}
          />

          {/* Continue Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending || !passwordValue || !confirmPasswordValue}
            buttonColor={colors.primary}
            textColor="white"
            contentStyle={{ paddingVertical: 8 }}
            style={{ borderRadius: 25 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ResetPasswordScreen;
