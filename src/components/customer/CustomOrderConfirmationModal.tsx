import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcon, IoniconsIcon } from '@/src/components/common/icons';
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

const {  height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CustomOrderConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const CustomOrderConfirmationModal: React.FC<
  CustomOrderConfirmationModalProps
> = ({ visible, onDismiss, onConfirm, isLoading = false }) => {
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={isLoading ? undefined : onDismiss}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />

      {/* Backdrop */}
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        {/* Modal Content */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: SCREEN_HEIGHT * 0.9,
            paddingTop: 20,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.outline + '30',
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              {t('confirm_your_order')}
            </Text>

            {!isLoading && (
              <TouchableOpacity
                onPress={onDismiss}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IoniconsIcon
                  name="close"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          >
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
                    {restaurantName || t('restaurant')}
                  </Text>
                  <Text
                    style={{
                      color: colors.onPrimaryContainer,
                      fontSize: 14,
                      opacity: 0.8,
                    }}
                  >
                    {itemCount} {itemCount === 1 ? t('item') : t('items')}
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

              <View
                style={{
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: 12,
                  padding: 12,
                }}
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
                          {t('note')}: {item.specialInstructions}
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
                          item.quantity *
                            parseFloat(item.menuItem.price || '0'),
                        )}{' '}
                        XAF
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
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

            {/* Payment Info - Important Warning */}
            <View
              style={{
                backgroundColor: '#FFF3CD',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                borderWidth: 2,
                borderColor: '#FFC107',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <IoniconsIcon
                  name="warning"
                  size={24}
                  color="#FF6B00"
                />
                <Text
                  style={{
                    color: '#FF6B00',
                    fontSize: 17,
                    fontWeight: '700',
                    marginLeft: 8,
                  }}
                >
                  {t('important_payment_notice')}
                </Text>
              </View>
              <Text
                style={{
                  color: '#856404',
                  fontSize: 14,
                  lineHeight: 22,
                  fontWeight: '600',
                  marginBottom: 12,
                }}
              >
                {t('immediate_payment_required')}
              </Text>
              <View
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: '#856404',
                    fontSize: 13,
                    lineHeight: 20,
                    fontWeight: '500',
                  }}
                >
                  ⚠️ {t('ensure_sufficient_funds')}
                </Text>
              </View>
              <Text
                style={{
                  color: '#856404',
                  fontSize: 13,
                  lineHeight: 20,
                  fontStyle: 'italic',
                }}
              >
                {t('payment_methods_available')}
              </Text>
            </View>

            {/* Service Fee Note */}
            <View
              style={{
                padding: 12,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 12,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                * {t('service_fee_note')}
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              padding: 20,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.outline + '30',
            }}
          >
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
        </View>
      </View>
    </Modal>
  );
};

export default CustomOrderConfirmationModal;
