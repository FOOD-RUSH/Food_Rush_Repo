import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useTranslation } from 'react-i18next';
import PaymentService from '@/src/services/customer/payment.service';
import { useCartStore } from '@/src/stores/customerStores/cartStore';
import { useOrderFlow } from '@/src/hooks/customer/useOrderFlow';

type PaymentStep =
  | 'phone_input'
  | 'processing'
  | 'ussd_display'
  | 'confirmation'
  | 'success'
  | 'failed';

const PaymentProcessingScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'PaymentProcessing'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { orderId, amount, paymentMethod, provider } = route.params;
  const clearCart = useCartStore((state) => state.clearCart);
  const { completePayment } = useOrderFlow();

  // State management
  const [currentStep, setCurrentStep] = useState<PaymentStep>('phone_input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [ussdCode, setUssdCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown

  // Format amount for display
  const formattedAmount = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Get provider name for display
  const getProviderName = () => {
    if (paymentMethod === 'mobile_money') {
      return provider === 'mtn' ? 'MTN Mobile Money' : 'Orange Money';
    }
    return 'Cash on Delivery';
  };

  // Get provider color
  const getProviderColor = () => {
    if (provider === 'mtn') return '#FFCC00';
    if (provider === 'orange') return '#FF6600';
    return colors.primary;
  };

  // Validate phone number
  const validatePhoneNumber = useCallback(
    (phone: string) => {
      if (!provider) return false;
      return PaymentService.validatePhoneNumber(phone, provider);
    },
    [provider],
  );

  // Handle phone number input
  const handlePhoneNumberChange = (text: string) => {
    // Remove non-numeric characters except +
    const cleaned = text.replace(/[^\d+]/g, '');
    setPhoneNumber(cleaned);
    setError('');
  };

  // Initialize payment
  const handleInitializePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError(`Please enter a valid ${provider?.toUpperCase()} phone number`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (paymentMethod === 'mobile_money' && provider) {
        const result = await PaymentService.initializePayment({
          amount,
          phoneNumber,
          provider,
          orderId,
          currency: 'XAF',
        });

        if (result.success && result.transactionId) {
          setTransactionId(result.transactionId);
          setUssdCode(result.ussdCode || '');
          setCurrentStep(result.ussdCode ? 'ussd_display' : 'confirmation');

          // Start polling for payment status
          startPaymentStatusPolling(result.transactionId);
        } else {
          setError(result.error || 'Failed to initialize payment');
        }
      } else {
        // Handle cash payment
        setCurrentStep('success');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start payment status polling
  const startPaymentStatusPolling = (txnId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await PaymentService.checkPaymentStatus(txnId);

        if (status.status === 'completed') {
          clearInterval(pollInterval);
          setCurrentStep('success');
          // Mark payment as completed in order flow
          completePayment();
        } else if (status.status === 'failed' || status.status === 'expired') {
          clearInterval(pollInterval);
          setCurrentStep('failed');
          setError(status.message);
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (currentStep !== 'success' && currentStep !== 'failed') {
        setCurrentStep('failed');
        setError('Payment timeout. Please try again.');
      }
    }, 300000);
  };

  // Countdown timer for USSD
  useEffect(() => {
    if (currentStep === 'ussd_display' || currentStep === 'confirmation') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentStep('failed');
            setError('Payment session expired. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  // Copy USSD code to clipboard
  const copyUssdCode = async () => {
    if (ussdCode) {
      await Clipboard.setString(ussdCode);
      Alert.alert('Copied', 'USSD code copied to clipboard');
    }
  };

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle success navigation
  const handleSuccess = () => {
    clearCart();
    completePayment();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'CustomerApp',
          params: { screen: 'Orders' },
        },
      ],
    });
  };

  // Handle retry
  const handleRetry = () => {
    setCurrentStep('phone_input');
    setError('');
    setCountdown(300);
    setTransactionId('');
    setUssdCode('');
  };

  // Render phone input step
  const renderPhoneInput = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center mb-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: getProviderColor() + '20' }}
          >
            <Ionicons
              name="phone-portrait"
              size={32}
              color={getProviderColor()}
            />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            {getProviderName()}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            Enter your phone number to pay {formattedAmount} FCFA
          </Text>
        </View>

        <View className="mb-4">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: colors.onSurface }}
          >
            Phone Number
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3 text-base"
            style={{
              borderColor: error ? colors.error : colors.outline,
              color: colors.onSurface,
              backgroundColor: colors.surface,
            }}
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder={provider === 'mtn' ? '6XXXXXXXX' : '6XXXXXXXX'}
            placeholderTextColor={colors.onSurfaceVariant}
            keyboardType="phone-pad"
            maxLength={15}
          />
          {error ? (
            <Text className="text-sm mt-1" style={{ color: colors.error }}>
              {error}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          className="rounded-lg py-4 items-center"
          style={{ backgroundColor: colors.primary }}
          onPress={handleInitializePayment}
          disabled={isLoading || !phoneNumber}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text
              className="text-base font-semibold"
              style={{ color: colors.onPrimary }}
            >
              Continue Payment
            </Text>
          )}
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  // Render USSD display step
  const renderUssdDisplay = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center mb-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <MaterialIcons name="dialpad" size={32} color={colors.primary} />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            Dial USSD Code
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            Dial the code below on your {getProviderName()} line
          </Text>
        </View>

        <View
          className="border-2 border-dashed rounded-lg p-4 mb-4"
          style={{ borderColor: colors.primary }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="text-2xl font-mono font-bold"
              style={{ color: colors.primary }}
            >
              {ussdCode}
            </Text>
            <TouchableOpacity
              onPress={copyUssdCode}
              className="ml-2 p-2"
              style={{ backgroundColor: colors.primaryContainer }}
            >
              <Ionicons name="copy" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-yellow-50 p-4 rounded-lg mb-4">
          <Text
            className="text-sm font-medium"
            style={{ color: colors.onSurfaceVariant }}
          >
            Instructions:
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: colors.onSurfaceVariant }}
          >
            1. Dial {ussdCode} on your {getProviderName()} line{'\n'}
            2. Follow the prompts to complete payment{'\n'}
            3. We&apos;ll automatically detect when payment is complete
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            Time remaining: {formatTime(countdown)}
          </Text>
          <ActivityIndicator
            size="small"
            color={colors.primary}
            className="mt-2"
          />
          <Text
            className="text-sm mt-1"
            style={{ color: colors.onSurfaceVariant }}
          >
            Waiting for payment confirmation...
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Render success step
  const renderSuccess = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: '#4CAF50' + '20' }}
          >
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
          </View>
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: colors.onSurface }}
          >
            Payment Successful!
          </Text>
          <Text
            className="text-base text-center mb-6"
            style={{ color: colors.onSurfaceVariant }}
          >
            Your order has been confirmed and is being prepared.
          </Text>

          <TouchableOpacity
            className="rounded-lg py-4 px-8 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSuccess}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.onPrimary }}
            >
              View Order Status
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  // Render failed step
  const renderFailed = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.error + '20' }}
          >
            <Ionicons name="close-circle" size={48} color={colors.error} />
          </View>
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: colors.onSurface }}
          >
            Payment Failed
          </Text>
          <Text
            className="text-base text-center mb-6"
            style={{ color: colors.onSurfaceVariant }}
          >
            {error || 'Something went wrong with your payment.'}
          </Text>

          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 rounded-lg py-4 items-center border"
              style={{ borderColor: colors.outline }}
              onPress={() => navigation.goBack()}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.onSurface }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-lg py-4 items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleRetry}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.onPrimary }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone_input':
        return renderPhoneInput();
      case 'ussd_display':
      case 'confirmation':
        return renderUssdDisplay();
      case 'success':
        return renderSuccess();
      case 'failed':
        return renderFailed();
      default:
        return renderPhoneInput();
    }
  };

  return (
    <CommonView>
      <View className="flex-1">
        {/* Header */}
        <View
          className="flex-row items-center px-4 py-3 border-b"
          style={{ borderBottomColor: colors.outline }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.onSurface }}
          >
            Payment
          </Text>
        </View>

        {/* Order Summary */}
        <View
          className="px-4 py-4 border-b"
          style={{ borderBottomColor: colors.outline }}
        >
          <Text
            className="text-sm font-medium"
            style={{ color: colors.onSurfaceVariant }}
          >
            Order #{orderId}
          </Text>
          <Text
            className="text-2xl font-bold"
            style={{ color: colors.onSurface }}
          >
            {formattedAmount} FCFA
          </Text>
        </View>

        {/* Payment Step Content */}
        {renderCurrentStep()}
      </View>
    </CommonView>
  );
};

export default PaymentProcessingScreen;
