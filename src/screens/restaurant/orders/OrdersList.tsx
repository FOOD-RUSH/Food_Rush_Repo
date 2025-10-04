import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, TextInput, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantOrdersStackScreenProps } from '@/src/navigation/types';
import {
  useGetOrders,
  useConfirmOrder,
  useRejectOrder,
} from '@/src/hooks/restaurant/useOrderApi';
import { Order } from '@/src/services/restaurant/orderApi';
import {
  Heading1,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import {
  getCustomerName,
  formatOrderTotal,
  sortOrdersByPriority,
  createOrderSummary,
  ORDER_STATUS_COLORS,
} from '@/src/utils/orderUtils';
import { useUnreadNotificationCount } from '@/src/hooks/useNotifications';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';

const Tab = createMaterialTopTabNavigator();

interface OrderCardProps {
  item: Order;
  onPress: (orderId: string) => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = React.memo(
  ({ item, onPress, showActions = false }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const confirmOrderMutation = useConfirmOrder();
    const rejectOrderMutation = useRejectOrder();

    const getStatusColor = (status: string) => {
      return (
        ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] ||
        colors.onSurfaceVariant
      );
    };

    const handleConfirm = async () => {
      try {
        await confirmOrderMutation.mutateAsync(item.id);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Error confirming order:', error);
      }
    };

    const handleReject = async () => {
      try {
        await rejectOrderMutation.mutateAsync(item.id);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Error rejecting order:', error);
      }
    };

    const totalItems = item.items.reduce((sum, orderItem) => sum + orderItem.quantity, 0);

    return (
      <Card
        style={{
          backgroundColor: colors.surface,
          marginBottom: 12,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: getStatusColor(item.status),
          elevation: 1,
        }}
        onPress={() => onPress(item.id)}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Body style={{ fontSize: 16, fontWeight: '600', color: colors.onSurface }}>
              {getCustomerName(item)}
            </Body>
            <Caption style={{ marginTop: 2, color: colors.onSurfaceVariant }}>
              Order #{item.id.slice(0, 8)}
            </Caption>
          </View>

          <View
            style={{
              backgroundColor: getStatusColor(item.status),
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Caption style={{ color: 'white', fontWeight: '700', fontSize: 11 }}>
              {t(item.status).toUpperCase()}
            </Caption>
          </View>
        </View>

        {/* Details */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon name="food" size={18} color={colors.onSurfaceVariant} />
            <Body style={{ marginLeft: 6, color: colors.onSurfaceVariant }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Body>
          </View>

          <Body style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>
            {formatOrderTotal(item.total)}
          </Body>
        </View>

        {/* Action Buttons */}
        {showActions && item.status === 'pending' && (
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.errorContainer,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={handleReject}
              disabled={rejectOrderMutation.isPending}
            >
              <Label style={{ color: colors.onErrorContainer, fontWeight: '600' }}>
                {t('reject')}
              </Label>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#4CAF50',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={handleConfirm}
              disabled={confirmOrderMutation.isPending}
            >
              <Label style={{ color: 'white', fontWeight: '600' }}>
                {t('accept')}
              </Label>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    );
  },
);

OrderCard.displayName = 'OrderCard';

interface OrderTabProps {
  status: string;
  showActions?: boolean;
}

const OrderTab: React.FC<OrderTabProps> = ({ status, showActions = false }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const tabBarHeight = useFloatingTabBarHeight();

  const { data: ordersData, isLoading, refetch, error } = useGetOrders({ status });

  const orders = Array.isArray(ordersData) ? ordersData : [];
  const sortedOrders = sortOrdersByPriority(orders);

  const filteredOrders = sortedOrders.filter((order) => {
    const customerName = getCustomerName(order);
    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery);
    return matchesSearch;
  });

  const handleOrderPress = (orderId: string) => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantOrderDetails', { orderId });
  };

  const onRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refetch();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Error Banner */}
      {error && (
        <View style={{ padding: 12, backgroundColor: colors.errorContainer }}>
          <Body style={{ color: colors.onErrorContainer, textAlign: 'center' }}>
            {t('error_loading_orders')}
          </Body>
        </View>
      )}

      {/* Search Bar */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <TextInput
          placeholder={t('search_orders')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
          mode="outlined"
          dense
          style={{ backgroundColor: colors.surface }}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => (
          <OrderCard item={item} onPress={handleOrderPress} showActions={showActions} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 8,
          paddingBottom: tabBarHeight + 16,
        }}
        refreshing={isLoading}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <MaterialCommunityIcon
              name={isLoading ? 'loading' : 'clipboard-text-outline'}
              size={64}
              color={colors.onSurfaceVariant}
            />
            <Label style={{ marginTop: 16, color: colors.onSurfaceVariant }}>
              {isLoading
                ? t('loading_orders')
                : searchQuery
                  ? t('no_orders_match_search')
                  : t('no_orders_found')}
            </Label>
          </View>
        }
      />
    </View>
  );
};

const OrdersList: React.FC<RestaurantOrdersStackScreenProps<'OrdersList'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: pendingOrdersData } = useGetOrders({ status: 'pending' });
  const pendingOrdersCount = Array.isArray(pendingOrdersData) ? pendingOrdersData.length : 0;
  const { unreadCount: notificationCount } = useUnreadNotificationCount();

  const handleNotificationPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantNotifications');
  };

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            padding: 16,
            paddingBottom: 12,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Heading1 style={{ color: colors.onSurface, fontWeight: '700' }}>
                {t('orders')}
              </Heading1>
              <Body style={{ marginTop: 4, color: colors.onSurfaceVariant }}>
                {t('manage_your_orders')}
              </Body>
            </View>

            {/* Notification Button */}
            <TouchableOpacity
              onPress={handleNotificationPress}
              style={{
                backgroundColor: colors.surfaceVariant,
                padding: 10,
                borderRadius: 10,
                position: 'relative',
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcon name="bell-outline" size={24} color={colors.onSurface} />
              {notificationCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: colors.error,
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Caption style={{ color: 'white', fontWeight: '700', fontSize: 10 }}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Caption>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.onSurfaceVariant,
            tabBarIndicatorStyle: {
              backgroundColor: colors.primary,
              height: 3,
            },
            tabBarStyle: {
              backgroundColor: colors.surface,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarScrollEnabled: true,
            tabBarLabelStyle: { fontSize: 13, fontWeight: '600', textTransform: 'none' },
          }}
        >
          <Tab.Screen
            name="Pending"
            options={{
              tabBarLabel: ({ color }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Body style={{ color, fontWeight: '600' }}>{t('pending')}</Body>
                  {pendingOrdersCount > 0 && (
                    <View
                      style={{
                        backgroundColor: colors.error,
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 6,
                        paddingHorizontal: 6,
                      }}
                    >
                      <Caption style={{ color: 'white', fontWeight: '700', fontSize: 11 }}>
                        {pendingOrdersCount}
                      </Caption>
                    </View>
                  )}
                </View>
              ),
            }}
          >
            {() => <OrderTab status="pending" showActions={true} />}
          </Tab.Screen>
          <Tab.Screen name="Confirmed" options={{ tabBarLabel: t('confirmed') }}>
            {() => <OrderTab status="confirmed" />}
          </Tab.Screen>
          <Tab.Screen name="Preparing" options={{ tabBarLabel: t('preparing') }}>
            {() => <OrderTab status="preparing" />}
          </Tab.Screen>
          <Tab.Screen name="ReadyForPickup" options={{ tabBarLabel: t('ready_for_pickup') }}>
            {() => <OrderTab status="ready_for_pickup" />}
          </Tab.Screen>
          <Tab.Screen name="OutForDelivery" options={{ tabBarLabel: t('out_for_delivery') }}>
            {() => <OrderTab status="out_for_delivery" />}
          </Tab.Screen>
          <Tab.Screen name="Delivered" options={{ tabBarLabel: t('delivered') }}>
            {() => <OrderTab status="delivered" />}
          </Tab.Screen>
          <Tab.Screen name="Cancelled" options={{ tabBarLabel: t('cancelled') }}>
            {() => <OrderTab status="cancelled" />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </CommonView>
  );
};

export default OrdersList;