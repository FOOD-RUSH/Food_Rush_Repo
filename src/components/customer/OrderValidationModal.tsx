import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcon } from '@/src/components/common/icons';
import ReusableModal from './ReusableModal';
import { useTranslation } from 'react-i18next';
import {
  useCartItems,
  useCartSubtotal,
  useCartDeliveryFee,
  useCartServiceFee,
  useCartTotal,
  useCartItemCount,
  useCartRestaurantName,
} from '@/src/stores/customerStores/cartStore';

interface OrderValidationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const OrderValidationModal: React.FC<OrderValidationModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Cart data
  const cartItems = useCartItems();
  const subtotal = useCartSubtotal();
  const deliveryFee = useCartDeliveryFee();
  const serviceFee = useCartServiceFee();
  const total = useCartTotal();
  const itemCount = useCartItemCount();
  const restaurantName = useCartRestaurantName();

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <ReusableModal
      visible={visible}
      onDismiss={onDismiss}
      title={t('confirm_your_order')}
      size="large"
      scrollable={true}
      showCloseButton={true}
      dismissOnBackdropPress={!isLoading}
    >
      <View style={{ flex: 1 }}>
        {/* Restaurant Info */}
        <View
          style={{
            backgroundColor: colors.primaryContainer,
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcon
              name="restaurant"
              size={24}
              color={colors.onPrimaryContainer}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  color: colors.onPrimaryContainer,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                {restaurantName || 'Restaurant'}
              </Text>
              <Text
                style={{
                  color: colors.onPrimaryContainer,
                  fontSize: 14,
                  opacity: 0.8,
                }}
              >
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: colors.onSurface,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 12,
            }}
          >
            {t('order_items')}
          </Text>

          <ScrollView
            style={{
              maxHeight: 200,
              backgroundColor: colors.surfaceVariant,
              borderRadius: 12,
              padding: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: index < cartItems.length - 1 ? 1 : 0,
                  borderBottomColor: colors.outline + '30',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.onSurface,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                    numberOfLines={1}
                  >
                    {item.menuItem.name}
                  </Text>
                  {item.specialInstructions && (
                    <Text
                      style={{
                        color: colors.onSurfaceVariant,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                      numberOfLines={1}
                    >
                      Note: {item.specialInstructions}
                    </Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                  <Text
                    style={{
                      color: colors.onSurface,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    {item.quantity}x
                  </Text>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {formatCurrency(
                      item.quantity * parseFloat(item.menuItem.price || '0'),
                    )}{' '}
                    XAF
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Order Summary */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.outline + '30',
          }}
        >
          <Text
            style={{
              color: colors.onSurface,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 16,
            }}
          >
            {t('order_summary')}
          </Text>

          {/* Subtotal */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 14,
              }}
            >
              {t('subtotal')}:
            </Text>
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              {formatCurrency(subtotal)} XAF
            </Text>
          </View>

          {/* Delivery Fee */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 14,
              }}
            >
              {t('delivery_fee')}:
            </Text>
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              {formatCurrency(deliveryFee)} XAF
            </Text>
          </View>

          {/* Service Fee */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 14,
              }}
            >
              {t('service_fee')}:
            </Text>
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              {formatCurrency(serviceFee)} XAF
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: colors.outline,
              marginBottom: 12,
            }}
          />

          {/* Total */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              {t('total')}:
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              {formatCurrency(total)} XAF
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.surfaceVariant,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={onDismiss}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {t('cancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 2,
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={onConfirm}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isLoading && (
                <MaterialIcon
                  name="hourglass-empty"
                  size={20}
                  color={colors.onPrimary}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text
                style={{
                  color: colors.onPrimary,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                {isLoading ? t('placing_order') : t('place_order')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Fee Note */}
        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.secondaryContainer,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: colors.onSecondaryContainer,
              fontSize: 12,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            *{' '}
            {t(
              'service_fee_note',
              'Service fee helps us maintain and improve our platform',
            )}
          </Text>
        </View>
      </View>
    </ReusableModal>
  );
};

export default OrderValidationModal;
