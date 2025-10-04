import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
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
  Heading1,
  Heading3,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import {
  getCustomerName,
  getCustomerPhone,
  formatOrderTotal,
  ORDER_STATUS_COLORS,
} from '@/src/utils/orderUtils';

const OrderDetailsScreen: React.FC<
  RootStackScreenProps<'RestaurantOrderDetails'>
> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { orderId } = route.params;

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetOrderById(orderId);
  const confirmOrderMutation = useConfirmOrder();
  const rejectOrderMutation = useRejectOrder();

  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    return (
      ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] ||
      colors.onSurfaceVariant
    );
  };

  const handleConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await confirmOrderMutation.mutateAsync(orderId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await rejectOrderMutation.mutateAsync(orderId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error rejecting order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading && !orderData) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Body style={{ marginTop: 16, color: colors.onSurfaceVariant }}>
            {t('loading_order_details')}
          </Body>
        </View>
      </CommonView>
    );
  }

  // Error state
  if (error) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcon name="alert-circle-outline" size={72} color={colors.error} />
          <Heading3 style={{ marginTop: 24, marginBottom: 12, color: colors.onSurface }} align="center">
            {t('error_loading_order')}
          </Heading3>
          <Body style={{ marginBottom: 32, color: colors.onSurfaceVariant }} align="center">
            {error.message || t('failed_to_load_order_details')}
          </Body>
          <Button mode="contained" onPress={() => refetch()} style={{ marginBottom: 12 }}>
            {t('retry')}
          </Button>
          <Button mode="text" onPress={() => navigation.goBack()}>
            {t('go_back')}
          </Button>
        </View>
      </CommonView>
    );
  }

  // Order not found
  if (!orderData) {
    return (
      <CommonView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <MaterialCommunityIcon name="file-document-outline" size={72} color={colors.onSurfaceVariant} />
          <Heading3 style={{ marginTop: 24, marginBottom: 12, color: colors.onSurface }} align="center">
            {t('order_not_found')}
          </Heading3>
          <Body style={{ marginBottom: 32, color: colors.onSurfaceVariant }} align="center">
            {t('order_could_not_be_found')}
          </Body>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            {t('back_to_orders')}
          </Button>
        </View>
      </CommonView>
    );
  }

  const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View
          style={{
            backgroundColor: colors.surface,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Caption style={{ color: colors.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('order_id')}
              </Caption>
              <Heading1 style={{ color: colors.onSurface, marginBottom: 8 }} weight="bold">
                #{orderId.slice(0, 8)}
              </Heading1>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcon name="clock-outline" size={16} color={colors.onSurfaceVariant} />
                <Caption style={{ marginLeft: 6, color: colors.onSurfaceVariant }}>
                  {orderData.time}
                </Caption>
              </View>
            </View>
            <View
              style={{
                backgroundColor: getStatusColor(orderData.status),
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
              }}
            >
              <Label style={{ color: 'white', textTransform: 'uppercase', letterSpacing: 0.5 }} weight="bold">
                {t(orderData.status)}
              </Label>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={{ backgroundColor: colors.surface, marginTop: 12, paddingHorizontal: 20, paddingVertical: 20 }}>
          <Label style={{ color: colors.onSurface, marginBottom: 16, fontSize: 15 }} weight="semibold">
            {t('customer_information')}
          </Label>
          
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primaryContainer,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcon name="account" size={20} color={colors.onPrimaryContainer} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Caption style={{ color: colors.onSurfaceVariant, marginBottom: 2 }}>
                  {t('customer_name')}
                </Caption>
                <Body style={{ color: colors.onSurface }} weight="medium">
                  {getCustomerName(orderData)}
                </Body>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primaryContainer,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcon name="phone" size={20} color={colors.onPrimaryContainer} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Caption style={{ color: colors.onSurfaceVariant, marginBottom: 2 }}>
                  {t('phone_number')}
                </Caption>
                <Body style={{ color: colors.onSurface }} weight="medium">
                  {getCustomerPhone(orderData)}
                </Body>
              </View>
            </View>

            {orderData.customerAddress && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primaryContainer,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcon name="map-marker" size={20} color={colors.onPrimaryContainer} />
                </View>
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Caption style={{ color: colors.onSurfaceVariant, marginBottom: 2 }}>
                    {t('delivery_address')}
                  </Caption>
                  <Body style={{ color: colors.onSurface }} weight="medium">
                    {orderData.customerAddress}
                  </Body>
                </View>
              </View>
            )}
          </View>

          {orderData.specialInstructions && (
            <View
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 8,
                backgroundColor: colors.errorContainer,
                borderLeftWidth: 4,
                borderLeftColor: colors.error,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MaterialCommunityIcon name="alert-circle" size={20} color={colors.error} />
                <Label style={{ marginLeft: 8, color: colors.error }} weight="semibold">
                  {t('special_instructions')}
                </Label>
              </View>
              <Body style={{ color: colors.onErrorContainer, lineHeight: 20 }}>
                {orderData.specialInstructions}
              </Body>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={{ backgroundColor: colors.surface, marginTop: 12, paddingHorizontal: 20, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Label style={{ color: colors.onSurface, fontSize: 15 }} weight="semibold">
              {t('order_items')}
            </Label>
            <Caption style={{ color: colors.onSurfaceVariant }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Caption>
          </View>

          <View style={{ gap: 16 }}>
            {orderData.items.map((item: OrderItem, index: number) => (
              <View
                key={item.id}
                style={{
                  paddingTop: index === 0 ? 0 : 16,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: colors.outlineVariant,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        minWidth: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.primaryContainer,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Caption style={{ color: colors.onPrimaryContainer }} weight="bold">
                        {item.quantity}
                      </Caption>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Body style={{ color: colors.onSurface, marginBottom: 4 }} weight="semibold">
                        {item.name}
                      </Body>
                      {item.description && (
                        <Caption style={{ color: colors.onSurfaceVariant, lineHeight: 18 }}>
                          {item.description}
                        </Caption>
                      )}
                      {item.modifications && item.modifications.length > 0 && (
                        <View style={{ marginTop: 8, gap: 4 }}>
                          {item.modifications.map((mod: string, modIndex: number) => (
                            <View key={modIndex} style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <View
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: colors.primary,
                                  marginRight: 8,
                                }}
                              />
                              <Caption style={{ color: colors.onSurfaceVariant, fontStyle: 'italic' }}>
                                {mod}
                              </Caption>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  <Body style={{ color: colors.primary, marginLeft: 16 }} weight="bold">
                    {formatOrderTotal(item.price * item.quantity)}
                  </Body>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        <View style={{ backgroundColor: colors.surface, marginTop: 12, paddingHorizontal: 20, paddingVertical: 20 }}>
          <Label style={{ color: colors.onSurface, marginBottom: 16, fontSize: 15 }} weight="semibold">
            {t('payment_summary')}
          </Label>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Body style={{ color: colors.onSurfaceVariant }}>{t('subtotal')}</Body>
              <Body style={{ color: colors.onSurface }} weight="medium">
                {formatOrderTotal(orderData.subtotal)}
              </Body>
            </View>

            {orderData.tax && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Body style={{ color: colors.onSurfaceVariant }}>{t('tax')}</Body>
                <Body style={{ color: colors.onSurface }} weight="medium">
                  {formatOrderTotal(orderData.tax)}
                </Body>
              </View>
            )}

            {(orderData.deliveryFee || orderData.deliveryPrice) && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Body style={{ color: colors.onSurfaceVariant }}>{t('delivery_fee')}</Body>
                <Body style={{ color: colors.onSurface }} weight="medium">
                  {formatOrderTotal(orderData.deliveryFee || orderData.deliveryPrice)}
                </Body>
              </View>
            )}

            <View
              style={{
                height: 1,
                backgroundColor: colors.outlineVariant,
                marginVertical: 4,
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading3 style={{ color: colors.onSurface }} weight="bold">
                {t('total')}
              </Heading3>
              <Heading3 style={{ color: colors.primary }} weight="bold">
                {formatOrderTotal(orderData.total)}
              </Heading3>
            </View>

            <View
              style={{
                marginTop: 8,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.outlineVariant,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.secondaryContainer,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcon
                  name={
                    orderData.paymentMethod === 'credit_card'
                      ? 'credit-card'
                      : orderData.paymentMethod === 'cash'
                        ? 'cash'
                        : 'cellphone'
                  }
                  size={20}
                  color={colors.onSecondaryContainer}
                />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Caption style={{ color: colors.onSurfaceVariant, marginBottom: 2 }}>
                  {t('payment_method')}
                </Caption>
                <Body style={{ color: colors.onSurface }} weight="medium">
                  {orderData.paymentMethod === 'credit_card'
                    ? t('credit_card')
                    : orderData.paymentMethod === 'cash'
                      ? t('cash')
                      : t('mobile_payment')}
                </Body>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ padding: 20 }}>
          {orderData.status === 'pending' ? (
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#10B981',
                  paddingVertical: 16,
                  borderRadius: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleConfirm}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcon name="check-circle" size={20} color="white" />
                <Label style={{ marginLeft: 10, color: 'white' }} weight="bold">
                  {t('accept_order')}
                </Label>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.errorContainer,
                  paddingVertical: 16,
                  borderRadius: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.error,
                }}
                onPress={handleReject}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcon name="close-circle" size={20} color={colors.error} />
                <Label style={{ marginLeft: 10, color: colors.error }} weight="bold">
                  {t('reject_order')}
                </Label>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              contentStyle={{ height: 48 }}
            >
              {t('back_to_orders')}
            </Button>
          )}
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderDetailsScreen;