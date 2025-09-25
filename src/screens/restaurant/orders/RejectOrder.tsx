import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useRejectOrder } from '@/src/hooks/restaurant/useOrderApi';
import { RootStackParamList } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { Heading3, Body, Label } from '@/src/components/common/Typography';

const RejectOrder: React.FC = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, 'RestaurantRejectOrder'>>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { orderId } = route.params;
  const rejectOrderMutation = useRejectOrder();
  const [reason, setReason] = useState('');

  const handleReject = async () => {
    try {
      await rejectOrderMutation.mutateAsync(orderId);
      Alert.alert(t('success'), t('order_rejected_successfully'));
      navigation.goBack();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(t('error'), error.message || t('failed_to_reject_order'));
      } else {
        Alert.alert(t('error'), t('unexpected_error_occurred'));
      }
    }
  };

  return (
    <CommonView>
      <View className="flex-1 p-6">
        <Heading3 color={colors.onSurface} style={{ marginBottom: 8 }}>
          {t('reject_order')}
        </Heading3>
        <Body color={colors.onSurfaceVariant} style={{ marginBottom: 24 }}>
          {t('order_id')}: {orderId}
        </Body>

        <View className="mb-6">
          <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
            {t('reason_for_rejection')} ({t('optional')})
          </Label>
          <TextInput
            mode="outlined"
            placeholder={t('enter_reason')}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            style={{ backgroundColor: colors.surface }}
          />
        </View>

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
            onPress={handleReject}
            loading={rejectOrderMutation.isPending}
          >
            {t('reject')}
          </Button>
        </View>
      </View>
    </CommonView>
  );
};

export default RejectOrder;
