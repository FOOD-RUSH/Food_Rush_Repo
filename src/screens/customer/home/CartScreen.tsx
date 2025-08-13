import React, { useMemo, useCallback } from 'react';
import { View, Text, Image, FlatList, ListRenderItem } from 'react-native';
import CommonView from '@/src/components/common/CommonView';
import CartFoodComponent from '@/src/components/customer/CartFoodComponent';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCartStore, CartItem } from '@/src/stores/cartStore';
import { images } from '@/assets/images';

const CartScreen = ({ navigation }: RootStackScreenProps<'Cart'>) => {
  const { colors } = useTheme();

  // Subscribe to specific store slices to minimize re-renders
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalprice);
  const cartId = useCartStore((state) => state.CartID);

  // Memoize formatted total price
  const formattedTotalPrice = useMemo(() => 
    (totalPrice || 0).toLocaleString('fr-FR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    }), [totalPrice]
  );

  // Memoize total items count
  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]
  );

  // Handle navigation to checkout
  const handleCheckout = useCallback(() => {
    if (cartId) {
      navigation.navigate('Checkout', { cartId });
    }
  }, [navigation, cartId]);

  // Optimized render item with useCallback to prevent unnecessary re-renders
  const renderCartItem: ListRenderItem<CartItem> = useCallback(({ item }) => (
    <CartFoodComponent
      id={item.id}
      menuItem={item.menuItem}
      ItemtotalPrice={item.ItemtotalPrice}
      quantity={item.quantity}
      specialInstructions={item.specialInstructions}
    />
  ), []);

  // Key extractor
  const keyExtractor = useCallback((item: CartItem) => item.id, []);

  // Item separator component
  const ItemSeparator = useCallback(() => (
    <View style={{ height: 4 }} />
  ), []);

  // Empty cart component
  const EmptyCartComponent = useMemo(() => (
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
        Your Cart is Empty
      </Text>
      <Text 
        className="text-sm text-center leading-5"
        style={{ color: colors.onSurfaceVariant }}
      >
        Add some delicious items to your cart to get started
      </Text>
    </View>
  ), [colors.onSurfaceVariant]);

  // Early return for empty cart
  if (cartItems.length === 0) {
    return (
      <CommonView>
        {EmptyCartComponent}
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View className="flex-1">
        {/* Cart Header */}
       
        {/* Cart Items List */}
        <FlatList
          data={cartItems}
          keyExtractor={keyExtractor}
          renderItem={renderCartItem}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingVertical: 40,
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
          disabled={!cartId}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text
                className="font-semibold text-base"
                style={{ color: colors.onPrimary }}
              >
                Checkout
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
