import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme, Card } from 'react-native-paper';

import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useTranslation } from 'react-i18next';
import PaymentService from '@/src/services/customer/payment.service';
import {
  useCartStore,
  useCartServiceFee,
} from '@/src/stores/customerStores/cartStore';
import { useOrderFlow } from '@/src/hooks/customer/useOrderFlow';
import { useAuthUser } from '@/src/stores/customerStores';
import {
  useInitializePayment,
  useCreatePaymentRequest,
} from '@/src/hooks/customer/usePayment';
import PaymentMethodModal from '@/src/components/customer/PaymentMethodModal';
import { PaymentMethodSelection } from '@/src/types/transaction';

type PaymentStep =
  | 'method_selection'
  | 'processing'
  | 'verification'
  | 'success'
  | 'failed';

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
  const serviceFee = useCartServiceFee();
  const createPaymentRequest = useCreatePaymentRequest();
  const { mutate: initializePayment } = useInitializePayment();

  // Refs for cleanup
  const pollingControllerRef = useRef<AbortController | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // State management
  const [currentStep, setCurrentStep] =
    useState<PaymentStep>('method_selection');
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodSelection>({
      method: 'mobile_money',
      provider: provider || 'mtn',
      phoneNumber: '',
    });
  const [showPaymentModal, setShowPaymentModal] = useState(true);

  const [transactionId, setTransactionId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(120);

  const formattedAmount = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const getProviderName = () => {
    return selectedPayment.provider === 'mtn'
      ? 'MTN Mobile Money'
      : 'Orange Money';
  };

  // Cleanup function
  const cleanup = useCallback(() => {
    // Abort polling
    if (pollingControllerRef.current) {
      PaymentService.stopPolling(transactionId);
      pollingControllerRef.current = null;
    }

    // Clear countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Clear success timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  }, [transactionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Handle payment method confirmation
  const handlePaymentConfirm = useCallback(
    (selection: PaymentMethodSelection) => {
      setSelectedPayment(selection);
      setShowPaymentModal(false);
      setCurrentStep('processing');
      initializePaymentWithSelection(selection);
    },
    [],
  );

  // Validate phone number
  const validatePhoneNumber = useCallback((phone: string, provider: string) => {
    const medium = provider === 'orange' ? 'orange' : 'mtn';
    return PaymentService.validatePhoneNumber(phone, medium);
  }, []);

  // Initialize payment
  const initializePaymentWithSelection = async (
    selection: PaymentMethodSelection,
  ) => {
    if (!validatePhoneNumber(selection.phoneNumber!, selection.provider)) {
      setError(
        t('please_enter_valid_phone', {
          provider: selection.provider.toUpperCase(),
        }),
      );
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
      const medium = selection.provider === 'orange' ? 'orange' : 'mtn';

      const paymentRequest = createPaymentRequest(
        orderId,
        selection.phoneNumber!,
        medium,
        user.fullName,
        user.email,
        serviceFee,
      );

      initializePayment(paymentRequest, {
        onSuccess: (result) => {
          if (!isMountedRef.current) return;

          if (result.success && result.transactionId) {
            setTransactionId(result.transactionId);
            setCurrentStep('verification');
            startCountdown();
            // Start polling immediately after initialization
            startPaymentPolling(result.transactionId);
          } else {
            setError(result.error || t('failed_initialize_payment'));
            setCurrentStep('failed');
          }
        },
        onError: (error) => {
          if (!isMountedRef.current) return;
          setError(t('failed_initialize_payment_retry'));
          setCurrentStep('failed');
        },
      });
    } catch (error) {
      if (!isMountedRef.current) return;
      setError(t('failed_initialize_payment_retry'));
      setCurrentStep('failed');
    }
  };

  // Start countdown timer
  const startCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    setCountdown(120);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start payment status polling
  const startPaymentPolling = async (txnId: string) => {
    if (!isMountedRef.current) return;

    try {
      // Enhanced error handling for Android
      const controller = await PaymentService.pollPaymentStatus(
        txnId,
        (status) => {
          if (!isMountedRef.current) return;

          // Log status for debugging platform-specific issues
          if (__DEV__ && Platform.OS === 'android') {
            console.log('[PaymentProcessing] Android polling status:', status);
          }

          if (status.status === 'completed') {
            handlePaymentSuccess();
          } else if (status.status === 'failed') {
            cleanup();
            setCurrentStep('failed');
            setError(status.message || t('payment_failed'));
          } else if (status.status === 'expired') {
            cleanup();
            setCurrentStep('failed');
            setError(status.message || t('payment_expired'));
          }
          // If pending, keep polling (automatically handled by PaymentService)
        },
        (error) => {
          if (!isMountedRef.current) return;
          console.error('[PaymentProcessing] Polling error:', error);
          cleanup();
          setCurrentStep('failed');
          setError(error || t('payment_verification_failed'));
        },
      );

      pollingControllerRef.current = controller;

      if (__DEV__ && Platform.OS === 'android') {
        console.log('[PaymentProcessing] Android polling started successfully');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error('[PaymentProcessing] Failed to start polling:', error);
      cleanup();
      setCurrentStep('failed');
      setError(t('failed_to_start_verification'));
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    if (!isMountedRef.current) return;

    cleanup();
    setCurrentStep('success');
    completePayment();

    // Auto-navigate after 3 seconds
    successTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      handleSuccessAndNavigateHome();
    }, 3000);
  };

  // Navigate to home after success
  const handleSuccessAndNavigateHome = () => {
    if (!isMountedRef.current) return;

    clearCart();
    completePayment();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'CustomerApp',
        },
      ],
    });
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle retry
  const handleRetry = () => {
    cleanup();
    setCurrentStep('method_selection');
    setShowPaymentModal(true);
    setError('');
    setCountdown(120);
    setTransactionId('');
  };

  // Render methods
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

  const renderVerification = () => (
    <Card mode="outlined" className="mx-4 mt-6">
      <Card.Content className="p-6">
        <View className="items-center mb-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <IoniconsIcon
              name="phone-portrait"
              size={32}
              color={colors.primary}
            />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: colors.onSurface }}
          >
            {t('complete_payment_on_phone')}
          </Text>
          <Text
            className="text-base text-center mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('check_phone_for_prompt', { provider: getProviderName() })}
          </Text>
        </View>

        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <IoniconsIcon
              name="information-circle"
              size={24}
              color={colors.primary}
              className="mr-3 mt-1"
            />
            <View className="flex-1">
              <Text
                className="text-sm font-medium mb-2"
                style={{ color: colors.primary }}
              >
                {t('next_steps')}
              </Text>
              <Text
                className="text-sm mb-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                1. Check your phone for a payment prompt
              </Text>
              <Text
                className="text-sm mb-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                2. Enter your Mobile Money PIN
              </Text>
              <Text
                className="text-sm"
                style={{ color: colors.onSurfaceVariant }}
              >
                3. We&apos;ll verify your payment automatically
              </Text>
            </View>
          </View>
        </View>

        <View className="items-center">
          <Text
            className="text-sm mb-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('time_remaining', { time: formatTime(countdown) })}
          </Text>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            className="mb-4"
          />
          <Text
            className="text-base font-medium"
            style={{ color: colors.onSurface }}
          >
            {t('verifying_payment')}
          </Text>
          <Text
            className="text-sm mt-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('please_wait_checking_status')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

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
            className="text-base text-center mb-4"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('payment_confirmed_order_processing')}
          </Text>
          <Text
            className="text-sm text-center mb-6"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('redirecting_home')}
          </Text>

          <TouchableOpacity
            className="rounded-lg py-4 px-8 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSuccessAndNavigateHome}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.onPrimary }}
            >
              {t('continue_to_home')}
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

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
          {/* to review  */}
          <View className="flex-row justify-between gap-2">
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'method_selection':
        return renderMethodSelection();
      case 'processing':
        return renderProcessing();
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
            onPress={() => {
              cleanup();
              navigation.goBack();
            }}
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

          {serviceFee > 0 && (
            <View
              className="mt-2 pt-2 border-t"
              style={{ borderTopColor: colors.outline }}
            >
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
