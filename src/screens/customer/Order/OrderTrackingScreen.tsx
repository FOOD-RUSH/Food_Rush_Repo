import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme, Card, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useOrderById, useCancelOrder } from '@/src/hooks/customer/useOrdersApi';
import { useAuthUser } from '@/src/stores/customerStores';
import EnhancedPaymentService from '@/src/services/customer/enhancedPayment.service';
import PaymentMethodModal from '@/src/components/customer/PaymentMethodModal';
import { PaymentMethodSelection } from '@/src/types/transaction';

type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'payment_required'
  | 'payment_processing'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

type PaymentStep = 
  | 'idle'
  | 'method_selection'
  | 'processing'
  | 'polling'
  | 'success'
  | 'failed';

const OrderTrackingScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'OrderTracking'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;
  const user = useAuthUser();

  // State management
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('idle');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodSelection>({
    method: 'mobile_money',
    provider: 'mtn',
    phoneNumber: '',
  });
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300);

  // Fetch order details
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useOrderById(orderId);

  // Cancel order mutation
  const cancelOrderMutation = useCancelOrder();

  // Timer for payment timeout
  useEffect(() => {
    if (paymentStep === 'polling' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStep('failed');
            setPaymentError('Payment session expired. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStep, timeRemaining]);

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle payment method selection
  const handlePaymentConfirm = useCallback(async (selection: PaymentMethodSelection) => {
    if (!user?.fullName || !user?.email) {
      Alert.alert(t('error'), 'User information is missing. Please log in again.');
      return;
    }

    setSelectedPayment(selection);
    setShowPaymentModal(false);
    setPaymentStep('processing');
    setPaymentError('');
    setTimeRemaining(300);

    try {
      // Validate phone number
      if (!EnhancedPaymentService.validatePhoneNumber(selection.phoneNumber, selection.provider)) {
        setPaymentError(`Please enter a valid ${selection.provider.toUpperCase()} phone number`);
        setPaymentStep('failed');
        return;
      }

      // Initialize payment
      const paymentRequest = {
        orderId,
        method: 'mobile_money' as const,
        phone: selection.phoneNumber,
        medium: selection.provider,
        name: user.fullName,
        email: user.email,
      };

      setPaymentStep('polling');
      setPaymentProgress(0.1);

      // Process payment with polling
      const result = await EnhancedPaymentService.processPaymentWithRetry(
        paymentRequest,
        (status) => {
          if (status.status === 'PENDING') {
            setPaymentProgress(0.5);
          }
        },
      );

      if (result.success) {
        setPaymentStep('success');
        setPaymentProgress(1);
        setTransactionId(result.transactionId);
        
        setTimeout(() => {
          refetch();
        }, 2000);
      } else {
        setPaymentStep('failed');
        setPaymentError(result.error || 'Payment failed');
        setPaymentProgress(0);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStep('failed');
      setPaymentError(error.message || 'Payment processing failed');
      setPaymentProgress(0);
    }
  }, [user, orderId, t, refetch]);

  // Handle payment retry
  const handlePaymentRetry = useCallback(() => {
    setPaymentStep('method_selection');
    setShowPaymentModal(true);
    setPaymentError('');
    setPaymentProgress(0);
    setTimeRemaining(300);
  }, []);

  // Handle cancel order
  const handleCancelOrder = useCallback(() => {
    Alert.alert(
      t('cancel_order'),
      t('cancel_order_confirmation'),
      [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes_cancel'),
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrderMutation.mutateAsync({
                orderId,
                reason: 'Customer cancellation',
              });
              navigation.goBack();
            } catch (error) {
              Alert.alert(t('error'), 'Failed to cancel order');
            }
          },
        },
      ],
    );
  }, [t, navigation, cancelOrderMutation, orderId]);

  // Get order status info
  const getOrderStatusInfo = (status: string) => {
    const statusMap: Record<string, {
      title: string;
      subtitle: string;
      icon: string;
      color: string;
      progress: number;
    }> = {
      pending: {
        title: t('waiting_for_restaurant'),
        subtitle: t('restaurant_confirmation_time'),
        icon: 'time-outline',
        color: colors.primary,
        progress: 0.2,
      },
      confirmed: {
        title: t('order_confirmed'),
        subtitle: t('proceed_to_payment'),
        icon: 'checkmark-circle',
        color: '#4CAF50',
        progress: 0.4,
      },
      preparing: {
        title: t('preparing'),
        subtitle: t('order_preparing'),
        icon: 'restaurant',
        color: '#FF9800',
        progress: 0.6,
      },
      ready_for_pickup: {
        title: t('ready_for_pickup'),
        subtitle: t('order_ready'),
        icon: 'bag-check',
        color: '#2196F3',
        progress: 0.8,
      },
      out_for_delivery: {
        title: t('out_for_delivery'),
        subtitle: t('order_delivering'),
        icon: 'bicycle',
        color: '#9C27B0',
        progress: 0.9,
      },
      delivered: {
        title: t('delivered'),
        subtitle: t('order_completed'),
        icon: 'checkmark-done-circle',
        color: '#4CAF50',
        progress: 1.0,
      },
      cancelled: {
        title: t('cancelled'),
        subtitle: t('order_was_cancelled'),
        icon: 'close-circle',
        color: colors.error,
        progress: 0,
      },
    };

    return statusMap[status] || {
      title: 'Unknown Status',
      subtitle: '',
      icon: 'help-circle',
      color: colors.onSurfaceVariant,
      progress: 0,
    };
  };

  // Render payment section
  const renderPaymentSection = () => {
    if (!order || order.status !== 'confirmed') return null;

    return (
      <Card style={{ margin: 16, marginBottom: 8 }}>
        <Card.Content style={{ padding: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.primaryContainer,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <IoniconsIcon
                name="card-outline"
                size={28}
                color={colors.primary}
              />
            </View>
            
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.onSurface,
                marginBottom: 8,
              }}
            >
              {t('payment_required')}
            </Text>
            
            <Text
              style={{
                fontSize: 14,
                color: colors.onSurfaceVariant,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {t('payment_after_restaurant_confirmation')}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 32,
                paddingVertical: 12,
                borderRadius: 24,
              }}
              onPress={() => {
                setPaymentStep('method_selection');
                setShowPaymentModal(true);
              }}
            >
              <Text
                style={{
                  color: colors.onPrimary,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                {t('proceed_to_payment')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render payment progress
  const renderPaymentProgress = () => {
    if (paymentStep === 'idle') return null;

    return (
      <Card style={{ margin: 16, marginBottom: 8 }}>
        <Card.Content style={{ padding: 20 }}>
          {paymentStep === 'processing' && (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.onSurface,
                  marginTop: 16,
                }}
              >
                {t('processing_payment')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                {t('please_wait')}
              </Text>
            </View>
          )}

          {paymentStep === 'polling' && (
            <View>
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.onSurface,
                    marginBottom: 8,
                  }}
                >
                  {t('processing_payment')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.onSurfaceVariant,
                    textAlign: 'center',
                  }}
                >
                  Check your {EnhancedPaymentService.getProviderDisplayName(selectedPayment.provider)} phone and enter your PIN
                </Text>
              </View>

              <ProgressBar
                progress={paymentProgress}
                color={colors.primary}
                style={{ height: 8, borderRadius: 4, marginBottom: 16 }}
              />

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.onSurfaceVariant,
                  }}
                >
                  Time remaining: {formatTimeRemaining(timeRemaining)}
                </Text>
              </View>
            </View>
          )}

          {paymentStep === 'success' && (
            <View style={{ alignItems: 'center' }}>
              <IoniconsIcon
                name="checkmark-circle"
                size={48}
                color="#4CAF50"
                style={{ marginBottom: 16 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.onSurface,
                  marginBottom: 8,
                }}
              >
                {t('payment_successful')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                }}
              >
                {t('payment_completed')}
              </Text>
            </View>
          )}

          {paymentStep === 'failed' && (
            <View style={{ alignItems: 'center' }}>
              <IoniconsIcon
                name="close-circle"
                size={48}
                color={colors.error}
                style={{ marginBottom: 16 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.onSurface,
                  marginBottom: 8,
                }}
              >
                {t('payment_failed')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                  marginBottom: 20,
                }}
              >
                {paymentError}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 20,
                }}
                onPress={handlePaymentRetry}
              >
                <Text
                  style={{
                    color: colors.onPrimary,
                  fontWeight: '600',
                }}
              >
                {t('retry')}
              </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <CommonView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: colors.onSurfaceVariant,
            }}
          >
            {t('loading_order_details')}
          </Text>
        </View>
      </CommonView>
    );
  }

  if (error || !order) {
    return (
      <CommonView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <IoniconsIcon
            name="alert-circle"
            size={64}
            color={colors.error}
            style={{ marginBottom: 16 }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.onSurface,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {t('could_not_find_order_details')}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 20,
              marginTop: 16,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: colors.onPrimary,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              {t('go_back')}
            </Text>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  const statusInfo = getOrderStatusInfo(order.status);

  return (
    <CommonView>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.outline + '30',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <IoniconsIcon
              name="arrow-back"
              size={24}
              color={colors.onSurface}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.onSurface,
              }}
            >
              {t('track_order')}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.onSurfaceVariant,
              }}
            >
              Order #{orderId}
            </Text>
          </View>
        </View>

        {/* Order Status */}
        <Card style={{ margin: 16, marginBottom: 8 }}>
          <Card.Content style={{ padding: 20 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: statusInfo.color + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <IoniconsIcon
                  name={statusInfo.icon as any}
                  size={40}
                  color={statusInfo.color}
                />
              </View>
              
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: colors.onSurface,
                  marginBottom: 8,
                }}
              >
                {statusInfo.title}
              </Text>
              
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                }}
              >
                {statusInfo.subtitle}
              </Text>
            </View>

            <ProgressBar
              progress={statusInfo.progress}
              color={statusInfo.color}
              style={{ height: 6, borderRadius: 3 }}
            />
          </Card.Content>
        </Card>

        {/* Payment Section */}
        {renderPaymentSection()}
        {renderPaymentProgress()}

        {/* Order Details */}
        <Card style={{ margin: 16, marginBottom: 8 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.onSurface,
                marginBottom: 16,
              }}
            >
              {t('order_details')}
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  marginBottom: 4,
                }}
              >
                {t('total')}:
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.primary,
                }}
              >
                {EnhancedPaymentService.formatAmount(order.total)} XAF
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  marginBottom: 4,
                }}
              >
                {t('payment_method')}:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.onSurface,
                }}
              >
                {order.paymentMethod === 'mobile_money' ? 'Mobile Money' : order.paymentMethod}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  marginBottom: 4,
                }}
              >
                {t('order_placed')}:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.onSurface,
                }}
              >
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Cancel Order Button */}
        {(order.status === 'pending' || order.status === 'confirmed') && (
          <View style={{ margin: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.errorContainer,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={handleCancelOrder}
            >
              <Text
                style={{
                  color: colors.onErrorContainer,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                {t('cancel_order')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        onDismiss={() => {
          setShowPaymentModal(false);
          setPaymentStep('idle');
        }}
        onConfirm={handlePaymentConfirm}
        currentSelection={selectedPayment}
      />
    </CommonView>
  );
};

export default OrderTrackingScreen;