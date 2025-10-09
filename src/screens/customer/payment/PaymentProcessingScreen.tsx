import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { useTheme, Card } from 'react-native-paper';

import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useTranslation } from 'react-i18next';
import PaymentService from '@/src/services/customer/payment.service';
import { useCartStore } from '@/src/stores/customerStores/cartStore';
import { useOrderFlow } from '@/src/hooks/customer/useOrderFlow';
import { useAuthUser } from '@/src/stores/customerStores';
import {
  useInitializePayment,
  useCreatePaymentRequest,
} from '@/src/hooks/customer/usePayment';
import PaymentMethodModal from '@/src/components/customer/PaymentMethodModal';
import { PaymentMethodSelection } from '@/src/types/transaction';

type PaymentStep =
  | 'method_selection'    // Select payment method (MTN/Orange)
  | 'processing'          // Processing payment
  | 'ussd_display'        // Show USSD code
  | 'confirmation'        // Waiting for confirmation
  | 'success'             // Payment successful
  | 'failed';             // Payment failed

const PaymentProcessingScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'PaymentProcessing'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { orderId, amount, provider } = route.params;
  const clearCart = useCartStore((state) => state.clearCart);
  const { completePayment } = useOrderFlow();
  const user = useAuthUser();
  const createPaymentRequest = useCreatePaymentRequest();
  const { mutate: initializePayment } = useInitializePayment();

  // State management
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method_selection');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodSelection>({
    method: 'mobile_money',
    provider: provider || 'mtn',
    phoneNumber: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(true);

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
    return selectedPayment.provider === 'mtn' ? 'MTN Mobile Money' : 'Orange Money';
  };



  // Handle payment method confirmation
  const handlePaymentConfirm = useCallback((selection: PaymentMethodSelection) => {
    setSelectedPayment(selection);
    setShowPaymentModal(false);
    setCurrentStep('processing');
    // Start payment initialization
    initializePaymentWithSelection(selection);
  }, []);

  // Validate phone number
  const validatePhoneNumber = useCallback(
    (phone: string, provider: string) => {
      // Convert provider to medium format for validation
      const medium = provider === 'orange' ? 'orange' : 'mtn';
      return PaymentService.validatePhoneNumber(phone, medium);
    },
    [],
  );

  // Initialize payment with selected method
  const initializePaymentWithSelection = async (selection: PaymentMethodSelection) => {
    if (!validatePhoneNumber(selection.phoneNumber, selection.provider)) {
      setError(t('please_enter_valid_phone', { provider: selection.provider.toUpperCase() }));
      setCurrentStep('method_selection');
      setShowPaymentModal(true);
      return;
    }

    if (!user?.fullName || !user?.email) {
      setError(t('user_info_missing'));
      setCurrentStep('failed');
      return;
    }


    setError('');

    try {
      // Convert provider to the correct medium format
      const medium = selection.provider === 'orange' ? 'orange' : 'mtn';

      // Create payment request using the new API structure
      const paymentRequest = createPaymentRequest(
        orderId,
        selection.phoneNumber,
        medium,
        user.fullName,
        user.email,
      );

      // Use the new payment hook
      initializePayment(paymentRequest, {
        onSuccess: (result) => {
          if (result.success && result.transactionId) {
            setTransactionId(result.transactionId);
            setUssdCode(result.ussdCode || '');
            setCurrentStep(result.ussdCode ? 'ussd_display' : 'confirmation');

            // Start polling for payment status
            startPaymentStatusPolling(result.transactionId);
          } else {
            setError(result.error || t('failed_initialize_payment'));
            setCurrentStep('failed');
          }
        },
        onError: (error) => {
          console.error('Payment initialization error:', error);
          setError(t('failed_initialize_payment_retry'));
          setCurrentStep('failed');
        },
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError(t('failed_initialize_payment_retry'));
      setCurrentStep('failed');
    } finally {
      // Payment initialization complete
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
          
          // Auto-navigate to success after a short delay
          setTimeout(() => {
            handleSuccess();
          }, 2000);
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
        setError(t('payment_timeout_retry'));
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
            setError(t('payment_session_expired'));
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
      Alert.alert(t('copied'), t('ussd_code_copied'));
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
    
    // Navigate to order tracking after successful payment
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'OrderTracking',
          params: { orderId },
        },
      ],
    });
  };

  // Handle retry
  const handleRetry = () => {
    setCurrentStep('method_selection');
    setShowPaymentModal(true);
    setError('');
    setCountdown(300);
    setTransactionId('');
    setUssdCode('');
  };

  // Render method selection step
  const renderMethodSelection = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center mb-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <IoniconsIcon
              name="card-outline"
              size={32}
              color={colors.primary}
            />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            {t('select_payment_method')}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('choose_payment_method_to_pay', { amount: formattedAmount })}
          </Text>
        </View>

        <TouchableOpacity
          className="rounded-lg py-4 items-center"
          style={{ backgroundColor: colors.primary }}
          onPress={() => setShowPaymentModal(true)}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: colors.onPrimary }}
          >
            {t('select_payment_method')}
          </Text>
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
            <MaterialIcon name="dialpad" size={32} color={colors.primary} />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            {t('dial_ussd_code')}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('dial_code_on_line', { provider: getProviderName() })}
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
              <IoniconsIcon name="copy" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-yellow-50 p-4 rounded-lg mb-4">
          <Text
            className="text-sm font-medium"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('instructions')}
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('dial_code_instruction', { code: ussdCode, provider: getProviderName() })}{'\n'}
            {t('follow_prompts_instruction')}{'\n'}
            {t('auto_detect_instruction')}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            {t('time_remaining', { time: formatTime(countdown) })}
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
            {t('waiting_payment_confirmation')}
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
            <IoniconsIcon name="checkmark-circle" size={48} color="#4CAF50" />
          </View>
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: colors.onSurface }}
          >
            {t('payment_successful')}
          </Text>
          <Text
            className="text-base text-center mb-6"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('order_confirmed_preparing')}
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
              {t('view_order_status')}
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
            <IoniconsIcon name="close-circle" size={48} color={colors.error} />
          </View>
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: colors.onSurface }}
          >
            {t('payment_failed')}
          </Text>
          <Text
            className="text-base text-center mb-6"
            style={{ color: colors.onSurfaceVariant }}
          >
            {error || t('payment_error_generic')}
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
                {t('cancel')}
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
                {t('try_again')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  // Render processing step
  const renderProcessing = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            className="text-lg font-semibold mt-4"
            style={{ color: colors.onSurface }}
          >
            {t('processing_payment')}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('processing_payment_wait')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'method_selection':
        return renderMethodSelection();
      case 'processing':
        return renderProcessing();
      case 'ussd_display':
      case 'confirmation':
        return renderUssdDisplay();
      case 'success':
        return renderSuccess();
      case 'failed':
        return renderFailed();
      default:
        return renderMethodSelection();
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
            <IoniconsIcon
              name="arrow-back"
              size={24}
              color={colors.onSurface}
            />
          </TouchableOpacity>
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.onSurface }}
          >
            {t('payment')}
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
            {t('order_number', { orderId })}
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

        {/* Payment Method Modal */}
        <PaymentMethodModal
          visible={showPaymentModal}
          onDismiss={() => {
            setShowPaymentModal(false);
            if (currentStep === 'method_selection') {
              navigation.goBack();
            }
          }}
          onConfirm={handlePaymentConfirm}
          currentSelection={selectedPayment}
        />
      </View>
    </CommonView>
  );
};

export default PaymentProcessingScreen;
