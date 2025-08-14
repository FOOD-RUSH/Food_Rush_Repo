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
import { useCartStore, CartItem } from '@/src/stores/customerStores/cartStore';

const CheckOutScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Checkout'>) => {
  const { colors } = useTheme();

  // Subscribe to specific store slices
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalprice);
  const restaurantID = useCartStore((state) => state.restaurantID);

  // Constants for fees
  const DELIVERY_FEE = 2300;
  const DISCOUNT = 0; // Could be dynamic based on promo codes

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
    Alert.alert('Info', 'Address selection coming soon!');
  }, []);

  // Handle payment method selection
  const handlePaymentPress = useCallback(() => {
    Alert.alert('Info', 'Payment method selection coming soon!');
  }, []);

  // Handle promo code
  const handlePromoPress = useCallback(() => {
    Alert.alert('Info', 'Promo code functionality coming soon!');
  }, []);

  // Handle place order
  const handlePlaceOrder = useCallback(() => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Place order for ${calculations.finalTotalRaw} FCFA?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            // Handle order placement
            Alert.alert('Success', 'Order placed successfully!');
            // Clear cart and navigate
            // useCartStore.getState().clearCart();
            // navigation.navigate('OrderTracking');
          },
        },
      ],
    );
  }, [cartItems.length, calculations.finalTotalRaw]);

  // Optimized render item
  const renderCheckoutItem: ListRenderItem<CartItem> = useCallback(
    ({ item }) => (
      <CheckOutItem
        id={item.id}
        menuItem={item.menuItem}
        ItemtotalPrice={item.ItemtotalPrice}
        quantity={item.quantity}
        specialInstructions={item.specialInstructions}
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
      borderColor: colors.outline,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
    }),
    [colors],
  );

  // Common row style for interactive rows
  const interactiveRowStyle = useMemo(
    () => 'flex-row items-center justify-between py-3 px-1',
    [],
  );

  if (cartItems.length === 0) {
    return (
      <CommonView>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg" style={{ color: colors.onSurface }}>
            No items in cart
          </Text>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <ScrollView
        className="flex-1 px-1 pt-2"
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
              Delivery Address
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
                      Home
                    </Text>
                    <View
                      className="bg-blue-100 rounded-md px-2 py-1"
                      style={{ backgroundColor: colors.primaryContainer }}
                    >
                      <Text
                        className="text-xs font-medium"
                        style={{ color: colors.primary }}
                      >
                        Default
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                    numberOfLines={2}
                  >
                    Time Square NYC, Manhattan
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
                Order Summary ({totalItems} items)
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
                  Add Items
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
                  Payment Method
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text
                  className="text-sm mr-2"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  E-Wallet
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
                  Promo Code
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text
                  className="text-sm mr-2"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Add Code
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
              Order Total
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
                  Subtotal:
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
                  Delivery Fee:
                </Text>
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.onSurface }}
                >
                  {calculations.deliveryFee} FCFA
                </Text>
              </View>

              {DISCOUNT > 0 && (
                <>
                  <Seperator />
                  <View className="flex-row justify-between items-center">
                    <Text style={{ color: colors.primary }}>Discount:</Text>
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
                  Total:
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
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4"
        style={{ backgroundColor: colors.surface }}
      >
        <View
          className="h-px mb-4"
          style={{ backgroundColor: colors.outline }}
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
            Place Order - {calculations.finalTotal} FCFA
          </Text>
        </TouchableOpacity>
      </View>
    </CommonView>
  );
};

export default CheckOutScreen;
