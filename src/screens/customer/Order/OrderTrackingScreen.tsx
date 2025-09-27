import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Order, OrderStatus } from '@/src/types';
import Toast from 'react-native-toast-message';
import {
  useOrderById,
  useConfirmOrderReceived,
} from '@/src/hooks/customer/useOrdersApi';
import {
  Typography,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import DeliveryConfirmationModal from '@/src/components/customer/OrderConfirmation/DeliveryConfirmationModal';
import { useDeliveryConfirmation } from '@/src/hooks/customer/useDeliveryConfirmation';

// Define order status steps for the timeline
const ORDER_STATUS_STEPS: {
  status: OrderStatus;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    status: 'pending',
    title: 'Order Placed',
    description: 'We have received your order',
    icon: 'receipt-outline',
  },
  {
    status: 'confirmed',
    title: 'Order Confirmed',
    description: 'Restaurant is preparing your food',
    icon: 'checkmark-circle-outline',
  },
  {
    status: 'preparing',
    title: 'Preparing',
    description: 'Your food is being prepared',
    icon: 'restaurant-outline',
  },
  {
    status: 'ready',
    title: 'Ready for Pickup',
    description: 'Your order is ready for pickup',
    icon: 'checkmark-done-circle-outline',
  },
  {
    status: 'picked_up',
    title: 'Out for Delivery',
    description: 'Your order is on the way',
    icon: 'bicycle-outline',
  },
  {
    status: 'delivered',
    title: 'Delivered',
    description: 'Your order has been delivered',
    icon: 'home-outline',
  },
];

// Map order status to a more user-friendly display
const getStatusDisplayText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    pending: 'Order Placed',
    confirmed: 'Order Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    picked_up: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
};

// Get the current step index based on order status
const getCurrentStepIndex = (status: OrderStatus): number => {
  return ORDER_STATUS_STEPS.findIndex((step) => step.status === status);
};

// Horizontal status step component (icons only)
interface OrderStatusStepProps {
  step: (typeof ORDER_STATUS_STEPS)[0];
  isActive: boolean;
  isCompleted: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const OrderStatusStep: React.FC<OrderStatusStepProps> = ({
  step,
  isActive,
  isCompleted,
  isFirst,
  isLast,
}) => {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center">
      {/* Status indicator circle - icons only */}
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{
          backgroundColor: isCompleted || isActive ? '#007aff' : '#e0e0e0',
        }}
      >
        {isCompleted ? (
          <IoniconsIcon name="checkmark" size={24} color="white" />
        ) : (
          <IoniconsIcon             name={step.icon as any}
            size={24}
            color={isActive ? 'white' : '#666'}
          />
        )}
      </View>
    </View>
  );
};

// Horizontal progress line component - centered to circle radius
interface ProgressLineProps {
  isCompleted: boolean;
}

const ProgressLine: React.FC<ProgressLineProps> = ({ isCompleted }) => {
  return (
    <View
      className="flex-1 mx-2"
      style={{
        height: 2,
        marginTop: 23, // Half of circle height (48/2 = 24) - 1 for line thickness
        backgroundColor: isCompleted ? '#007aff' : '#e0e0e0',
      }}
    />
  );
};

// Order details component
interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <View
      className="rounded-xl p-4 mb-6"
      style={{ backgroundColor: colors.surfaceVariant }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Label color={colors.onSurface} weight="semibold">
          {t('order_details')}
        </Label>
        <Label color={colors.primary} weight="medium">
          #{order.id.substring(0, 8)}
        </Label>
      </View>

      <View className="border-t border-gray-200 pt-3">
        <View className="flex-row justify-between mb-2">
          <Body color={colors.onSurfaceVariant}>{t('restaurant')}</Body>
          <Body color={colors.onSurface}>Restaurant Name</Body>
        </View>
        <View className="flex-row justify-between mb-2">
          <Body color={colors.onSurfaceVariant}>{t('total')}</Body>
          <Body color={colors.onSurface}>
            {order.total.toLocaleString()} XAF
          </Body>
        </View>
        <View className="flex-row justify-between">
          <Body color={colors.onSurfaceVariant}>{t('status')}</Body>
          <Body color={colors.primary}>
            {getStatusDisplayText(order.status)}
          </Body>
        </View>
      </View>
    </View>
  );
};

// ETA component
interface ETAComponentProps {
  order: Order;
}

const ETAComponent: React.FC<ETAComponentProps> = ({ order }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Calculate estimated time (this is a placeholder - in a real app you'd have actual ETA)
  const getETA = () => {
    const statusIndex = getCurrentStepIndex(order.status);
    const minutesRemaining = (ORDER_STATUS_STEPS.length - statusIndex - 1) * 10;
    return minutesRemaining > 0 ? `${minutesRemaining} min` : 'Soon';
  };

  // Only show ETA if order is not yet delivered
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return null;
  }

  return (
    <View
      className="rounded-xl p-4 mb-6 flex-row items-center"
      style={{ backgroundColor: colors.surfaceVariant }}
    >
      <IoniconsIcon name="time-outline" size={24} color="#007aff" />
      <View className="ml-3">
        <Label color={colors.onSurface} weight="semibold">
          {t('estimated_arrival')}
        </Label>
        <Body color={colors.primary}>{getETA()}</Body>
      </View>
    </View>
  );
};

const OrderTrackingScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'OrderTracking'>) => {
  const { orderId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [refreshing, setRefreshing] = useState(false);

  // Use our custom hook for order tracking with polling
  const {
    data: order,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useOrderById(orderId);

  // Delivery confirmation hook
  const {
    isModalVisible,
    showConfirmationModal,
    hideConfirmationModal,
    confirmDelivery,
    isConfirming,
  } = useDeliveryConfirmation();

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <CommonView>
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <Body>{t('loading')}</Body>
        </View>
      </CommonView>
    );
  }

  if (error || !order) {
    return (
      <CommonView>
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <IoniconsIcon             name="alert-circle-outline"
            size={48}
            color={colors.error}
          />
          <Heading5
            color={colors.onSurface}
            weight="semibold"
            style={{ marginTop: 16 }}
          >
            {error ? t('error_loading_order') : t('order_not_found')}
          </Heading5>
          <Body
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginTop: 8, paddingHorizontal: 32 }}
          >
            {error
              ? t('failed_to_load_order_details')
              : t('could_not_find_order_details')}
          </Body>
          <TouchableOpacity
            className="mt-6 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
            onPress={() => navigation.goBack()}
          >
            <Label color="white" weight="medium">
              {t('go_back')}
            </Label>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);

  return (
    <CommonView>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 py-6">
          {/* ETA Component */}
          <ETAComponent order={order} />

          {/* Order Details */}
          <OrderDetails order={order} />

          {/* Progress Timeline */}
          <View className="mb-6">
            <Heading5
              color={colors.onSurface}
              weight="bold"
              style={{ marginBottom: 16 }}
            >
              {t('order_status')}
            </Heading5>

            {/* Horizontal Status Steps */}
            <View className="flex-row items-center mb-6">
              {ORDER_STATUS_STEPS.map((step, index) => (
                <React.Fragment key={step.status}>
                  <OrderStatusStep
                    step={step}
                    isActive={index === currentStepIndex}
                    isCompleted={index < currentStepIndex}
                    isFirst={index === 0}
                    isLast={index === ORDER_STATUS_STEPS.length - 1}
                  />
                  {index < ORDER_STATUS_STEPS.length - 1 && (
                    <ProgressLine isCompleted={index < currentStepIndex} />
                  )}
                </React.Fragment>
              ))}
            </View>

            {/* Current Status Description */}
            {currentStepIndex >= 0 && (
              <View
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.surfaceVariant }}
              >
                <Label
                  color={colors.onSurface}
                  weight="semibold"
                  style={{ marginBottom: 8 }}
                >
                  {ORDER_STATUS_STEPS[currentStepIndex]?.title}
                </Label>
                <Caption color={colors.onSurfaceVariant}>
                  {ORDER_STATUS_STEPS[currentStepIndex]?.description}
                </Caption>
              </View>
            )}
          </View>

          {/* Delivery Confirmation Button - Only show when order is delivered */}
          {order.status === 'delivered' && (
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 rounded-xl mb-4"
              style={{ backgroundColor: colors.primary }}
              onPress={() => {
                showConfirmationModal(orderId, {
                  orderNumber: order.id.substring(0, 8),
                  restaurantName: order.restaurantName || 'Restaurant',
                  deliveryAddress: order.deliveryAddress,
                });
              }}
              disabled={isConfirming}
            >
              <IoniconsIcon                 name="checkmark-circle-outline"
                size={20}
                color="white"
              />
              <Label color="white" weight="medium" style={{ marginLeft: 8 }}>
                {isConfirming
                  ? t('confirming_delivery')
                  : t('confirm_delivery_received')}
              </Label>
            </TouchableOpacity>
          )}

          {/* Support Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center py-4 rounded-xl mb-4"
            style={{ backgroundColor: colors.surfaceVariant }}
            onPress={() => {
              // TODO: Implement contact support functionality
              Toast.show({
                type: 'info',
                text1: t('info'),
                text2: t('contact_support_functionality_not_implemented'),
              });
            }}
          >
            <IoniconsIcon               name="chatbubble-ellipses-outline"
              size={20}
              color={colors.primary}
            />
            <Label
              color={colors.primary}
              weight="medium"
              style={{ marginLeft: 8 }}
            >
              {t('contact_support')}
            </Label>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delivery Confirmation Modal */}
      <DeliveryConfirmationModal
        visible={isModalVisible}
        onClose={hideConfirmationModal}
        orderId={orderId}
        orderNumber={order?.id.substring(0, 8)}
        restaurantName={order?.restaurantName || 'Restaurant'}
        deliveryAddress={order?.deliveryAddress}
        onConfirmSuccess={() => {
          // Refresh order data after confirmation
          refetch();
        }}
      />
    </CommonView>
  );
};

export default OrderTrackingScreen;
