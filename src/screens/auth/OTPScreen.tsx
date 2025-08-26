import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import CommonView from '@/src/components/common/CommonView';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useVerifyOTP, useResendOTP } from '@/src/hooks/customer/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';

const OTPScreen: React.FC<AuthStackScreenProps<'OTPVerification'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { isConnected, isInternetReachable } = useNetwork();

  // getting all data from route
  const data = route.params;

  // verify otp function
  const {
    mutate: verifyOTPMutation,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyOTP();
  const {
    mutate: resendOTPMutation,
    isPending: isResending,
    error: resendError,
  } = useResendOTP();
  const { clearError, setError, error: authError } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleOtpChange = useCallback(
    (value: string, index: number) => {
      // Only allow numeric input
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  // verification of OTP request
  const handleVerify = useCallback(async () => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No internet connection. Please check your network settings.',
        position: 'top',
      });
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Please enter a complete 4-digit code',
        position: 'top',
      });
      return;
    }

    clearError();

    try {
      console.log(
        `data: \n otp: ${otpString} type: ${'email'}, userId: ${data.userId}`,
      );
      verifyOTPMutation(
        {
          otp: otpString,
          type: 'email',
          userId: data.userId,
        },
        {
          onSuccess: (response) => {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: 'OTP verified successfully!',
              position: 'top',
            });
            console.log(response.data);

            // Navigate to main app - auth state is already updated in the hook
            navigation.navigate('CustomerApp', {
              screen: 'Home',
              params: { screen: 'HomeScreen' },
            });
          },
          onError: (error: any) => {
            const errorMessage =
              error?.message || 'OTP verification failed. Please try again.';
            setError(errorMessage);

            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: errorMessage,
              position: 'top',
            });

            // Clear OTP inputs on error to allow retry
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
          },
        },
      );
    } catch (error: any) {
      console.log(
        `data: \n otp: ${otpString} type: ${'email'}, userId: ${data.userId}`,
      );
      const errorMessage =
        error?.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);

      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: errorMessage,
        position: 'top',
      });
    }
  }, [
    verifyOTPMutation,
    clearError,
    setError,
    data.userId,
    isConnected,
    isInternetReachable,
    otp,
    t,
    navigation,
  ]);

  const handleResend = useCallback(async () => {
    if (!isConnected || !isInternetReachable) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No internet connection. Please check your network settings.',
        position: 'top',
      });
      return;
    }

    if (!isResendEnabled) return;

    clearError();

    try {
      resendOTPMutation(data.email, {
        onSuccess: () => {
          setTimer(30);
          setIsResendEnabled(false);
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();

          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('otp_resent_successfully'),
            position: 'bottom',
          });
        },
        onError: (error: any) => {
          const errorMessage =
            error?.message || 'Failed to resend OTP. Please try again.';
          setError(errorMessage);

          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: errorMessage,
            position: 'bottom',
            visibilityTime: 5000,
          });
        },
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);

      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: errorMessage,
        position: 'top',
      });
    }
  }, [
    isConnected,
    isInternetReachable,
    isResendEnabled,
    resendOTPMutation,
    clearError,
    setError,
    data.email,
    t,
  ]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const otpComplete = otp.every((digit) => digit !== '');

  return (
    <CommonView>
      <View
        className="flex-1 px-2 pt-2"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.onBackground}
            className="-ml-2"
            onPress={goBack}
          />
          <Text
            className={`text-lg font-semibold `}
            style={{ color: colors.onBackground }}
          >
            {t('otp_verification')}
          </Text>
          <View className="w-10" />
        </View>

        {/* Description */}
        <View className="mb-12">
          <Text
            className={`text-sm text-center leading-5 `}
            style={{ color: colors.onBackground }}
          >
            {t('otp_sent')} {data.phone || data.email}
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View className="flex-row justify-center mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              className={`w-15 h-15 mx-2 text-center text-2xl font-semibold border-2 rounded-lg`}
              style={{
                backgroundColor: digit ? colors.surfaceVariant : colors.surface,
                borderColor: digit ? colors.primary : colors.surface,
                color: colors.onSurface,
                width: 60,
                height: 100,
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View className="mb-8">
          <Text
            className={`text-sm text-center`}
            style={{ color: colors.onSurface }}
          >
            {isResendEnabled ? (
              <Text style={{ color: colors.primary }}>
                You can now resend the code
              </Text>
            ) : (
              <>
                {t('resend_code')} in{' '}
                <Text className="font-medium" style={{ color: colors.primary }}>
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, '0')} s
                </Text>
              </>
            )}
          </Text>
        </View>

        {/* Error Display */}
        <ErrorDisplay
          error={verifyError?.message || resendError?.message || authError}
          visible={
            !!(verifyError?.message || resendError?.message || authError)
          }
        />

        {/* Verify Button */}
        <Button
          mode="contained"
          onPress={handleVerify}
          loading={isVerifying}
          disabled={!otpComplete || isVerifying}
          buttonColor={colors.primary}
          textColor="white"
          contentStyle={{ paddingVertical: 8 }}
          style={{ borderRadius: 25, marginBottom: 20 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          {isVerifying ? t('verifying') : t('verify')}
        </Button>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={!isResendEnabled || isResending}
          className="self-center"
        >
          <Text
            className={`text-sm font-medium ${
              isResendEnabled && !isResending
                ? `text-[${colors.primary}]`
                : `text-[${colors.outline}]`
            }`}
            style={{
              color:
                isResendEnabled && !isResending
                  ? colors.primary
                  : colors.outline,
            }}
          >
            {isResending ? t('resending') : t('resend_code')}
          </Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View className="mt-8">
          <Text
            className="text-xs text-center"
            style={{ color: colors.onSurface, opacity: 0.7 }}
          >
            Didn&apos;t receive the code? Check your spam folder or try
            resending.
          </Text>
        </View>
      </View>
    </CommonView>
  );
};

export default OTPScreen;
