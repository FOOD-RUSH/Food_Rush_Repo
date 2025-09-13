import { useTranslation } from 'react-i18next';
import { View, Text, Image, FlatList, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import OrderItemCard from '@/src/components/customer/OrderItemCard';
import CommonView from '@/src/components/common/CommonView';
import {
  useActiveOrders,
  useActiveOrdersCount,
} from '@/src/hooks/customer/useOrdersApi';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import { useTheme } from 'react-native-paper';
import { Order } from '@/src/types';

const ActiveOrderScreen = () => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();

  // Fetch active orders using React Query
  const {
    data: activeOrders,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useActiveOrders();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleTrackOrder = useCallback((orderId: string) => {
    // Handle order tracking navigation
    console.log('Track order:', orderId);
  }, []);

  const handleReorder = useCallback((order: Order) => {
    // Handle reorder logic
    console.log('Reorder:', order);
  }, []);

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => (
      <OrderItemCard
        key={item.id}
        order={item}
        onTrackOrder={handleTrackOrder}
        onReorder={handleReorder}
      />
    ),
    [handleTrackOrder, handleReorder],
  );

  const keyExtractor = useCallback((item: Order) => item.id, []);

  const renderEmptyComponent = () => (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Image
        source={require('@/assets/images/NoOrdersLight.png')}
        style={{ width: 200, height: 200, marginBottom: 16 }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {t('no_active_orders_found')}
      </Text>
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: 14,
          textAlign: 'center',
          opacity: 0.8,
        }}
      >
        {t('your_active_orders_will_appear_here')}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <CommonView>
      <View
        className="flex-1 h-full"
        style={{ backgroundColor: colors.background }}
      >
        <FlatList
          data={activeOrders || []}
          renderItem={renderOrderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      </View>
    </CommonView>
  );
};

export default ActiveOrderScreen;
