import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Alert,
} from 'react-native';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Card, useTheme } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import CheckOutItem from '@/src/components/customer/CheckOutItem';
import {
  useCartStore,
  useCartTotal,
  CartItem,
} from '@/src/stores/customerStores/cartStore';
import { useAuthUser } from '@/src/stores/customerStores';
import CheckoutContent from '@/src/components/common/BottomSheet/CheckoutContent';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import { useDefaultAddress } from '@/src/location/store';
import {
  useSelectedPaymentMethod,
  useSelectedProvider,
} from '@/src/stores/customerStores/paymentStore';
import { useOrderFlow } from '@/src/hooks/customer/useOrderFlow';
import OrderStatusModal from '@/src/components/customer/OrderFlow/OrderStatusModal';

import { useTranslation } from 'react-i18next';

const CheckOutScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Checkout'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  // Subscribe to specific store slices
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = useCartTotal();
  const clearCart = useCartStore((state) => state.clearCart);
  const defaultAddress = useDefaultAddress();
  const selectedPaymentMethod = useSelectedPaymentMethod();
  const selectedProvider = useSelectedProvider();
  const user = useAuthUser();

  // Order flow hook
  const {
    flowState,
    createOrderFromCart,
    confirmOrder,
    completePayment,
    resetFlow,
    isReadyForCustomerConfirmation,
    isWaitingForRestaurant,
    isPaymentInProgress,
    isCompleted,
    isFailed,
    isCreatingOrder,
    isConfirmingOrder,
  } = useOrderFlow();

  // Constants for fees
  const DELIVERY_FEE = 2300;
  const DISCOUNT = 0; // Could be dynamic based on promo codes

  // helper functions for bottom modal
  const { present, dismiss } = useBottomSheet();

  // Memoized calculations
  const calculations = useMemo(() => {
    const subtotal = totalPrice || 0;
    const deliveryFee = DELIVERY_FEE;
    const discount = DISCOUNT;
    const finalTotal = subtotal + deliveryFee - discount;

    return {
      subtotal: subtotal.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      deliveryFee: deliveryFee.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      discount: discount.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      finalTotal: finalTotal.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      finalTotalRaw: finalTotal,
    };
  }, [totalPrice]);

  // Memoize total items count
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  // Handle navigation back to menu
  const handleAddItems = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle address selection
  const handleAddressPress = useCallback(() => {
    // Navigate to address selection screen
    navigation.navigate('AddressScreen');
  }, [navigation]);

  // Handle payment method selection
  const handlePaymentPress = useCallback(() => {
    // Navigate to payment methods screen
    navigation.navigate('PaymentMethods');
  }, [navigation]);

  // Handle promo code
  const handlePromoPress = useCallback(() => {
    Alert.alert(t('info'), t('promo_code_functionality_coming_soon'));
  }, [t]);

  // Handle place order confirmation - create actual order
  const handleConfirmOrder = useCallback(async () => {
    try {
      // Get restaurant ID from route params or cart
      const restaurantId =
        route.params?.restaurantId || cartItems[0]?.menuItem?.restaurantId;

      if (!restaurantId) {
        Alert.alert(t('error'), 'Restaurant information missing');
        return;
      }

      await createOrderFromCart(restaurantId);
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_place_order'));
      console.error('Order placement error:', error);
    }
  }, [createOrderFromCart, route.params, cartItems, t]);

  // Handle customer order confirmation (after restaurant confirms)
  const handleCustomerConfirmOrder = useCallback(() => {
    confirmOrder();
  }, [confirmOrder]);

  // Handle proceed to payment
  const handleProceedToPayment = useCallback(() => {
    if (flowState.orderId && flowState.orderData) {
      navigation.navigate('PaymentProcessing', {
        orderId: flowState.orderId,
        amount: flowState.orderData.total,
        paymentMethod: selectedPaymentMethod || 'mobile_money',
        provider: selectedProvider || 'mtn',
      });
    }
  }, [navigation, flowState, selectedPaymentMethod, selectedProvider]);

  // Handle order status modal close
  const handleCloseOrderModal = useCallback(() => {
    if (isCompleted) {
      // Navigate to orders screen
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'CustomerApp',
            params: { screen: 'Orders' },
          },
        ],
      });
    } else if (isFailed) {
      // Reset flow and stay on checkout
      resetFlow();
    }
  }, [isCompleted, isFailed, navigation, resetFlow]);

  // Handle place order - show bottom sheet
  const handlePlaceOrder = useCallback(() => {
    if (cartItems.length === 0) {
      Alert.alert(t('error'), t('your_cart_is_empty'));
      return;
    }

    // Check if required information is available
    if (!defaultAddress) {
      Alert.alert(t('error'), t('please_add_delivery_address'), [
        {
          text: t('add_address'),
          onPress: () => navigation.navigate('AddressScreen'),
        },
        { text: t('cancel'), style: 'cancel' },
      ]);
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert(t('error'), t('please_select_payment_method'), [
        {
          text: t('select_payment'),
          onPress: () => navigation.navigate('PaymentMethods'),
        },
        { text: t('cancel'), style: 'cancel' },
      ]);
      return;
    }

    // Present the enhanced checkout content with cart management
    present(
      <CheckoutContent onConfirm={handleConfirmOrder} onDismiss={dismiss} />,
      {
        snapPoints: ['40%'], // Allow for more content
        enablePanDownToClose: true,
        title: t('confirm_your_order'),
        showHandle: true,
        backdropOpacity: 0.5,
      },
    );
  }, [
    cartItems.length,
    defaultAddress,
    selectedPaymentMethod,
    present,
    handleConfirmOrder,
    dismiss,
    navigation,
    t,
  ]);

  // Optimized render item
  const renderCheckoutItem: ListRenderItem<CartItem> = useCallback(
    ({ item }) => (
      <CheckOutItem
        id={item.id}
        menuItem={item.menuItem}
        quantity={item.quantity}
        specialInstructions={item.specialInstructions}
        addedAt={item.addedAt}
      />
    ),
    [],
  );

  // Key extractor
  const keyExtractor = useCallback((item: CartItem) => item.id, []);

  // Card style
  const cardStyle = useMemo(
    () => ({
      marginVertical: 8,
      borderColor: colors.surface,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    }),
    [colors],
  );

  // Common row style for interactive rows
  const interactiveRowStyle = useMemo(
    () => 'flex-row items-center justify-between py-3 px-1',
    [],
  );

  // Handle empty cart state
  if (cartItems.length === 0) {
    return (
      <CommonView>
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons
            name="shopping-cart"
            size={80}
            color={colors.onSurfaceVariant}
          />
          <Text
            className="text-xl font-semibold mt-4 mb-2 text-center"
            style={{ color: colors.onSurface }}
          >
            {t('your_cart_is_empty')}
          </Text>
          <Text
            className="text-base text-center mb-8"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('add_some_delicious_items_to_get_started')}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-8 py-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.onPrimary }}
            >
              {t('start_shopping')}
            </Text>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <ScrollView
        className="flex-1 px-1 py-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Delivery Address Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <Text
              className="font-semibold text-lg mb-3"
              style={{ color: colors.onSurface }}
            >
              {t('delivery_address')}
            </Text>

            <View
              className={`h-px mb-3`}
              style={{ backgroundColor: colors.outline }}
            />

            <TouchableOpacity
              className={interactiveRowStyle}
              onPress={handleAddressPress}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="location" color={colors.primary} size={28} />

                <View className="flex-col mx-3 flex-1">
                  <View className="flex-row mb-1 items-center">
                    <Text
                      className="text-base font-semibold mr-2"
                      style={{ color: colors.onSurface }}
                    >
                      {defaultAddress?.label || t('home')}
                    </Text>
                    {defaultAddress?.isDefault && (
                      <View
                        className="bg-blue-100 rounded-md px-2 py-1"
                        style={{ backgroundColor: colors.primaryContainer }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{ color: colors.primary }}
                        >
                          {t('default')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                    numberOfLines={2}
                  >
                    {defaultAddress?.fullAddress || t('time_square_nyc')}
                  </Text>
                </View>
              </View>

              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Order Summary Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className="font-semibold text-lg"
                style={{ color: colors.onSurface }}
              >
                {t('order_summary')} ({totalItems} {t('items')})
              </Text>

              <TouchableOpacity
                onPress={handleAddItems}
                activeOpacity={0.8}
                className="border-2 rounded-full px-3 py-1"
                style={{ borderColor: colors.primary }}
              >
                <Text
                  className="font-semibold text-xs"
                  style={{ color: colors.primary }}
                >
                  {t('add_items')}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={`h-px mb-3`}
              style={{ backgroundColor: colors.outline }}
            />

            <FlatList
              data={cartItems}
              keyExtractor={keyExtractor}
              renderItem={renderCheckoutItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </Card.Content>
        </Card>

        {/* Payment & Promo Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <TouchableOpacity
              className={interactiveRowStyle}
              onPress={handlePaymentPress}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="card-outline"
                  color={colors.primary}
                  size={26}
                />
                <Text
                  className="text-base ml-3 font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {t('payment_method')}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text
                  className="text-sm mr-2"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {selectedPaymentMethod === 'mobile_money'
                    ? selectedProvider === 'mtn'
                      ? 'MTN Mobile Money'
                      : selectedProvider === 'orange'
                        ? 'Orange Money'
                        : 'Mobile Money'
                    : selectedPaymentMethod === 'cash'
                      ? 'Cash on Delivery'
                      : t('e_wallet')}
                </Text>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={18}
                  color={colors.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>

            <View
              className={`h-px my-3`}
              style={{ backgroundColor: colors.outline }}
            />

            <TouchableOpacity
              className={interactiveRowStyle}
              onPress={handlePromoPress}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="local-offer"
                  color={colors.primary}
                  size={26}
                />
                <Text
                  className="text-base ml-3 font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {t('promo_code')}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text
                  className="text-sm mr-2"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('add_code')}
                </Text>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={18}
                  color={colors.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Order Total Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <Text
              className="font-semibold text-lg mb-3"
              style={{ color: colors.onSurface }}
            >
              {t('order_total')}
            </Text>

            <View
              className={`h-px mb-4`}
              style={{ backgroundColor: colors.outline }}
            />

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('subtotal')}:
                </Text>
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.onSurface }}
                >
                  {calculations.subtotal} FCFA
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('delivery_fee')}:
                </Text>
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.onSurface }}
                >
                  {calculations.deliveryFee}FCFA
                </Text>
              </View>

              {DISCOUNT > 0 && (
                <>
                  <Seperator />
                  <View className="flex-row justify-between items-center">
                    <Text style={{ color: colors.primary }}>
                      {t('discount')}:
                    </Text>
                    <Text
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      -{calculations.discount} FCFA
                    </Text>
                  </View>
                </>
              )}

              <View
                className={`h-px my-2`}
                style={{ backgroundColor: colors.outline }}
              />

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-lg font-bold"
                  style={{ color: colors.onSurface }}
                >
                  {t('total')}:
                </Text>
                <Text
                  className="font-bold text-lg"
                  style={{ color: colors.primary }}
                >
                  {calculations.finalTotal} FCFA
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Place Order Button */}
      <View className=" px-4 pb-4 " style={{ backgroundColor: colors.surface }}>
        <View
          className="h-px mb-4"
          style={{ backgroundColor: colors.surface }}
        />

        <TouchableOpacity
          className="rounded-2xl py-4 px-6"
          style={{ backgroundColor: colors.primary }}
          onPress={handlePlaceOrder}
          activeOpacity={0.9}
        >
          <Text
            className="text-lg font-bold text-center"
            style={{ color: colors.onPrimary }}
          >
            {t('review_order')} - {calculations.finalTotal} FCFA
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Status Modal */}
      <OrderStatusModal
        visible={flowState.step !== 'creating' && !isCompleted}
        flowState={flowState}
        onConfirmOrder={handleCustomerConfirmOrder}
        onProceedToPayment={handleProceedToPayment}
        onClose={handleCloseOrderModal}
        isConfirmingOrder={isConfirmingOrder}
      />
    </CommonView>
  );
};

export default CheckOutScreen;
