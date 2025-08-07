import { View, Text, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import CartFoodComponent from '@/src/components/customer/CartFoodComponent';
import { Button, TouchableRipple } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useTheme } from '@/src/hooks/useTheme';
import { useCartStore } from '@/src/stores/cartStore';
import { images } from '@/assets/images';

const CartScreen = ({ navigation }: RootStackScreenProps<'Cart'>) => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';

  const CartItemsList = useCartStore().items;
  const editCartItem = useCartStore().modifyCart;
  const deleteCartItem = useCartStore().deleteCart;
  const totalPrice = useCartStore().totalprice;

  const renderEmptyComponent = () => {
    return (
      <CommonView>
        <View className="flex-1 items-center justify-center px-8 py-12">
          <Image source={images.NoOrdersLight} className="w-48 h-48 mb-6" />
          <Text className="text-gray-500 text-lg text-center">Empty</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Your don&apos;t have any food in your cart at this time
          </Text>
        </View>
      </CommonView>
    );
  };

  return (
    <CommonView>
      <Text
        className={`place-items-center text-center text-lg font-semibold ${textColor}`}
      >
        Order Screen
      </Text>
      <Button
        mode="outlined"
        onPress={() => {
          navigation.navigate('Checkout', { cartId: '1234' });
        }}
      >
        <Text>go to checkout</Text>
      </Button>
      <FlatList
        data={CartItemsList}
        renderItem={({ item }) => (
          <CartFoodComponent
            id={item.id}
            menuItem={item.menuItem}
            ItemtotalPrice={item.ItemtotalPrice}
            quantity={item.quantity}
          />
        )}
        ListEmptyComponent={renderEmptyComponent}
      />
      <TouchableRipple className="rounded-full pb-4 pt-2 px-6  absolute bottom-0">
        <Text className="font-semibold text-lg" style={{ color: 'white' }}>
          Check Out
        </Text>
      </TouchableRipple>
    </CommonView>
  );
};

export default CartScreen;
