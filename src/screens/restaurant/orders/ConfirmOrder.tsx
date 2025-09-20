import React from 'react';
import { View, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useConfirmOrder } from '@/src/hooks/restaurant/useOrderApi';
import { RootStackParamList } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { Heading3, Body } from '@/src/components/common/Typography';

const ConfirmOrder: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantConfirmOrder'>>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { orderId } = route.params;
  const confirmOrderMutation = useConfirmOrder();

  const handleConfirm = async () => {
    try {
      await confirmOrderMutation.mutateAsync(orderId);
      Alert.alert(t('success'), t('order_confirmed_successfully'));
      navigation.goBack();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(t('error'), error.message || t('failed_to_confirm_order'));
      } else {
        Alert.alert(t('error'), t('unexpected_error_occurred'));
      }
    }
  };

  return (
    <CommonView>
      <View className="flex-1 p-6">
        <Heading3 color={colors.onSurface} style={{ marginBottom: 8 }}>
          {t('confirm_order')}
        </Heading3>
        <Body color={colors.onSurfaceVariant} style={{ marginBottom: 24 }}>
          {t('order_id')}: {orderId}
        </Body>
        
        <View className="space-y-4">
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            {t('cancel')}
          </Button>
          
          <Button 
            mode="contained" 
            onPress={handleConfirm} 
            loading={confirmOrderMutation.isPending}
          >
            {t('confirm')}
          </Button>
        </View>
      </View>
    </CommonView>
  );
};

export default ConfirmOrder;
