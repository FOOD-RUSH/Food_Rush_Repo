import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useConfirmOrder } from '@/src/hooks/restaurant/useOrderApi';
import { RootStackParamList } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';

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
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.onSurface }}>
          {t('confirm_order')}
        </Text>
        <Text className="text-base mb-6" style={{ color: colors.onSurfaceVariant }}>
          {t('order_id')}: {orderId}
        </Text>
        
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