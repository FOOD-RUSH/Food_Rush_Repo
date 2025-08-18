import React, { useMemo, useCallback } from 'react';
import { View, Text, Image, FlatList, ListRenderItem } from 'react-native';
import CommonView from '@/src/components/common/CommonView';
import CartFoodComponent from '@/src/components/customer/CartFoodComponent';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCartStore, CartItem } from '@/src/stores/customerStores/cartStore';
import { images } from '@/assets/images';
import { useLanguage } from '@/src/contexts/LanguageContext';
import Toast from 'react-native-toast-message';

const CartScreen = ({ navigation }: RootStackScreenProps<'Cart'>) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Subscribe to specific store slices to minimize re-renders
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalprice);
  const cartId = useCartStore((state) => state.CartID);
  const clearCart = useCartStore((state) => state.clearCart);

  // Memoize formatted total price
  const formattedTotalPrice = useMemo(
    () =>
      (totalPrice || 0).toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [totalPrice],
  );

  // Memoize total items count
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  // Handle navigation to checkout
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'info',
        text1: t('info'),
        text2: t('cart_empty'),
        position: 'top',
      });
      return;
    }
    
    if (cartId) {
      navigation.navigate('Checkout', { cartId });
    } else {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Unable to proceed to checkout. Please try again.',
        position: 'top',
      });
    }
  }, [cartItems.length, cartId, navigation, t]);

  // Handle clear cart
  const handleClearCart = useCallback(() => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'info',
        text1: t('info'),
        text2: t('cart_empty'),
        position: 'top',
      });
      return;
    }
    
    clearCart();
    Toast.show({
      type: 'success',
      text1: t('success'),
      text2: 'Cart cleared successfully',
      position: 'top',
    });
  }, [cartItems.length, clearCart, t]);

  // Optimized render item with useCallback to prevent unnecessary re-renders
  const renderCartItem: ListRenderItem<CartItem> = useCallback(
    ({ item }) => (
      <CartFoodComponent
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

  // Item separator component
  const ItemSeparator = useCallback(() => <View style={{ height: 4 }} />, []);

  // Empty cart component
  const EmptyCartComponent = useMemo(
    () => (
      <View className="flex-1 items-center justify-center px-8 py-12">
        <Image
          source={images.NoOrdersLight}
          className="w-48 h-48 mb-6"
          resizeMode="contain"
        />
        <Text
          className="text-xl font-semibold text-center mb-2"
          style={{ color: colors.onSurfaceVariant }}
        >
          {t('cart_empty')}
        </Text>
        <Text
          className="text-sm text-center leading-5"
          style={{ color: colors.onSurfaceVariant }}
        >
          {t('cart_empty_description')}
        </Text>
      </View>
    ),
    [colors.onSurfaceVariant, t],
  );

  // Early return for empty cart
  if (cartItems.length === 0) {
    return <CommonView>{EmptyCartComponent}</CommonView>;
  }

  return (
    <CommonView>
      <View className="flex-1">
        {/* Cart Header */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text
            className="text-xl font-bold"
            style={{ color: colors.onSurface }}
          >
            {t('cart')}
          </Text>
          <TouchableRipple
            onPress={handleClearCart}
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.surfaceVariant }}
          >
            <Text
              className="text-sm font-medium"
              style={{ color: colors.primary }}
            >
              {t('clear_cart')}
            </Text>
          </TouchableRipple>
        </View>

        {/* Cart Items List */}
        <FlatList
          data={cartItems}
          keyExtractor={keyExtractor}
          renderItem={renderCartItem}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            paddingBottom: 120, // Space for checkout button
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          getItemLayout={(_, index) => ({
            length: 90,
            offset: 94 * index,
            index,
          })}
        />
      </View>

      {/* Checkout Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4"
        style={{ backgroundColor: colors.surface }}
      >
        <View
          className="h-px mb-4"
          style={{ backgroundColor: colors.outline }}
        />

        <TouchableRipple
          className="rounded-2xl py-4 px-6"
          style={{ backgroundColor: colors.primary }}
          onPress={handleCheckout}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text
                className="font-semibold text-base"
                style={{ color: colors.onPrimary }}
              >
                {t('checkout')}
              </Text>
              <Text
                className="text-sm opacity-90"
                style={{ color: colors.onPrimary }}
              >
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </Text>
            </View>

            <Text
              className="font-bold text-lg"
              style={{ color: colors.onPrimary }}
            >
              {formattedTotalPrice} FCFA
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </CommonView>
  );
};

export default CartScreen;
