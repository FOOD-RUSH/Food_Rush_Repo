import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Platform,
} from 'react-native';
import CommonView from '@/src/components/common/CommonView';
import CartFoodComponent from '@/src/components/customer/CartFoodComponent';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCartStore, CartItem } from '@/src/stores/customerStores/cartStore';
import { images } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';

const CartScreen = ({ navigation }: RootStackScreenProps<'Cart'>) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

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
        text1: t('info') || 'Info',
        text2: t('cart_empty') || 'Your cart is empty',
        position: 'top',
      });
      return;
    }

    if (cartId) {
      navigation.navigate('Checkout', { cartId });
    } else {
      Toast.show({
        type: 'error',
        text1: t('error') || 'Error',
        text2:
          t('unable_to_proceed_to_checkout') || 'Unable to proceed to checkout',
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
        position: 'bottom',
      });
      return;
    }

    clearCart();
    Toast.show({
      type: 'success',
      text1: t('success'),
      text2: t('cart_cleared_successfully'),
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
    return (
      <CommonView>
        <View
          className=" flex-row  justify-between items-center px-2 py-4 mb-3 "
          style={{
            backgroundColor: colors.surface,
            borderBottomColor: colors.outline,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons
              name={Platform.OS === 'ios' ? 'arrow-back-ios-new' : 'arrow-back'}
              size={25}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <Text className="text-xl" style={{ color: colors.onSurface }}>
            {t('my_cart') || 'My Cart'}
          </Text>
          <TouchableOpacity onPress={handleClearCart}>
            <MaterialIcons
              name="delete-forever"
              size={30}
              color={colors.error}
            />
          </TouchableOpacity>
        </View>
        {EmptyCartComponent}
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View className="flex-1">
        {/* Cart Header */}
        <View
          className=" flex-row  justify-between items-center px-2 py-4 mb-3 "
          style={{
            backgroundColor: colors.surface,
            borderBottomColor: colors.outline,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons
              name={Platform.OS === 'ios' ? 'arrow-back-ios-new' : 'arrow-back'}
              size={25}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <Text className="text-xl" style={{ color: colors.onSurface }}>
            {t('my_cart')}
          </Text>
          <TouchableOpacity onPress={handleClearCart}>
            <MaterialIcons
              name="delete-forever"
              size={30}
              color={colors.error}
            />
          </TouchableOpacity>
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
                {totalItems} {t('item')}
                {totalItems !== 1 ? t('items_suffix') : ''}
              </Text>
            </View>

            <Text
              className="font-bold text-lg"
              style={{ color: colors.onPrimary }}
            >
              {formattedTotalPrice} {t('fcfa_unit')}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </CommonView>
  );
};

export default CartScreen;
