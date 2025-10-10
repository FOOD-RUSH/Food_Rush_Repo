import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
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

import { RootStackScreenProps } from '@/src/navigation/types';
import { Card, useTheme } from 'react-native-paper';
import CheckOutItem from '@/src/components/customer/CheckOutItem';
import {
  useCartStore,
  useCartItems,
  useCartSubtotal,
  useCartDeliveryFee,
  useCartServiceFee,
  useCartTotal,
  useCartItemCount,
  CartItem,
} from '@/src/stores/customerStores/cartStore';
import { useDefaultAddress } from '@/src/location/store';
import { useOrderFlow } from '@/src/hooks/customer/useOrderFlow';
import { useLocationForQueries } from '@/src/hooks/customer/useLocationService';
import CustomOrderConfirmationModal from '@/src/components/customer/CustomOrderConfirmationModal';

import { useTranslation } from 'react-i18next';

const CheckOutScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Checkout'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  
  // Modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Subscribe to specific store slices
  const cartItems = useCartItems();
  const subtotal = useCartSubtotal();
  const deliveryFee = useCartDeliveryFee();
  const serviceFee = useCartServiceFee();
  const total = useCartTotal();
  const itemCount = useCartItemCount();
  
  const defaultAddress = useDefaultAddress();


  // Get live location for order creation
  const { nearLat, nearLng } = useLocationForQueries();

  // Order flow hook
  const {
    flowState,
    createOrderFromCart,
    isCreatingOrder,
    shouldProceedToPayment,
    startPaymentFlow,
  } = useOrderFlow();

  // Navigate to payment when order is created successfully
  useEffect(() => {
    if (shouldProceedToPayment && flowState.orderId && flowState.orderData) {
      // Mark payment flow as started
      startPaymentFlow();
      
      // Navigate to payment processing with order details
      navigation.navigate('PaymentProcessing', {
        orderId: flowState.orderId,
        amount: flowState.orderData.total,
        provider: 'mtn', // Default provider, user can change in payment screen
      });
      
      // Close the order modal
      setShowOrderModal(false);
    }
  }, [shouldProceedToPayment, flowState.orderId, flowState.orderData, startPaymentFlow, navigation]);

  // Memoized calculations for display
  const calculations = useMemo(() => ({
    subtotal: subtotal.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    deliveryFee: deliveryFee.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    serviceFee: serviceFee.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    total: total.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    totalRaw: total,
  }), [subtotal, deliveryFee, serviceFee, total]);

  // Handle navigation back to menu
  const handleAddItems = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle address selection - Use push() to ensure screen appears on top
  const handleAddressPress = useCallback(() => {
    navigation.push('AddressScreen');
  }, [navigation]);

  // Handle payment info press (informational only)
  const handlePaymentPress = useCallback(() => {
    Alert.alert(
      t('payment_info'),
      t('payment_after_restaurant_confirmation'),
      [{ text: t('ok') }]
    );
  }, [t]);

  // Handle promo code
  const handlePromoPress = useCallback(() => {
    Alert.alert(t('info'), t('promo_code_functionality_coming_soon'));
  }, [t]);

  // Handle place order confirmation - create actual order
  const handleConfirmOrder = useCallback(async () => {
    try {
      // Get restaurant ID from cart store or cart items
      const cartRestaurantId = useCartStore.getState().restaurantID;
      const restaurantId =
        cartRestaurantId ||
        route.params?.restaurantId ||
        cartItems[0]?.menuItem?.restaurantId;

      if (!restaurantId) {
        Alert.alert(t('error'), 'Restaurant information missing');
        console.error('Missing restaurant ID:', {
          cartRestaurantId,
          routeRestaurantId: route.params?.restaurantId,
          firstItemRestaurantId: cartItems[0]?.menuItem?.restaurantId,
          cartItemsLength: cartItems.length,
        });
        return;
      }
      
      // Create order with live coordinates for delivery fee calculation
      await createOrderFromCart(restaurantId, {
        latitude: nearLat,
        longitude: nearLng,
      });
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_place_order'));
      console.error('Order placement error:', error);
      setShowOrderModal(false);
    }
  }, [createOrderFromCart, route.params, cartItems, t, nearLat, nearLng]);

  // Handle place order - show validation modal
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
          onPress: () => navigation.push('AddressScreen'),
        },
        { text: t('cancel'), style: 'cancel' },
      ]);
      return;
    }

    // Show order validation modal
    setShowOrderModal(true);
  }, [cartItems.length, defaultAddress, navigation, t]);

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
          <MaterialIcon
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
                <IoniconsIcon
                  name="location"
                  color={colors.primary}
                  size={28}
                />

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

              <MaterialIcon
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
                {t('order_summary')} ({itemCount} {t('items')})
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

        {/* Payment Info & Promo Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <TouchableOpacity
              className={interactiveRowStyle}
              onPress={handlePaymentPress}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <IoniconsIcon
                  name="information-circle-outline"
                  color={colors.primary}
                  size={26}
                />
                <Text
                  className="text-base ml-3 font-medium"
                  style={{ color: colors.onSurface }}
                >
                  {t('payment_info')}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text
                  className="text-sm mr-2"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('pay_after_confirmation')}
                </Text>
                <MaterialIcon
                  name="info"
                  size={18}
                  color={colors.primary}
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
                <MaterialIcon
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
                <MaterialIcon
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
                  {calculations.subtotal} XAF
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
                  {calculations.deliveryFee} XAF
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('service_fee')}:
                </Text>
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.onSurface }}
                >
                  {calculations.serviceFee} XAF
                </Text>
              </View>

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
                  {calculations.total} XAF
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
            {t('place_order')} - {calculations.total} XAF
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Order Confirmation Modal */}
      <CustomOrderConfirmationModal
        visible={showOrderModal}
        onDismiss={() => setShowOrderModal(false)}
        onConfirm={handleConfirmOrder}
        isLoading={isCreatingOrder}
      />


    </CommonView>
  );
};

export default CheckOutScreen;