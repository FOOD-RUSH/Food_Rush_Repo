import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { OrderFlowState } from '@/src/hooks/customer/useOrderFlow';

interface OrderStatusModalProps {
  visible: boolean;
  flowState: OrderFlowState;
  onConfirmOrder: () => void;
  onProceedToPayment: () => void;
  onClose: () => void;
  isConfirmingOrder: boolean;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  visible,
  flowState,
  onConfirmOrder,
  onProceedToPayment,
  onClose,
  isConfirmingOrder,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Auto-proceed to payment after customer confirmation
  useEffect(() => {
    if (flowState.step === 'payment_processing') {
      setTimeout(() => {
        onProceedToPayment();
      }, 1500);
    }
  }, [flowState.step, onProceedToPayment]);

  const getStepIcon = () => {
    switch (flowState.step) {
      case 'creating':
        return <ActivityIndicator size={48} color={colors.primary} />;
      case 'pending_restaurant_confirmation':
        return <ActivityIndicator size={48} color={colors.primary} />;
      case 'ready_for_customer_confirmation':
        return <IoniconsIcon name="checkmark-circle" size={48} color="#4CAF50" />;
      case 'customer_confirming':
        return <ActivityIndicator size={48} color={colors.primary} />;
      case 'payment_processing':
        return <IoniconsIcon name="card" size={48} color={colors.primary} />;
      case 'completed':
        return <IoniconsIcon name="checkmark-circle" size={48} color="#4CAF50" />;
      case 'failed':
        return <IoniconsIcon name="close-circle" size={48} color={colors.error} />;
      default:
        return <ActivityIndicator size={48} color={colors.primary} />;
    }
  };

  const getStepTitle = () => {
    switch (flowState.step) {
      case 'creating':
        return 'Creating Order...';
      case 'pending_restaurant_confirmation':
        return 'Waiting for Restaurant';
      case 'ready_for_customer_confirmation':
        return 'Order Confirmed!';
      case 'customer_confirming':
        return 'Confirming Order...';
      case 'payment_processing':
        return 'Proceeding to Payment...';
      case 'completed':
        return 'Order Successful!';
      case 'failed':
        return 'Order Failed';
      default:
        return 'Processing...';
    }
  };

  const getStepDescription = () => {
    switch (flowState.step) {
      case 'creating':
        return 'Please wait while we create your order...';
      case 'pending_restaurant_confirmation':
        return 'The restaurant is reviewing your order. This usually takes 1-2 minutes.';
      case 'ready_for_customer_confirmation':
        return 'Great! The restaurant has confirmed your order. Tap below to lock in the delivery fee and proceed to payment.';
      case 'customer_confirming':
        return 'Confirming your order and locking delivery fee...';
      case 'payment_processing':
        return 'Redirecting you to payment...';
      case 'completed':
        return 'Your order has been successfully placed and payment completed!';
      case 'failed':
        return flowState.error || 'Something went wrong. Please try again.';
      default:
        return 'Processing your request...';
    }
  };

  const getActionButton = () => {
    switch (flowState.step) {
      case 'ready_for_customer_confirmation':
        return (
          <TouchableOpacity
            className="rounded-lg py-4 px-8 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={onConfirmOrder}
            disabled={isConfirmingOrder}
          >
            {isConfirmingOrder ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text
                className="text-base font-semibold"
                style={{ color: colors.onPrimary }}
              >
                Confirm Order & Proceed to Payment
              </Text>
            )}
          </TouchableOpacity>
        );
      case 'failed':
        return (
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 rounded-lg py-4 items-center border"
              style={{ borderColor: colors.outline }}
              onPress={onClose}
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
              onPress={onClose}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors.onPrimary }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'completed':
        return (
          <TouchableOpacity
            className="rounded-lg py-4 px-8 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={onClose}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.onPrimary }}
            >
              View Order Status
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View
          className="mx-6 rounded-2xl p-6 max-w-sm w-full"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Order ID */}
          {flowState.orderId && (
            <View className="items-center mb-4">
              <Text
                className="text-sm font-medium"
                style={{ color: colors.onSurfaceVariant }}
              >
                Order #{flowState.orderId}
              </Text>
            </View>
          )}

          {/* Icon */}
          <View className="items-center mb-4">{getStepIcon()}</View>

          {/* Title */}
          <Text
            className="text-xl font-bold text-center mb-2"
            style={{ color: colors.onSurface }}
          >
            {getStepTitle()}
          </Text>

          {/* Description */}
          <Text
            className="text-base text-center mb-6"
            style={{ color: colors.onSurfaceVariant }}
          >
            {getStepDescription()}
          </Text>

          {/* Order Details */}
          {flowState.orderData && (
            <View
              className="border rounded-lg p-4 mb-6"
              style={{ borderColor: colors.outline }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Subtotal:
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.onSurface }}
                >
                  {flowState.orderData.subtotal.toLocaleString()} FCFA
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Delivery Fee:
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.onSurface }}
                >
                  {flowState.orderData.deliveryPrice.toLocaleString()} FCFA
                </Text>
              </View>
              <View
                className="h-px my-2"
                style={{ backgroundColor: colors.outline }}
              />
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base font-bold"
                  style={{ color: colors.onSurface }}
                >
                  Total:
                </Text>
                <Text
                  className="text-base font-bold"
                  style={{ color: colors.primary }}
                >
                  {flowState.orderData.total.toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          )}

          {/* Action Button */}
          {getActionButton()}

          {/* Progress Indicator for waiting states */}
          {(flowState.step === 'pending_restaurant_confirmation' ||
            flowState.step === 'creating' ||
            flowState.step === 'customer_confirming') && (
            <View className="items-center mt-4">
              <View className="flex-row space-x-2">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.outline }}
                />
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.outline }}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OrderStatusModal;
