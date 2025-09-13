import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import {
  OrderReceipt,
  formatOrderNumber,
  getCurrencySymbol,
  getFoodPlaceholderImage,
} from '@/src/types/orderReceipt';
import { useOrderById, useOrderStatus } from '@/src/hooks/customer/useOrdersApi';
import { Order } from '@/src/types';

const OrderReceiptScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'OrderReceipt'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { orderId } = route.params;

  // Fetch order data using the real API
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useOrderById(orderId);

  const orderStatus = useOrderStatus(order?.status || 'pending');
  const currency = getCurrencySymbol();
  const placeholderImage = getFoodPlaceholderImage();

  // Show loading state
  if (isLoading) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            className="mt-4 text-base"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('loading_order_details')}
          </Text>
        </View>
      </CommonView>
    );
  }

  // Show error state
  if (error || !order) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={colors.error}
          />
          <Text
            className="mt-4 text-lg font-semibold text-center"
            style={{ color: colors.error }}
          >
            {t('error_loading_order')}
          </Text>
          <Text
            className="mt-2 text-base text-center"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('please_try_again')}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const orderNumber = formatOrderNumber(order.id);

  const handleShareReceipt = async () => {
    try {
      const message = `Order Receipt: ${orderNumber}\nTotal: ${order.total} ${currency}\nDate: ${formatDate(order.createdAt)}`;
      await Share.share({
        message,
        title: 'Order Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const handleCallRestaurant = () => {
    if (order.delivery?.rider?.phoneNumber) {
      Linking.openURL(`tel:${order.delivery.rider.phoneNumber}`);
    }
  };

  const handleOrderAgain = () => {
    // Navigate to restaurant or implement order again logic
    navigation.goBack();
  };

  const getStatusColor = (status: string) => {
    return orderStatus.color;
  };

  const getStatusIcon = (status: string) => {
    return orderStatus.icon;
  };

  return (
    <CommonView>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          className="p-6 bg-white"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.onSurface }}
            >
              {t('order_receipt')}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Order Info */}
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.onSurface }}
              >
                {orderNumber}
              </Text>
              <Text
                className="text-sm"
                style={{ color: colors.onSurfaceVariant }}
              >
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name={getStatusIcon(order.status)}
                size={16}
                color={getStatusColor(order.status)}
              />
              <Text
                className="ml-2 text-sm font-medium capitalize"
                style={{ color: getStatusColor(order.status) }}
              >
                {orderStatus.label}
              </Text>
            </View>
          </View>

          {/* Restaurant Info - Placeholder until backend provides restaurant details */}
          <Card
            mode="outlined"
            style={{
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.outline,
            }}
          >
            <Card.Content>
              <View className="flex-row items-center">
                <Image
                  source={placeholderImage}
                  className="w-12 h-12 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.onSurface }}
                  >
                    {t('restaurant_details_placeholder')}
                  </Text>
                  <Text
                    className="text-sm mt-1"
                    style={{ color: colors.onSurfaceVariant }}
                    numberOfLines={2}
                  >
                    {t('restaurant_address_placeholder')}
                  </Text>
                </View>
                {order.delivery?.rider?.phoneNumber && (
                  <TouchableOpacity
                    onPress={handleCallRestaurant}
                    className="p-2 rounded-full ml-2"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <Ionicons name="call" size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </Card.Content>
          </Card>
        </View>

        <Divider />

        {/* Order Items */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.onSurface }}
          >
            {t('order_items')} ({order.items.length})
          </Text>

          {order.items.map((item, index) => (
            <View key={item.foodId} className="mb-4">
              <View className="flex-row items-center">
                <Image
                  source={placeholderImage}
                  className="w-16 h-16 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.onSurface }}
                  >
                    {item.name}
                  </Text>
                  {item.specialInstructions && (
                    <Text
                      className="text-sm mt-1"
                      style={{ color: colors.onSurfaceVariant }}
                      numberOfLines={2}
                    >
                      {t('special_instructions')}: {item.specialInstructions}
                    </Text>
                  )}
                  <Text
                    className="text-sm mt-1"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {t('quantity')}: {item.quantity}
                  </Text>
                </View>
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.onSurface }}
                >
                  {item.total} {currency}
                </Text>
              </View>
              {index < order.items.length - 1 && <Divider className="my-4" />}
            </View>
          ))}
        </View>

        <Divider />

        {/* Pricing Breakdown */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.onSurface }}
          >
            {t('pricing_breakdown')}
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text style={{ color: colors.onSurfaceVariant }}>
                {t('subtotal')}
              </Text>
              <Text style={{ color: colors.onSurface }}>
                {order.subtotal} {currency}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.onSurfaceVariant }}>
                {t('delivery_fee')}
              </Text>
              <Text style={{ color: colors.onSurface }}>
                {order.deliveryPrice} {currency}
              </Text>
            </View>

            <Divider className="my-3" />

            <View className="flex-row justify-between">
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.onSurface }}
              >
                {t('total')}
              </Text>
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.primary }}
              >
                {order.total} {currency}
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Delivery & Payment Info */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.onSurface }}
          >
            {t('delivery_information')}
          </Text>

          <View className="mb-6">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: colors.onSurface }}
            >
              {t('delivery_address')}
            </Text>
            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('delivery_address_placeholder')}
            </Text>
          </View>

          <View className="mb-6">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: colors.onSurface }}
            >
              {t('order_status')}
            </Text>
            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              {orderStatus.description}
            </Text>
            {order.delivery?.deliveredAt && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {t('delivered_at')}: {formatDate(order.delivery.deliveredAt)}
              </Text>
            )}
          </View>

          <View>
            <Text
              className="text-lg font-semibold mb-4"
              style={{ color: colors.onSurface }}
            >
              {t('payment_information')}
            </Text>
            <View className="flex-row items-center">
              <FontAwesome5
                name={
                  order.paymentMethod === 'mtn_mobile_money'
                    ? 'mobile-alt'
                    : order.paymentMethod === 'orange_money'
                      ? 'mobile-alt'
                      : 'money-bill-wave'
                }
                size={20}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {order.paymentMethod === 'mtn_mobile_money'
                    ? 'MTN Mobile Money'
                    : order.paymentMethod === 'orange_money'
                      ? 'Orange Money'
                      : order.paymentMethod}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('payment_completed')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleShareReceipt}
              className="flex-1 border rounded-xl py-4 items-center mr-2"
              style={{ borderColor: colors.primary }}
            >
              <Ionicons
                name="share-outline"
                size={20}
                color={colors.primary}
                style={{ marginBottom: 4 }}
              />
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                {t('share_receipt')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOrderAgain}
              className="flex-1 rounded-xl py-4 items-center ml-2"
              style={{ backgroundColor: colors.primary }}
            >
              <MaterialIcons
                name="replay"
                size={20}
                color="white"
                style={{ marginBottom: 4 }}
              />
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {t('order_again')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderReceiptScreen;
