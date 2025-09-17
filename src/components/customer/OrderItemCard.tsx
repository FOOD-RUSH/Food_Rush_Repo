import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useCallback } from 'react';
import { useTheme, Card, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Order } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import {
  useOrderStatus,
  useConfirmOrderReceived,
} from '@/src/hooks/customer/useOrdersApi';
import { getFoodPlaceholderImage } from '@/src/types/orderReceipt';

export interface OrderItemCardProps {
  order: Order;
  onReorder?: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}
const OrderItemCard = ({
  order,
  onReorder,
  onTrackOrder,
}: OrderItemCardProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const navigation =
    useNavigation<RootStackScreenProps<'CustomerApp'>['navigation']>();
  const statusInfo = useOrderStatus(order.status);
  const { mutate: confirmReceived, isPending: isConfirming } =
    useConfirmOrderReceived();

  // Calculate total items in order
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Check if order is active (not delivered/cancelled)
  const isActiveOrder = !['delivered', 'cancelled'].includes(order.status);

  const handleNavigation = useCallback(
    () => navigation.navigate('OrderReceipt', { orderId: order.id }),
    [navigation, order.id],
  );

  const handleTrackOrder = useCallback(() => {
    if (onTrackOrder) {
      onTrackOrder(order.id);
    } else {
      navigation.navigate('OrderTracking', { orderId: order.id });
    }
  }, [navigation, order.id, onTrackOrder]);

  const handleReorder = useCallback(() => {
    if (onReorder) {
      onReorder(order);
    }
  }, [order, onReorder]);

  const handleConfirmReceived = useCallback(() => {
    confirmReceived(order.id);
  }, [confirmReceived, order.id]);

  const handleReviews = useCallback(
    () =>
      navigation.navigate('RestaurantReview', {
        restaurantId: order.restaurantId,
        restaurantName: 'Restaurant Name', // You might want to include this in Order type
      }),
    [navigation, order.restaurantId],
  );

  const placeholderImage = getFoodPlaceholderImage();

  // Get first 2 items for display
  const displayItems = order.items.slice(0, 2);
  const remainingItemsCount = order.items.length - 2;

  return (
    <Card
      onPress={handleNavigation}
      style={{
        margin: 12,
        borderRadius: 16,
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Main Content with Image and Order Info */}
      <View style={{ padding: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Placeholder Image - Square format with considerable space */}
          <Image
            source={placeholderImage}
            style={{
              width: 90,
              height: 90,
              borderRadius: 12,
              marginRight: 16,
            }}
            resizeMode="cover"
          />

          {/* Order Info */}
          <View style={{ flex: 1 }}>
            {/* Order Number Only */}
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  color: colors.onSurface,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Order #{order.id.substring(0, 8).toUpperCase()}
              </Text>
            </View>

            {/* Order Items Summary */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 14,
                }}
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Text>
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 14,
                  marginHorizontal: 8,
                }}
              >
                •
              </Text>
              <Text
                style={{ color: colors.onSurface, fontSize: 16, fontWeight: '600' }}
              >
                {order.total.toLocaleString()} XAF
              </Text>
            </View>

            {/* Items Preview - First 2 items */}
            <View style={{ marginBottom: 8 }}>
              {displayItems.map((item, index) => (
                <Text
                  key={index}
                  style={{ 
                    color: colors.onSurface, 
                    fontSize: 14, 
                    marginBottom: 2,
                    lineHeight: 18,
                  }}
                >
                  {item.quantity}x {item.name}
                </Text>
              ))}
              {remainingItemsCount > 0 && (
                <Text
                  style={{
                    color: colors.onSurfaceVariant,
                    fontSize: 14,
                    fontStyle: 'italic',
                  }}
                >
                  ...and {remainingItemsCount} more item{remainingItemsCount > 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Delivery Info if available */}
        {order.delivery && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="bicycle-outline" size={16} color={colors.primary} />
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 14,
                marginLeft: 6,
              }}
            >
              {order.delivery.rider
                ? order.delivery.rider.fullName
                : 'Driver assigned'}
            </Text>
            {order.delivery.rider?.phoneNumber && (
              <TouchableOpacity
                style={{ marginLeft: 'auto' }}
                onPress={() => {
                  /* Handle call driver */
                }}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {/* DIVIDER */}
      <View
        style={{
          height: 1,
          marginBottom: 12,
          marginHorizontal: 8,
          backgroundColor: colors.outline,
        }}
      />
      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {isActiveOrder ? (
            <>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 9999,
                  paddingVertical: 8,
                  marginRight: 8,
                  borderColor: colors.primary,
                }}
                onPress={handleTrackOrder}
              >
                <Text
                  style={{
                    fontWeight: '500',
                    textAlign: 'center',
                    fontSize: 18,
                    color: colors.primary,
                  }}
                >
                  {t('track_driver')}
                </Text>
              </TouchableOpacity>

              {order.status === 'picked_up' && (
                <TouchableOpacity
                  className="flex-1 rounded-full py-2 ml-2"
                  style={{ backgroundColor: colors.primary }}
                  onPress={handleConfirmReceived}
                  disabled={isConfirming}
                >
                  <Text className="text-white font-medium text-center text-lg">
                    {t('confirm_your_order')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                className="flex-1 border rounded-full py-2 mr-2"
                style={{ borderColor: colors.primary }}
                onPress={handleReviews}
              >
                <Text
                  className="font-medium text-center text-lg"
                  style={{ color: colors.primary }}
                >
                  {t('leave_a_review')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-full py-2 ml-2"
                style={{ backgroundColor: colors.primary }}
                onPress={handleReorder}
              >
                <Text className="text-white font-medium text-center text-lg">
                  {t('order_again')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Card>
  );
};

export default OrderItemCard;
