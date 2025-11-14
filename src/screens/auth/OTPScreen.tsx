import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/AuthStore';
import CommonView from '@/src/components/common/CommonView';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/src/contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useVerifyOTP, useResendOTP } from '@/src/hooks/customer/useAuthhooks';
import ErrorDisplay from '@/src/components/auth/ErrorDisplay';
import {
  Heading3,
  Body,
  BodySmall,
  Label,
} from '@/src/components/common/Typography';

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

            // Navigate to main app and reset navigation stack to prevent going back to auth screens
            import('@/src/navigation/navigationRef').then(({ navigationRef }) => {
              if (navigationRef.isReady()) {
                navigationRef.reset({
                  index: 0,
                  routes: [{ name: data.userType === 'restaurant' ? 'RestaurantApp' : 'CustomerApp' }],
                });
              } else {
                // Fallback to navigation if ref isn't ready
                navigation.reset({
                  index: 0,
                  routes: [{ name: data.userType === 'restaurant' ? 'RestaurantApp' : 'CustomerApp' }],
                });
              }
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
          <Heading3 color={colors.onBackground} weight="semibold">
            {t('otp_verification')}
          </Heading3>
          <View className="w-10" />
        </View>

        {/* Description */}
        <View className="mb-12">
          <Body
            align="center"
            color={colors.onBackground}
            style={{ lineHeight: 20 }}
          >
            {t('otp_sent')} {data.email}
          </Body>
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
                backgroundColor: digit
                  ? colors.primaryContainer
                  : colors.surface,
                borderColor: digit ? colors.primary : colors.outline,
                color: colors.onSurface,
                width: 60,
                height: 60,
                fontSize: 24,
                fontWeight: '600',
                textAlign: 'center',
                // Ensure visibility in both light and dark modes
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
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
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View className="mb-8 px-4">
          <View
            style={{
              backgroundColor: colors.surfaceVariant,
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            {isResendEnabled ? (
              <Body color={colors.primary} weight="medium">
                You can now resend the code
              </Body>
            ) : (
              <Body color={colors.onSurfaceVariant} align="center">
                {t('resend_code')} in{' '}
                <Label weight="bold" color={colors.primary}>
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, '0')}
                </Label>
              </Body>
            )}
          </View>
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
          buttonColor={otpComplete ? colors.primary : colors.surfaceVariant}
          textColor={otpComplete ? colors.onPrimary : colors.onSurfaceVariant}
          contentStyle={{ paddingVertical: 12 }}
          style={{
            borderRadius: 12,
            marginBottom: 20,
            elevation: otpComplete ? 3 : 0,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: otpComplete ? 0.2 : 0,
            shadowRadius: 4,
          }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          {isVerifying ? t('verifying') : t('verify')}
        </Button>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={!isResendEnabled || isResending}
          style={{
            alignSelf: 'center',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            backgroundColor:
              isResendEnabled && !isResending
                ? colors.primaryContainer
                : colors.surfaceVariant,
            borderWidth: 1,
            borderColor:
              isResendEnabled && !isResending ? colors.primary : colors.outline,
          }}
        >
          <Label
            weight="semibold"
            color={
              isResendEnabled && !isResending
                ? colors.primary
                : colors.onSurfaceVariant
            }
          >
            {isResending ? t('resending') : t('resend_code')}
          </Label>
        </TouchableOpacity>

        {/* Additional Info */}
        <View className="mt-8">
          <BodySmall
            align="center"
            color={colors.onSurface}
            style={{ opacity: 0.7 }}
          >
            Didn&apos;t receive the code? Check your spam folder or try
            resending.
          </BodySmall>
        </View>
      </View>
    </CommonView>
  );
};

export default OTPScreen;
