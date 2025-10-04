import { IoniconsIcon } from '@/src/components/common/icons';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Order } from '@/src/types';

import {
  useOrderStatus,
  useConfirmOrderReceived,
  useConfirmOrder,
  useCancelOrder,
} from '@/src/hooks/customer/useOrdersApi';
import { getFoodPlaceholderImage } from '@/src/types/orderReceipt';
import { OrderDeliveryConfirmationModal } from '@/src/components/customer/OrderConfirmation';
import { formatDate } from '@/src/utils/dateUtils';

export interface OrderItemCardProps {
  order: Order;
  onReorder?: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 360;

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
  const { mutate: confirmOrder, isPending: isConfirmingOrder } =
    useConfirmOrder();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
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
    confirmReceived(order.id, {
      onSuccess: () => {
        setShowConfirmationModal(false);
      },
      onError: (error) => {
        console.error('Failed to confirm order:', error);
        setShowConfirmationModal(false);
      },
    });
  }, [confirmReceived, order.id]);

  const handleConfirmOrder = useCallback(() => {
    confirmOrder(order.id, {
      onSuccess: () => {
        console.log('Order confirmed, proceeding to payment');
      },
      onError: (error) => {
        console.error('Failed to confirm order:', error);
      },
    });
  }, [confirmOrder, order.id]);

  const handleCancelOrder = useCallback(() => {
    cancelOrder(
      { orderId: order.id, reason: 'Customer cancelled' },
      {
        onSuccess: () => {
          console.log('Order cancelled successfully');
        },
        onError: (error) => {
          console.error('Failed to cancel order:', error);
        },
      },
    );
  }, [cancelOrder, order.id]);

  const handleCallRider = useCallback(() => {
    if (order.delivery?.rider?.phoneNumber) {
      Linking.openURL(`tel:${order.delivery.rider.phoneNumber}`);
    }
  }, [order.delivery?.rider?.phoneNumber]);

  const handleReviews = useCallback(
    () =>
      navigation.navigate('RestaurantReview', {
        restaurantId: order.restaurantId,
        restaurantName: order.restaurant?.name || 'Restaurant',
      }),
    [navigation, order.restaurantId, order.restaurant?.name],
  );

  const placeholderImage = getFoodPlaceholderImage();

  return (
    <Card
      onPress={handleNavigation}
      style={{
        marginHorizontal: IS_SMALL_SCREEN ? 8 : 12,
        marginVertical: 8,
        borderRadius: 16,
        backgroundColor: colors.surface,
        elevation: 2,
      }}
    >
      <View style={{ padding: IS_SMALL_SCREEN ? 12 : 16 }}>
        {/* Top Row: Image, Info, Status */}
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {/* Order Image */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              marginRight: 12,
              backgroundColor: colors.surfaceVariant,
              overflow: 'hidden',
            }}
          >
            {order.items?.[0]?.imageUrl ? (
              <Image
                source={{ uri: order.items[0].imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={placeholderImage}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>

          {/* Order Info */}
          <View style={{ flex: 1 }}>
            {/* Order Number & Status */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.onSurface,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                #{order.id.substring(0, 8).toUpperCase()}
              </Text>
              <View
                style={{
                  backgroundColor: statusInfo.color,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 10,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {t(order.status)}
                </Text>
              </View>
            </View>

            {/* Restaurant Name */}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: colors.onSurfaceVariant,
                marginBottom: 8,
              }}
            >
              {order.restaurant?.name || 'Restaurant'}
            </Text>

            {/* Items count and Total */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: colors.onSurfaceVariant,
                }}
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.onSurface,
                }}
              >
                {order.total.toLocaleString()} XAF
              </Text>
            </View>

            {/* Date */}
            <Text
              style={{
                fontSize: 12,
                color: colors.onSurfaceVariant,
                marginTop: 4,
              }}
            >
              {formatDate(order.createdAt, 'MMM DD, h:mm a')}
            </Text>
          </View>
        </View>

        {/* Delivery Info */}
        {order.delivery?.rider && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 12,
              backgroundColor: colors.surfaceVariant,
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              <IoniconsIcon name="bicycle" size={18} color={colors.primary} />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.onSurface,
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                {order.delivery.rider.fullName}
              </Text>
            </View>
            {order.delivery.rider.phoneNumber && (
              <TouchableOpacity
                onPress={handleCallRider}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8,
                }}
              >
                <IoniconsIcon name="call" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {isActiveOrder ? (
            <>
              {order.status === 'pending' && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderRadius: 12,
                    paddingVertical: 12,
                    borderColor: '#F44336',
                  }}
                  onPress={handleCancelOrder}
                  disabled={isCancelling}
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: 15,
                      color: '#F44336',
                    }}
                  >
                    {isCancelling
                      ? t('cancelling', 'Cancelling...')
                      : t('cancel_order')}
                  </Text>
                </TouchableOpacity>
              )}

              {order.status === 'confirmed' && (
                <>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderWidth: 2,
                      borderRadius: 12,
                      paddingVertical: 12,
                      borderColor: '#F44336',
                    }}
                    onPress={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        textAlign: 'center',
                        fontSize: 15,
                        color: '#F44336',
                      }}
                    >
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      paddingVertical: 12,
                      backgroundColor: colors.primary,
                    }}
                    onPress={handleConfirmOrder}
                    disabled={isConfirmingOrder}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        textAlign: 'center',
                        fontSize: 15,
                        color: 'white',
                      }}
                    >
                      {isConfirmingOrder
                        ? t('confirming')
                        : t('confirm_pay', 'Confirm & Pay')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {[
                'payment_confirmed',
                'preparing',
                'ready',
                'ready_for_pickup',
                'picked_up',
                'out_for_delivery',
              ].includes(order.status) && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderRadius: 12,
                    paddingVertical: 12,
                    borderColor: colors.primary,
                  }}
                  onPress={handleTrackOrder}
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: 15,
                      color: colors.primary,
                    }}
                  >
                    {t('track_order')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {order.status === 'delivered' &&
                (order.delivery?.customerConfirmed ? (
                  <>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        borderWidth: 2,
                        borderRadius: 12,
                        paddingVertical: 12,
                        borderColor: colors.primary,
                      }}
                      onPress={handleReviews}
                    >
                      <Text
                        style={{
                          fontWeight: '600',
                          textAlign: 'center',
                          fontSize: 15,
                          color: colors.primary,
                        }}
                      >
                        {t('leave_a_review')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        borderRadius: 12,
                        paddingVertical: 12,
                        backgroundColor: colors.primary,
                      }}
                      onPress={handleReorder}
                    >
                      <Text
                        style={{
                          fontWeight: '600',
                          textAlign: 'center',
                          fontSize: 15,
                          color: 'white',
                        }}
                      >
                        {t('order_again')}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      paddingVertical: 12,
                      backgroundColor: colors.primary,
                    }}
                    onPress={() => setShowConfirmationModal(true)}
                    disabled={isConfirming}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        textAlign: 'center',
                        fontSize: 15,
                        color: 'white',
                      }}
                    >
                      {isConfirming ? t('confirming') : t('confirm_delivery')}
                    </Text>
                  </TouchableOpacity>
                ))}

              {order.status === 'cancelled' && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    paddingVertical: 12,
                    backgroundColor: colors.primary,
                  }}
                  onPress={handleReorder}
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'white',
                    }}
                  >
                    {t('order_again')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Delivery Confirmation Modal */}
      <OrderDeliveryConfirmationModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmReceived}
        orderNumber={`#${order.id.substring(0, 8).toUpperCase()}`}
        restaurantName={order.restaurant?.name || 'Restaurant'}
      />
    </Card>
  );
};

export default OrderItemCard;
