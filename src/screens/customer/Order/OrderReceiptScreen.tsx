import React from 'react';
import {
  View,
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
import {
  useOrderById,
  useOrderStatus,
} from '@/src/hooks/customer/useOrdersApi';
import { Order } from '@/src/types';
import {
  Typography,
  Heading2,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';

const OrderReceiptScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'OrderReceipt'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { orderId } = route.params;

  // Fetch order data using the real API
  const { data: order, isLoading, error, refetch } = useOrderById(orderId);

  const orderStatus = useOrderStatus(order?.status || 'pending');
  const currency = getCurrencySymbol();
  const placeholderImage = getFoodPlaceholderImage();

  // Show loading state
  if (isLoading) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Body color={colors.onSurfaceVariant} style={{ marginTop: 16 }}>
            {t('loading_order_details')}
          </Body>
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
          <Heading5
            color={colors.error}
            weight="semibold"
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
            {t('please_try_again')}
          </Body>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Label color="white" weight="semibold">
              {t('retry')}
            </Label>
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
            <Heading2 color={colors.onSurface} weight="bold">
              {t('order_receipt')}
            </Heading2>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Order Info */}
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Heading5 color={colors.onSurface} weight="semibold">
                {orderNumber}
              </Heading5>
              <Caption color={colors.onSurfaceVariant}>
                {formatDate(order.createdAt)}
              </Caption>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name={getStatusIcon(order.status)}
                size={16}
                color={getStatusColor(order.status)}
              />
              <Caption
                color={getStatusColor(order.status)}
                weight="medium"
                style={{ marginLeft: 8, textTransform: 'capitalize' }}
              >
                {orderStatus.label}
              </Caption>
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
                  <Label color={colors.onSurface} weight="semibold">
                    {t('restaurant_details_placeholder')}
                  </Label>
                  <Caption
                    color={colors.onSurfaceVariant}
                    numberOfLines={2}
                    style={{ marginTop: 4 }}
                  >
                    {t('restaurant_address_placeholder')}
                  </Caption>
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
          <Heading5
            color={colors.onSurface}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            {t('order_items')} ({order.items.length})
          </Heading5>

          {order.items.map((item, index) => (
            <View key={item.foodId} className="mb-4">
              <View className="flex-row items-center">
                <Image
                  source={placeholderImage}
                  className="w-16 h-16 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Label color={colors.onSurface} weight="semibold">
                    {item.name}
                  </Label>
                  {item.specialInstructions && (
                    <Caption
                      color={colors.onSurfaceVariant}
                      numberOfLines={2}
                      style={{ marginTop: 4 }}
                    >
                      {t('special_instructions')}: {item.specialInstructions}
                    </Caption>
                  )}
                  <Caption
                    color={colors.onSurfaceVariant}
                    style={{ marginTop: 4 }}
                  >
                    {t('quantity')}: {item.quantity}
                  </Caption>
                </View>
                <Label color={colors.onSurface} weight="semibold">
                  {item.total} {currency}
                </Label>
              </View>
              {index < order.items.length - 1 && <Divider className="my-4" />}
            </View>
          ))}
        </View>

        <Divider />

        {/* Pricing Breakdown */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <Heading5
            color={colors.onSurface}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            {t('pricing_breakdown')}
          </Heading5>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Body color={colors.onSurfaceVariant}>{t('subtotal')}</Body>
              <Body color={colors.onSurface}>
                {order.subtotal} {currency}
              </Body>
            </View>

            <View className="flex-row justify-between">
              <Body color={colors.onSurfaceVariant}>{t('delivery_fee')}</Body>
              <Body color={colors.onSurface}>
                {order.deliveryPrice} {currency}
              </Body>
            </View>

            <Divider className="my-3" />

            <View className="flex-row justify-between">
              <Heading5 color={colors.onSurface} weight="semibold">
                {t('total')}
              </Heading5>
              <Heading5 color={colors.primary} weight="semibold">
                {order.total} {currency}
              </Heading5>
            </View>
          </View>
        </View>

        <Divider />

        {/* Delivery & Payment Info */}
        <View className="p-6" style={{ backgroundColor: colors.surface }}>
          <Heading5
            color={colors.onSurface}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            {t('delivery_information')}
          </Heading5>

          <View className="mb-6">
            <Caption
              color={colors.onSurface}
              weight="medium"
              style={{ marginBottom: 8 }}
            >
              {t('delivery_address')}
            </Caption>
            <Caption color={colors.onSurfaceVariant}>
              {t('delivery_address_placeholder')}
            </Caption>
          </View>

          <View className="mb-6">
            <Caption
              color={colors.onSurface}
              weight="medium"
              style={{ marginBottom: 8 }}
            >
              {t('order_status')}
            </Caption>
            <Caption color={colors.onSurfaceVariant}>
              {orderStatus.description}
            </Caption>
            {order.delivery?.deliveredAt && (
              <Caption color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
                {t('delivered_at')}: {formatDate(order.delivery.deliveredAt)}
              </Caption>
            )}
          </View>

          <View>
            <Heading5
              color={colors.onSurface}
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              {t('payment_information')}
            </Heading5>
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
                <Caption color={colors.onSurface} weight="medium">
                  {order.paymentMethod === 'mtn_mobile_money'
                    ? 'MTN Mobile Money'
                    : order.paymentMethod === 'orange_money'
                      ? 'Orange Money'
                      : order.paymentMethod}
                </Caption>
                <Caption color={colors.onSurfaceVariant}>
                  {t('payment_completed')}
                </Caption>
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
              <Label color={colors.primary} weight="semibold">
                {t('share_receipt')}
              </Label>
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
              <Label color="white" weight="semibold">
                {t('order_again')}
              </Label>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderReceiptScreen;
