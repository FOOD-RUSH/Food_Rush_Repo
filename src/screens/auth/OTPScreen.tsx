import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, IconButton } from 'react-native-paper';
import { useTheme } from '@/src/hooks/useTheme';

interface OTPScreenProps {
  phoneNumber?: string;
  onVerifyOTP?: (otp: string) => void;
  onResendOTP?: () => void;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ 
  phoneNumber = "+237 6*****31", 
  onVerifyOTP,
  onResendOTP 
}) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-background';
  const textColor = theme === 'light' ? 'text-black' : 'text-text';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-text-secondary';
  const otpInputStyle = (digit: string) => `w-12 h-12 mx-2 text-center text-lg font-semibold border-2 rounded-lg ${
    digit 
      ? (theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-primary bg-secondary') 
      : (theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-secondary')
  }`;
  const primaryColor = theme === 'light' ? '#1E90FF' : '#3b82f6';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(65);
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

  const handleOtpChange = useCallback((value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyPress = useCallback((key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleVerify = useCallback(async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    setIsVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onVerifyOTP?.(otpString);
      console.log('OTP Verified:', otpString);
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  }, [otp, onVerifyOTP]);

  const handleResend = useCallback(async () => {
    if (!isResendEnabled) return;

    try {
      setTimer(65);
      setIsResendEnabled(false);
      setOtp(['', '', '', '', '', '']);
      onResendOTP?.();
      console.log('OTP Resent');
    } catch (error) {
      console.error('Resend failed:', error);
    }
  }, [isResendEnabled, onResendOTP]);

  const goBack = useCallback(() => {
    console.log('Go back');
  }, []);

  const otpComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      <View className="flex-1 px-6 pt-2">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={theme === 'light' ? '#000000' : 'white'}
            className="-ml-2"
            onPress={goBack}
          />
          <Text className={`text-lg font-semibold ${textColor}`}>
            OTP Code Verification
          </Text>
          <View className="w-10" />
        </View>

        {/* Description */}
        <View className="mb-12">
          <Text className={`text-sm text-center leading-5 ${secondaryTextColor}`}>
            Code has been sent to {phoneNumber}
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View className="flex-row justify-center mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              className={otpInputStyle(digit)}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View className="mb-8">
          <Text className={`text-sm text-center ${secondaryTextColor}`}>
            Resend code in{' '}
            <Text className="font-medium" style={{ color: primaryColor }}>
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} s
            </Text>
          </Text>
        </View>

        {/* Verify Button */}
        <Button
          mode="contained"
          onPress={handleVerify}
          loading={isVerifying}
          disabled={!otpComplete || isVerifying}
          buttonColor={primaryColor}
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
          <Text className={`text-sm font-medium ${
            isResendEnabled ? (theme === 'light' ? 'text-blue-500' : 'text-primary') : 'text-gray-400'
          }`}>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
