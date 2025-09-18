import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Order, OrderStatus } from '@/src/types';
import Toast from 'react-native-toast-message';
import { useOrderById } from '@/src/hooks/customer/useOrdersApi';

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
          <Ionicons name="checkmark" size={24} color="white" />
        ) : (
          <Ionicons
            name={step.icon as any}
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
        <Text
          className="font-semibold text-base"
          style={{ color: colors.onSurface }}
        >
          {t('order_details')}
        </Text>
        <Text className="font-medium" style={{ color: colors.primary }}>
          #{order.id.substring(0, 8)}
        </Text>
      </View>

      <View className="border-t border-gray-200 pt-3">
        <View className="flex-row justify-between mb-2">
          <Text style={{ color: colors.onSurfaceVariant }}>
            {t('restaurant')}
          </Text>
          <Text style={{ color: colors.onSurface }}>Restaurant Name</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text style={{ color: colors.onSurfaceVariant }}>{t('total')}</Text>
          <Text style={{ color: colors.onSurface }}>
            {order.total.toLocaleString()} XAF
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text style={{ color: colors.onSurfaceVariant }}>{t('status')}</Text>
          <Text style={{ color: colors.primary }}>
            {getStatusDisplayText(order.status)}
          </Text>
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
      <Ionicons name="time-outline" size={24} color="#007aff" />
      <View className="ml-3">
        <Text
          className="font-semibold text-base"
          style={{ color: colors.onSurface }}
        >
          {t('estimated_arrival')}
        </Text>
        <Text style={{ color: colors.primary }}>{getETA()}</Text>
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
          <Text>{t('loading')}</Text>
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
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.error}
          />
          <Text
            className="text-xl font-semibold mt-4"
            style={{ color: colors.onSurface }}
          >
            {error ? t('error_loading_order') : t('order_not_found')}
          </Text>
          <Text
            className="mt-2 text-center px-8"
            style={{ color: colors.onSurfaceVariant }}
          >
            {error
              ? t('failed_to_load_order_details')
              : t('could_not_find_order_details')}
          </Text>
          <TouchableOpacity
            className="mt-6 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-medium">{t('go_back')}</Text>
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
            <Text
              className="text-xl font-bold mb-4"
              style={{ color: colors.onSurface }}
            >
              {t('order_status')}
            </Text>

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
                <Text
                  className="text-base font-semibold mb-2"
                  style={{ color: colors.onSurface }}
                >
                  {ORDER_STATUS_STEPS[currentStepIndex]?.title}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {ORDER_STATUS_STEPS[currentStepIndex]?.description}
                </Text>
              </View>
            )}
          </View>

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
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={colors.primary}
            />
            <Text
              className="font-medium ml-2"
              style={{ color: colors.primary }}
            >
              {t('contact_support')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderTrackingScreen;
