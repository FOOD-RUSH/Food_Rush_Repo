import { View, Text } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';
import CartFoodComponent from '@/src/components/customer/CartFoodComponent';
import { Button } from 'react-native-paper';
import { RootStackScreenProps } from '@/src/navigation/types';

const CartScreen = ({navigation}: RootStackScreenProps<'Cart'>) => {
const [data, setData] = useState([]);
  
  return (
    <CommonView backgroundColor="#fff">
      <Text className="place-items-center text-center">Order Screen</Text>
      <CartFoodComponent />
      <Button mode='outlined' onPress={() => { navigation.navigate('Checkout', { cartId: '1234' }); } } >
        <Text>gotochecjout</Text>
        </Button>
    </CommonView>
  );
};

export default CartScreen;


