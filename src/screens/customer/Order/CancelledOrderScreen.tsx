import { useTranslation } from 'react-i18next';
import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import CommonView from '@/src/components/common/CommonView';
import OrderItemCard from '@/src/components/customer/OrderItemCard';
import { useCancelledOrders } from '@/src/hooks/customer/useOrdersApi';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import { useTheme } from 'react-native-paper';
import { Order } from '@/src/types';

const CancelledOrderScreen = () => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();

  // Fetch cancelled orders using React Query
  const {
    data: cancelledOrders,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useCancelledOrders();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleReorder = useCallback((order: Order) => {
    // Handle reorder logic
    console.log('Reorder:', order);
  }, []);

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => (
      <OrderItemCard key={item.id} order={item} onReorder={handleReorder} />
    ),
    [handleReorder],
  );

  const keyExtractor = useCallback((item: Order) => item.id, []);

  const renderEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
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
          fontFamily: 'Urbanist-SemiBold',
        }}
      >
        {t('no_cancelled_orders_found')}
      </Text>
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: 14,
          textAlign: 'center',
          opacity: 0.8,
          fontFamily: 'Urbanist-Regular',
        }}
      >
        {t('your_cancelled_orders_will_appear_here')}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <CommonView>
      <View
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: colors.background,
        }}
      >
        <FlatList
          data={cancelledOrders || []}
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

export default CancelledOrderScreen;
