import { IoniconsIcon } from '@/src/components/common/icons';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useTheme, Card, Chip } from 'react-native-paper';
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
  const { mutate: cancelOrder, isPending: isCancelling } =
    useCancelOrder();

  // State for confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  const handleShowConfirmationModal = useCallback(() => {
    setShowConfirmationModal(true);
  }, []);

  const handleCloseConfirmationModal = useCallback(() => {
    setShowConfirmationModal(false);
  }, []);

  const handleConfirmReceived = useCallback(() => {
    confirmReceived(order.id, {
      onSuccess: () => {
        // Modal will auto-close after celebration
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
        // Order confirmed, proceed to payment
        console.log('Order confirmed, proceeding to payment');
      },
      onError: (error) => {
        console.error('Failed to confirm order:', error);
      },
    });
  }, [confirmOrder, order.id]);

  const handleCancelOrder = useCallback(() => {
    cancelOrder({ orderId: order.id, reason: 'Customer cancelled' }, {
      onSuccess: () => {
        console.log('Order cancelled successfully');
      },
      onError: (error) => {
        console.error('Failed to cancel order:', error);
      },
    });
  }, [cancelOrder, order.id]);

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
      {/* Status Badge */}
      <View style={{ 
        position: 'absolute', 
        top: 12, 
        right: 12, 
        zIndex: 1,
        backgroundColor: statusInfo.color,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 12, 
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {t(order.status)}
        </Text>
      </View>

      {/* Main Content with Image and Order Info */}
      <View style={{ padding: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Order Image - Square format with considerable space */}
          <View style={{
            width: 90,
            height: 90,
            borderRadius: 12,
            marginRight: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.surfaceVariant,
          }}>
            {order.items && order.items.length > 0 && order.items[0].imageUrl ? (
              <Image
                source={{ uri: order.items[0].imageUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 12,
                }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={placeholderImage}
                style={{
                  width: 50,
                  height: 50,
                }}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Order Info */}
          <View style={{ flex: 1 }}>
            {/* Order Number and Date */}
            <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  color: colors.onSurface,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Order #{order.id.substring(0, 8).toUpperCase()}
              </Text>
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 12,
                }}
              >
                {formatDate(order.createdAt, 'MMM DD, h:mm a')}
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
                style={{
                  color: colors.onSurface,
                  fontSize: 16,
                  fontWeight: '600',
                }}
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
                  ...and {remainingItemsCount} more item
                  {remainingItemsCount > 1 ? 's' : ''}
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
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: colors.outline,
            }}
          >
            <IoniconsIcon name="bicycle-outline" size={16} color={colors.primary} />
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
                <IoniconsIcon                   name="call-outline"
                  size={18}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {isActiveOrder ? (
            <>
              {/* Pending Status - Show Cancel Button Only */}
              {order.status === 'pending' && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 9999,
                    paddingVertical: 12,
                    borderColor: '#F44336',
                  }}
                  onPress={handleCancelOrder}
                  disabled={isCancelling}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      textAlign: 'center',
                      fontSize: 16,
                      color: '#F44336',
                    }}
                  >
                    {isCancelling ? t('cancelling', 'Cancelling...') : t('cancel_order')}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Confirmed Status - Show Confirm & Cancel Buttons */}
              {order.status === 'confirmed' && (
                <>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderRadius: 9999,
                      paddingVertical: 12,
                      marginRight: 8,
                      borderColor: '#F44336',
                    }}
                    onPress={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#F44336',
                      }}
                    >
                      {isCancelling ? t('cancelling', 'Cancelling...') : t('cancel_order')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderRadius: 9999,
                      paddingVertical: 12,
                      marginLeft: 8,
                      backgroundColor: colors.primary,
                    }}
                    onPress={handleConfirmOrder}
                    disabled={isConfirmingOrder}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        textAlign: 'center',
                        fontSize: 16,
                        color: 'white',
                      }}
                    >
                      {isConfirmingOrder ? t('confirming', 'Confirming...') : t('confirm_pay', 'Confirm & Pay')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* After Payment - Show Track Order Button */}
              {['payment_confirmed', 'preparing', 'ready', 'ready_for_pickup', 'picked_up', 'out_for_delivery'].includes(order.status) && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 9999,
                    paddingVertical: 12,
                    borderColor: colors.primary,
                  }}
                  onPress={handleTrackOrder}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      textAlign: 'center',
                      fontSize: 16,
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
              {/* Delivered Status - Show Confirm Delivery Button OR Review & Reorder Buttons */}
              {order.status === 'delivered' && (
                // Check if delivery has been confirmed by customer
                order.delivery?.customerConfirmed ? (
                  // Show Review & Reorder Buttons after delivery confirmation
                  <>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 9999,
                        paddingVertical: 12,
                        marginRight: 8,
                        borderColor: colors.primary,
                      }}
                      onPress={handleReviews}
                    >
                      <Text
                        style={{
                          fontWeight: '500',
                          textAlign: 'center',
                          fontSize: 16,
                          color: colors.primary,
                        }}
                      >
                        {t('leave_a_review')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        borderRadius: 9999,
                        paddingVertical: 12,
                        marginLeft: 8,
                        backgroundColor: colors.primary,
                      }}
                      onPress={handleReorder}
                    >
                      <Text
                        style={{
                          fontWeight: '500',
                          textAlign: 'center',
                          fontSize: 16,
                          color: 'white',
                        }}
                      >
                        {t('order_again')}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // Show Confirm Delivery Button before customer confirmation
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderRadius: 9999,
                      paddingVertical: 12,
                      backgroundColor: colors.primary,
                    }}
                    onPress={handleShowConfirmationModal}
                    disabled={isConfirming}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        textAlign: 'center',
                        fontSize: 16,
                        color: 'white',
                      }}
                    >
                      {isConfirming ? t('confirming', 'Confirming...') : t('confirm_delivery')}
                    </Text>
                  </TouchableOpacity>
                )
              )}

              {/* Cancelled Orders - Show Reorder Button Only */}
              {order.status === 'cancelled' && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderRadius: 9999,
                    paddingVertical: 12,
                    backgroundColor: colors.primary,
                  }}
                  onPress={handleReorder}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      textAlign: 'center',
                      fontSize: 16,
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
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmReceived}
        orderNumber={`#${order.id.substring(0, 8).toUpperCase()}`}
        restaurantName={order.restaurant?.name || 'Restaurant'}
      />
    </Card>
  );
};

export default OrderItemCard;
