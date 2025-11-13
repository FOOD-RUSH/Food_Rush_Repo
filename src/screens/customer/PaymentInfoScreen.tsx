import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';

const PaymentInfoScreen = ({ navigation }: RootStackScreenProps<'PaymentInfo'>) => {
  const { colors } = useTheme();

  return (
    <CommonView>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4" style={{ color: colors.onSurface }}>
          Payment Information
        </Text>
        <Text className="text-lg" style={{ color: colors.onSurface }}>
          You must pay immediately after creating your order so that the restaurant can see and process it.
        </Text>
      </View>
    </CommonView>
  );
};

export default PaymentInfoScreen;
