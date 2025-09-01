import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Linking,
} from 'react-native';
import { useTheme, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { OrderReceipt, mockOrderReceipt } from '@/src/types/orderReceipt';

const OrderReceiptScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'OrderReceipt'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  
  // For now, use mock data - in real app, fetch based on route.params.orderId
  const order: OrderReceipt = mockOrderReceipt;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleShareReceipt = async () => {
    try {
      const message = `Order Receipt: ${order.orderNumber}\nTotal: ${order.pricing.total} ${order.pricing.currency}\nDate: ${formatDate(order.date)}`;
      await Share.share({
        message,
        title: 'Order Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const handleCallRestaurant = () => {
    if (order.restaurant.phone) {
      Linking.openURL(`tel:${order.restaurant.phone}`);
    }
  };

  const handleOrderAgain = () => {
    // Navigate to restaurant or implement order again logic
    navigation.goBack();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return '#10b981'; // green
      case 'processing':
        return '#f59e0b'; // amber
      case 'cancelled':
        return '#ef4444'; // red
      default:
        return colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'checkmark-circle';
      case 'processing':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <CommonView>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="p-6 bg-white" style={{ backgroundColor: colors.surface }}>
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
                {order.orderNumber}
              </Text>
              <Text
                className="text-sm"
                style={{ color: colors.onSurfaceVariant }}
              >
                {formatDate(order.date)}
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
                {order.status}
              </Text>
            </View>
          </View>

          {/* Restaurant Info */}
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
                  source={order.restaurant.image}
                  className="w-12 h-12 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.onSurface }}
                  >
                    {order.restaurant.name}
                  </Text>
                  <Text
                    className="text-sm mt-1"
                    style={{ color: colors.onSurfaceVariant }}
                    numberOfLines={2}
                  >
                    {order.restaurant.address}
                  </Text>
                </View>
                {order.restaurant.phone && (
                  <TouchableOpacity
                    onPress={handleCallRestaurant}
                    className="p-2 rounded-full ml-2"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <Ionicons
                      name="call"
                      size={20}
                      color={colors.primary}
                    />
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
            <View key={item.id} className="mb-4">
              <View className="flex-row items-center">
                <Image
                  source={item.image}
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
                  {item.description && (
                    <Text
                      className="text-sm mt-1"
                      style={{ color: colors.onSurfaceVariant }}
                      numberOfLines={2}
                    >
                      {item.description}
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
                  {item.price * item.quantity} {order.pricing.currency}
                </Text>
              </View>
              {index < order.items.length - 1 && (
                <Divider className="my-4" />
              )}
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
                {order.pricing.subtotal} {order.pricing.currency}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.onSurfaceVariant }}>
                {t('delivery_fee')}
              </Text>
              <Text style={{ color: colors.onSurface }}>
                {order.pricing.deliveryFee} {order.pricing.currency}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.onSurfaceVariant }}>
                {t('tax')}
              </Text>
              <Text style={{ color: colors.onSurface }}>
                {order.pricing.tax} {order.pricing.currency}
              </Text>
            </View>

            {order.pricing.discount > 0 && (
              <View className="flex-row justify-between">
                <Text style={{ color: colors.onSurfaceVariant }}>
                  {t('discount')}
                </Text>
                <Text style={{ color: '#10b981' }}>
                  -{order.pricing.discount} {order.pricing.currency}
                </Text>
              </View>
            )}

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
                {order.pricing.total} {order.pricing.currency}
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
              {order.delivery.address}
            </Text>
          </View>

          <View className="mb-6">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: colors.onSurface }}
            >
              {t('estimated_delivery_time')}
            </Text>
            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              {order.delivery.estimatedTime}
            </Text>
            {order.delivery.deliveredAt && (
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
                  order.payment.method === 'card' ? 'credit-card' :
                  order.payment.method === 'mobile_money' ? 'mobile-alt' : 'money-bill-wave'
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
                  {t(`payment_method_${order.payment.method}`)}
                </Text>
                {order.payment.provider && (
                  <Text
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {order.payment.provider}
                    {order.payment.lastFour && ` •••• ${order.payment.lastFour}`}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <View className="flex-row justify-between first:">
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
              className="flex-1 rounded-xl py-4 items-center"
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
