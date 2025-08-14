import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import CommonView from '@/src/components/common/CommonView';

const OTPScreen: React.FC<AuthStackScreenProps<'OTPVerification'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  // getting all data from route,
  const data = route.params;
  // verfit otp function
  const VerifyOTP = useAuthStore((state) => state.verifyOTP);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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
  //verification of OTP request

  const handleVerify = useCallback(async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) return;

    setIsVerifying(true);
    try {
      await VerifyOTP({
        otp: otpString,
        type: 'email',
        userId: data.userId,
        email: data.email,
        phoneNumber: data.phone,
        userType: 'customer',
      });
      // proceeding to setting values
      console.log('OTP Verified:' + otpString + 'Navigating to HomeScreen');
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  }, [VerifyOTP, data.email, data.phone, data.userId, otp]);

  const handleResend = useCallback(async () => {
    if (!isResendEnabled) return;

    try {
      setTimer(65);
      setIsResendEnabled(false);
      setOtp(['', '', '', '', '', '']);
      console.log('OTP Resent');
    } catch (error) {
      console.error('Resend failed:', error);
    }
  }, [isResendEnabled]);

  const goBack = useCallback(() => {
    console.log('Go back');
  }, []);

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
            OTP Code Verification
          </Text>
          <View className="w-10" />
        </View>

        {/* Description */}
        <View className="mb-12">
          <Text
            className={`text-sm text-center leading-5 `}
            style={{ color: colors.onBackground }}
          >
            Code has been sent to {data.phone}
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View className="flex-row justify-center mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`w-15 h-15 mx-2 text-center text-lg font-semibold border-2 rounded-lg`}
              style={{
                backgroundColor: digit ? colors.surfaceVariant : colors.surface,
                borderColor: digit ? colors.primary : colors.surface,
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View className="mb-8">
          <Text className={`text-sm text-center text-[${colors.secondary}]`}>
            Resend code in{' '}
            <Text className="font-medium" style={{ color: colors.primary }}>
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, '0')} s
            </Text>
          </Text>
        </View>

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
          Verify
        </Button>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={!isResendEnabled}
          className="self-center"
        >
          <Text
            className={`text-sm font-medium ${
              isResendEnabled
                ? `text-[${colors.primary}]`
                : `text-[${colors.outline}]`
            }`}
          >
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    </CommonView>
  );
};

export default OTPScreen;
