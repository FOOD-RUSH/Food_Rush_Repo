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
import { useCartStore, useCartServiceFee } from '@/src/stores/customerStores/cartStore';
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
  | 'ussd_prompt'         // Show USSD prompt message
  | 'ussd_display'        // Show USSD code
  | 'verification'        // Verifying payment status
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
  const serviceFee = useCartServiceFee(); // Get service fee from cart
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
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [verificationStarted, setVerificationStarted] = useState(false);

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
        serviceFee, // Pass the service fee from cart
      );

      // Use the new payment hook
      initializePayment(paymentRequest, {
        onSuccess: (result) => {
          if (result.success && result.transactionId) {
            setTransactionId(result.transactionId);
            setUssdCode(result.ussdCode || '');
            
            // Show USSD prompt message first
            setCurrentStep('ussd_prompt');
            
            // After 3 seconds, show USSD code if available, otherwise start verification
            setTimeout(() => {
              if (result.ussdCode) {
                setCurrentStep('ussd_display');
              } else {
                setCurrentStep('verification');
              }
              
              // Start 2-minute countdown and verification after timeout
              startVerificationCountdown(result.transactionId);
            }, 3000);
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

  // Start verification countdown and check payment status after 2 minutes
  const startVerificationCountdown = (txnId: string) => {
    setVerificationStarted(true);
    
    // Start immediate polling every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const status = await PaymentService.checkPaymentStatus(txnId);
        
        if (status.status === 'completed') {
          clearInterval(pollInterval);
          setCurrentStep('success');
          completePayment();
          
          // Auto-navigate to success after a short delay
          setTimeout(() => {
            handleSuccess();
          }, 2000);
        } else if (status.status === 'failed') {
          clearInterval(pollInterval);
          setCurrentStep('failed');
          setError(t('payment_status_failed'));
        } else if (status.status === 'expired') {
          clearInterval(pollInterval);
          setCurrentStep('failed');
          setError(t('payment_status_expired'));
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
      }
    }, 5000); // Poll every 5 seconds
    
    // After 2 minutes, do final verification
    setTimeout(async () => {
      clearInterval(pollInterval);
      
      if (currentStep !== 'success' && currentStep !== 'failed') {
        setCurrentStep('verification');
        
        try {
          const finalStatus = await PaymentService.checkPaymentStatus(txnId);
          
          if (finalStatus.status === 'completed') {
            setCurrentStep('success');
            completePayment();
            setTimeout(() => {
              handleSuccess();
            }, 2000);
          } else if (finalStatus.status === 'failed') {
            setCurrentStep('failed');
            setError(t('payment_status_failed'));
          } else if (finalStatus.status === 'expired') {
            setCurrentStep('failed');
            setError(t('payment_status_expired'));
          } else {
            // Still pending after 2 minutes
            setCurrentStep('failed');
            setError(t('payment_timeout_message'));
          }
        } catch (error) {
          console.error('Final payment verification error:', error);
          setCurrentStep('failed');
          setError(t('payment_timeout_retry'));
        }
      }
    }, 120000); // 2 minutes
  };

  // Countdown timer for USSD and verification
  useEffect(() => {
    if (currentStep === 'ussd_display' || currentStep === 'verification') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Don't set failed here, let the verification timeout handle it
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
    setCountdown(120); // Reset to 2 minutes
    setTransactionId('');
    setUssdCode('');
    setVerificationStarted(false);
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

  // Render USSD prompt step
  const renderUssdPrompt = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center mb-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <IoniconsIcon name="phone-portrait" size={32} color={colors.primary} />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            {t('expect_ussd_prompt')}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('ussd_prompt_message', { provider: getProviderName() })}
          </Text>
        </View>

        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <View className="flex-row items-start">
            <IoniconsIcon name="information-circle" size={24} color={colors.primary} className="mr-3 mt-1" />
            <View className="flex-1">
              <Text
                className="text-sm font-medium mb-2"
                style={{ color: colors.primary }}
              >
                {t('important_note')}
              </Text>
              <Text
                className="text-sm"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('no_ussd_prompt_help')}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-center">
          <ActivityIndicator
            size="large"
            color={colors.primary}
            className="mb-4"
          />
          <Text
            className="text-base font-medium"
            style={{ color: colors.onSurface }}
          >
            {t('payment_verification_in_progress')}
          </Text>
          <Text
            className="text-sm mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('checking_payment_status')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Render USSD display step (if USSD code is provided)
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

        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text
            className="text-sm font-medium text-blue-800 mb-2"
          >
            💡 {t('important_note')}
          </Text>
          <Text
            className="text-sm text-blue-700"
          >
            {t('ussd_pin_fallback_instruction')}
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

  // Render verification step
  const renderVerification = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center mb-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <IoniconsIcon name="shield-checkmark" size={32} color={colors.primary} />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            {t('payment_verification_in_progress')}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('checking_payment_status')}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            {t('time_remaining', { time: formatTime(countdown) })}
          </Text>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            className="mt-4"
          />
          <Text
            className="text-sm mt-4 text-center"
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
            {t('payment_status_successful')}
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
      case 'ussd_prompt':
        return renderUssdPrompt();
      case 'ussd_display':
        return renderUssdDisplay();
      case 'verification':
        return renderVerification();
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
          
          {/* Service Fee Display */}
          {serviceFee > 0 && (
            <View className="mt-2 pt-2 border-t" style={{ borderTopColor: colors.outline }}>
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-sm"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('service_fee')}:
                </Text>
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {serviceFee.toLocaleString('fr-FR')} FCFA
                </Text>
              </View>
              <Text
                className="text-xs mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('service_fee_note')}
              </Text>
            </View>
          )}
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
