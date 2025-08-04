import { View, Text } from 'react-native';
import React, { useState } from 'react';
import CommonView from '@/src/components/common/CommonView';

const CartScreen = () => {
const [data, setData] = useState([]);
  
  return (
    <CommonView backgroundColor="#fff">
      <Text className="place-items-center text-center">Order Screen</Text>
    </CommonView>
  );
};

export default CartScreen;


