import { View, Text } from 'react-native';
import React from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';

const PaymentScreen = ({
  navigation,
}: RootStackScreenProps<'PaymentMethods'>) => {
  return (
    <View>
      <Text className="text-center items-center justify-center">
        PaymentScreen
      </Text>
    </View>
  );
};

export default PaymentScreen;
