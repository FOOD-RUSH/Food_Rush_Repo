import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Animated, TouchableOpacity } from 'react-native';
import {
  Button,
  Badge,
  Divider,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import {
  useGetOrderById,
  useConfirmOrder,
  useRejectOrder,
} from '@/src/hooks/restaurant/useOrderApi';
import { OrderItem } from '@/src/services/restaurant/orderApi';
import {
  Typography,
  Heading2,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import {
  getCustomerName,
  getCustomerPhone,
  getCustomerEmail,
  formatOrderTotal,
  ORDER_STATUS_COLORS,
  logOrderData,
} from '@/src/utils/orderUtils';
import { formatDate } from '@/src/utils/dateUtils';

const OrderDetailsScreen: React.FC<
  RootStackScreenProps<'RestaurantOrderDetails'>
> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { orderId } = route.params;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // API hooks
  const { data: orderData, isLoading, error, refetch } = useGetOrderById(orderId);
  const confirmOrderMutation = useConfirmOrder();
  const rejectOrderMutation = useRejectOrder();
  
  // Log order data for debugging
  console.log(`📊 [OrderDetailsScreen] Order ${orderId} data:`, {
    orderData,
    isLoading,
    error
  });
  
  // Log detailed order information if data is available
  if (orderData) {
    logOrderData(orderData, `DETAILS-${orderId}`);
  }

  // State
  const [status, setStatus] = useState(orderData?.status || 'pending');
  const [prepProgress, setPrepProgress] = useState(0);

  // Responsive utilities
  const buttonHeight = 48;
  const fontSize = 16;

  useEffect(() => {
    if (orderData) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          speed: 1,
          bounciness: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Simulate preparation progress
      if (status === 'preparing') {
        const interval = setInterval(() => {
          setPrepProgress((prev) => {
            if (prev >= 1) {
              clearInterval(interval);
              return 1;
            }
            return prev + 0.05;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [status, orderData, fadeAnim, slideAnim]);

  // Handle loading state
  if (isLoading && !orderData) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center p-6">
          <MaterialCommunityIcon 
            name="loading"
            size={48}
            color={colors.primary}
            animation="spin"
          />
          <Heading5
            color={colors.onSurface}
            weight="bold"
            align="center"
            style={{ marginTop: 16 }}
          >
            {t('loading_order_details')}
          </Heading5>
          <Body
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginTop: 8 }}
          >
            {t('please_wait')}
          </Body>
        </View>
      </CommonView>
    );
  }

  // Handle error state
  if (error) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center p-6">
          <MaterialCommunityIcon 
            name="alert-circle"
            size={48}
            color={colors.error}
          />
          <Heading5
            color={colors.onSurface}
            weight="bold"
            align="center"
            style={{ marginTop: 16 }}
          >
            {t('error_loading_order')}
          </Heading5>
          <Body
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginTop: 8 }}
          >
            {error.message || t('failed_to_load_order_details')}
          </Body>
          <Button
            mode="contained"
            onPress={() => refetch()}
            style={{ marginTop: 16 }}
          >
            {t('retry')}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 8 }}
          >
            {t('go_back')}
          </Button>
        </View>
      </CommonView>
    );
  }

  // Handle order not found
  if (!orderData) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center p-6">
          <MaterialCommunityIcon 
            name="alert-circle"
            size={48}
            color={colors.error}
          />
          <Heading5
            color={colors.onSurface}
            weight="bold"
            align="center"
            style={{ marginTop: 16 }}
          >
            {t('order_not_found')}
          </Heading5>
          <Body
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginTop: 8 }}
          >
            {t('order_could_not_be_found')}
          </Body>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          >
            {t('go_back')}
          </Button>
        </View>
      </CommonView>
    );
  }

  const getStatusColor = () => {
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || colors.onSurfaceVariant;
  };

  const handleStatusChange = async (newStatus: typeof status) => {
    if (!orderData) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatus(newStatus);

      if (newStatus === 'preparing') {
        await confirmOrderMutation.mutateAsync(orderId);
        setPrepProgress(0);
      } else if (newStatus === 'cancelled') {
        await rejectOrderMutation.mutateAsync(orderId);
      }
    } catch (error: any) {
      // Handle session expired errors gracefully
      if (
        error?.code === 'SESSION_EXPIRED' ||
        error?.message?.includes('session has expired')
      ) {
        // Don't show error to user, let the app handle logout
        return;
      }

      // For other errors, revert status and could show user-friendly message
      setStatus(orderData.status);
    }
  };

  const getEstimatedTimeLeft = () => {
    const totalTime = orderData.estimatedPrepTime;
    const timeLeft = Math.ceil(totalTime * (1 - prepProgress));
    return timeLeft > 0 ? timeLeft : 0;
  };

  return (
    <CommonView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Order Header */}
          <View
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Heading2 color={colors.onSurface} weight="bold">
                  {t('order_prefix')}
                  {orderId.length > 9 ? orderId.substring(0, 9) + '...' : orderId}
                </Heading2>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcon                     name="clock-outline"
                    size={18}
                    color={colors.onSurfaceVariant}
                  />
                  <Body
                    color={colors.onSurfaceVariant}
                    style={{ marginLeft: 8 }}
                  >
                    {orderData.time}
                  </Body>
                </View>
              </View>
              <Badge size={24} style={{ backgroundColor: getStatusColor() }}>
                <Label color="white" weight="medium">
                  {t(status)}
                </Label>
              </Badge>
            </View>

            {status === 'preparing' && (
              <View className="mt-4">
                <View className="flex-row justify-between mb-1">
                  <Body color={colors.onSurfaceVariant}>
                    {t('preparation_progress')}
                  </Body>
                  <Body color={colors.onSurfaceVariant}>
                    {getEstimatedTimeLeft()} {t('min_left')}
                  </Body>
                </View>
                <ProgressBar
                  progress={prepProgress}
                  color={colors.primary}
                  className="h-2 rounded-full"
                />
              </View>
            )}
          </View>

          {/* Customer Details */}
          <View
            className="p-5 rounded-xl mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcon                 name="account-circle"
                size={24}
                color={colors.onSurfaceVariant}
              />
              <Heading5
                color={colors.onSurface}
                weight="semibold"
                style={{ marginLeft: 8 }}
              >
                {t('customer_details')}
              </Heading5>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcon                   name="account"
                  size={18}
                  color={colors.onSurfaceVariant}
                />
                <Body color={colors.onSurface} style={{ marginLeft: 12 }}>
                  {getCustomerName(orderData)}
                </Body>
              </View>

              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcon                   name="phone"
                  size={18}
                  color={colors.onSurfaceVariant}
                />
                <Body color={colors.onSurface} style={{ marginLeft: 12 }}>
                  {getCustomerPhone(orderData)}
                </Body>
              </View>

              <View className="flex-row items-start">
                <MaterialCommunityIcon                   name="map-marker"
                  size={18}
                  color={colors.onSurfaceVariant}
                  style={{ marginTop: 2 }}
                />
                <Body
                  color={colors.onSurface}
                  style={{ marginLeft: 12, flex: 1 }}
                >
                  {orderData.customerAddress || 'No address provided'}
                </Body>
              </View>
            </View>

            {orderData.specialInstructions && (
              <View
                className="mt-4 p-3 rounded-lg border"
                style={{
                  backgroundColor: colors.warningContainer || '#FEF3C7',
                  borderColor: colors.warning || '#F59E0B',
                }}
              >
                <View className="flex-row items-center">
                  <MaterialCommunityIcon                     name="alert-circle"
                    size={18}
                    color={colors.warning || '#D97706'}
                  />
                  <Label
                    color={colors.onWarningContainer || '#92400E'}
                    weight="medium"
                    style={{ marginLeft: 8 }}
                  >
                    {t('special_instructions')}
                  </Label>
                </View>
                <Body
                  color={colors.onWarningContainer || '#92400E'}
                  style={{ marginTop: 4 }}
                >
                  {orderData.specialInstructions}
                </Body>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View
            className="p-5 rounded-xl mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcon                 name="food"
                size={24}
                color={colors.onSurfaceVariant}
              />
              <Heading5
                color={colors.onSurface}
                weight="semibold"
                style={{ marginLeft: 8 }}
              >
                {t('order_items')}
              </Heading5>
            </View>

            {orderData.items.map((item: OrderItem, index: number) => (
              <View
                key={item.id}
                className={index !== 0 ? 'pt-3 pb-2' : 'pb-2'}
                style={{
                  borderTopWidth: index !== 0 ? 1 : 0,
                  borderTopColor: colors.outline,
                }}
              >
                <View className="flex-row justify-between">
                  <View className="flex-row items-center flex-1">
                    <Caption
                      color={colors.onSurfaceVariant}
                      style={{ width: 32 }}
                    >
                      {item.quantity}x
                    </Caption>
                    <View style={{ flex: 1 }}>
                      <Label
                        color={colors.onSurface}
                        weight="medium"
                      >
                        {item.name}
                      </Label>
                      {item.description && (
                        <Caption
                          color={colors.onSurfaceVariant}
                          style={{ marginTop: 2 }}
                        >
                          {item.description}
                        </Caption>
                      )}
                    </View>
                  </View>
                  <Label color={colors.primary} weight="semibold">
                    {(item.price * item.quantity).toLocaleString()}{' '}
                    {t('currency_xaf')}
                  </Label>
                </View>

                {item.modifications && item.modifications.length > 0 && (
                  <View className="ml-8 mt-1">
                    {item.modifications.map((mod: string, modIndex: number) => (
                      <View key={modIndex} className="flex-row items-center">
                        <MaterialCommunityIcon                           name="circle-small"
                          size={20}
                          color={colors.onSurfaceVariant}
                        />
                        <Caption color={colors.onSurfaceVariant}>{mod}</Caption>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <Divider className="my-3" />

            <View className="space-y-2">
              <View className="flex-row justify-between mb-2">
                <Body color={colors.onSurfaceVariant}>{t('subtotal')}</Body>
                <Body color={colors.onSurface}>
                  {formatOrderTotal(orderData.subtotal)}
                </Body>
              </View>

              {orderData.tax && (
                <View className="flex-row justify-between mb-2">
                  <Body color={colors.onSurfaceVariant}>{t('tax')}</Body>
                  <Body color={colors.onSurface}>
                    {formatOrderTotal(orderData.tax)}
                  </Body>
                </View>
              )}

              {(orderData.deliveryFee || orderData.deliveryPrice) && (
                <View className="flex-row justify-between mb-2">
                  <Body color={colors.onSurfaceVariant}>
                    {t('delivery_fee')}
                  </Body>
                  <Body color={colors.onSurface}>
                    {formatOrderTotal(orderData.deliveryFee || orderData.deliveryPrice)}
                  </Body>
                </View>
              )}

              <View
                className="flex-row justify-between mt-2 pt-2"
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.outline,
                }}
              >
                <Heading5 color={colors.onSurface} weight="bold">
                  {t('total')}
                </Heading5>
                <Heading5 color={colors.primary} weight="bold">
                  {formatOrderTotal(orderData.total)}
                </Heading5>
              </View>
            </View>

            <View className="mt-4 flex-row items-center">
              <MaterialCommunityIcon                 name={
                  orderData.paymentMethod === 'credit_card'
                    ? 'credit-card'
                    : orderData.paymentMethod === 'cash'
                      ? 'cash'
                      : 'cellphone'
                }
                size={20}
                color={colors.onSurfaceVariant}
              />
              <Body color={colors.onSurface} style={{ marginLeft: 8 }}>
                {t('paid_with')}{' '}
                {orderData.paymentMethod === 'credit_card'
                  ? t('credit_card')
                  : orderData.paymentMethod === 'cash'
                    ? t('cash')
                    : t('mobile_payment')}
              </Body>
            </View>
          </View>

          {/* Order Actions */}
          <View className="px-4 pb-4">
            {status === 'pending' && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 rounded-xl p-4"
                  style={{
                    backgroundColor: colors.error,
                  }}
                  onPress={() => handleStatusChange('cancelled')}
                >
                  <View className="flex items-center">
                    <MaterialCommunityIcon
                      name="close"
                      size={24}
                      color="white"
                    />
                    <Body
                      color="white"
                      weight="bold"
                      className="mt-1"
                      align="center"
                    >
                      {t('reject_order')}
                    </Body>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="flex-1 rounded-xl p-4"
                  style={{
                    backgroundColor: '#4CAF50',
                  }}
                  onPress={() => handleStatusChange('preparing')}
                >
                  <View className="flex items-center">
                    <MaterialCommunityIcon
                      name="check"
                      size={24}
                      color="white"
                    />
                    <Body
                      color="white"
                      weight="bold"
                      className="mt-1"
                      align="center"
                    >
                      {t('accept_order')}
                    </Body>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {status === 'preparing' && (
              <TouchableOpacity
                className="rounded-xl p-4 mt-2"
                style={{
                  backgroundColor: colors.primary,
                }}
                onPress={() => handleStatusChange('ready')}
                disabled={prepProgress < 1}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialCommunityIcon
                    name="check-all"
                    size={24}
                    color="white"
                  />
                  <Body
                    color="white"
                    weight="bold"
                    className="ml-2"
                    align="center"
                  >
                    {t('mark_as_ready')}
                  </Body>
                </View>
              </TouchableOpacity>
            )}

            {(status === 'ready' || status === 'cancelled') && (
              <TouchableOpacity
                className="rounded-xl p-4 mt-2"
                style={{
                  backgroundColor: colors.primary,
                }}
                onPress={() => navigation.goBack()}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialCommunityIcon
                    name="arrow-left"
                    size={24}
                    color="white"
                  />
                  <Body
                    color="white"
                    weight="bold"
                    className="ml-2"
                    align="center"
                  >
                    {t('back_to_orders')}
                  </Body>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderDetailsScreen;
