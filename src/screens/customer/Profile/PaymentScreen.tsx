import { MaterialIcon } from '@/src/components/common/icons';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { Card, useTheme } from 'react-native-paper';
import { images } from '@/assets/images';

const PaymentScreen = ({
  navigation,
}: RootStackScreenProps<'PaymentMethods'>) => {
  const { } = useTranslation('translation');
  const { colors } = useTheme();

  const handleSelectPaymentMethod = (method: string) => {
    // Handle payment method selection
    console.log('Selected payment method:', method);
    navigation.goBack(); // Navigate back to the checkout screen
  };

  const cardStyle = {
    marginVertical: 8,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  };

  return (
    <CommonView>
      <View className="flex-1 px-4 py-4">
        {/* MTN Mobile Money Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => handleSelectPaymentMethod('mtn_mobile_money')}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Image
                  source={images.Mobile_Money}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
                <View className="ml-4">
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.onSurface }}
                  >
                    MTN Mobile Money
                  </Text>
                  <Text
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Mobile Payment
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

        {/* Orange Mobile Money Card */}
        <Card mode="outlined" style={cardStyle}>
          <Card.Content className="py-4">
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => handleSelectPaymentMethod('orange_money')}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Image
                  source={images.Orange_Money}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
                <View className="ml-4">
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.onSurface }}
                  >
                    Orange Mobile Money
                  </Text>
                  <Text
                    className="text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Mobile Payment
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
      </View>
    </CommonView>
  );
};

export default PaymentScreen;
