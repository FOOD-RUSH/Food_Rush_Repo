import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Badge, useTheme, TextInput } from 'react-native-paper';

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
  LabelLarge,
  Caption,
} from '@/src/components/common/Typography';

const Tab = createMaterialTopTabNavigator();

// Constants - Updated to match backend order statuses
const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

const getStatusColors = (colors: any) => ({
  pending: colors.primary,
  confirmed: '#4CAF50',
  preparing: colors.warning || '#FF8800',
  ready_for_pickup: colors.success || '#00C851',
  out_for_delivery: '#2196F3',
  delivered: '#8B5CF6',
  cancelled: colors.error,
  default: colors.onSurfaceVariant,
});

interface OrderCardProps {
  item: Order;
  index: number;
  onPress: (orderId: string) => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  item,
  index,
  onPress,
  showActions = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateXAnim = useRef(new Animated.Value(50)).current;
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isLargeScreen = screenWidth > 414;

  const confirmOrderMutation = useConfirmOrder();
  const rejectOrderMutation = useRejectOrder();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(translateXAnim, {
        toValue: 0,
        delay: index * 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, scaleAnim, translateXAnim]);

  const getStatusColor = (status: string) => {
    const statusColors = getStatusColors(colors);
    return (
      statusColors[status as keyof typeof statusColors] || statusColors.default
    );
  };

  const handleConfirm = async () => {
    try {
      await confirmOrderMutation.mutateAsync(item.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Error handling is managed by the mutation hook
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrderMutation.mutateAsync(item.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Error handling is managed by the mutation hook
    }
  };

  const getTimeSinceOrder = () => {
    const orderTime = new Date(item.createdAt || item.time);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  const isOverdue = () => {
    if (item.status !== 'pending') return false;
    const orderTime = new Date(item.createdAt || item.time);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60),
    );
    return diffInMinutes > 5; // Consider overdue after 5 minutes
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          marginBottom: 12,
          marginHorizontal: 4,
          padding: isSmallScreen ? 12 : 16,
          borderLeftWidth: 4,
          borderLeftColor: isOverdue()
            ? colors.error
            : getStatusColor(item.status),
          shadowColor: colors.shadow || '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={() => onPress(item.id)}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LabelLarge color={colors.onSurface} weight="bold">
              {t('order_hash')}
              {item.id}
            </LabelLarge>
            {item.status === 'pending' && (
              <Badge
                style={{
                  backgroundColor: colors.primary,
                  marginLeft: 8,
                }}
                size={20}
              >
                {t('pending').toUpperCase()}
              </Badge>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon               name="clock-outline"
              size={16}
              color={isOverdue() ? colors.error : colors.onSurfaceVariant}
            />
            <Caption
              color={isOverdue() ? colors.error : colors.onSurfaceVariant}
              weight={isOverdue() ? 'bold' : 'regular'}
              style={{ marginLeft: 4 }}
            >
              {getTimeSinceOrder()}
            </Caption>
          </View>
        </View>

        {/* Customer Info */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Label color={colors.onSurface} weight="semibold">
            {item.customerName}
          </Label>
          <Label color={colors.primary} weight="bold">
            {item.total.toLocaleString()} XAF
          </Label>
        </View>

        {/* Items */}
        <Body
          color={colors.onSurfaceVariant}
          numberOfLines={2}
          style={{ marginBottom: 8 }}
        >
          {item.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
        </Body>

        {/* Actions for Pending Orders */}
        {showActions && item.status === 'pending' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.error,
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 8,
                flex: 0.45,
              }}
              onPress={handleReject}
            >
              <Label color="white" weight="bold" align="center">
                {t('reject')}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 8,
                flex: 0.45,
              }}
              onPress={handleConfirm}
            >
              <Label color="white" weight="bold" align="center">
                {t('accept')}
              </Label>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

interface OrderTabProps {
  status: string;
  showActions?: boolean;
}

const OrderTab: React.FC<OrderTabProps> = ({ status, showActions = false }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useGetOrders({
    status: status === 'all' ? undefined : status,
  });

  const orders = ordersData?.orders || [];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      {/* Search Bar */}
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder={t('search_orders')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
          mode="outlined"
          style={{ backgroundColor: colors.surface, borderRadius: 16 }}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item, index }) => (
          <OrderCard
            item={item}
            index={index}
            onPress={handleOrderPress}
            showActions={showActions}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        refreshing={isLoading}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 40,
            }}
          >
            <MaterialCommunityIcon               name="clipboard-list-outline"
              size={48}
              color={colors.onSurfaceVariant}
            />
            <Label color={colors.onSurfaceVariant} style={{ marginTop: 8 }}>
              {t('no_orders_found')}
            </Label>
          </View>
        }
      />
    </View>
  );
};

const OrdersList: React.FC<
  RestaurantOrdersStackScreenProps<'OrdersList'>
> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: pendingOrdersData } = useGetOrders({ status: 'pending' });
  const pendingOrdersCount = pendingOrdersData?.orders?.length || 0;

  const handleNotificationPress = () => {
    Haptics.selectionAsync();
    navigation.navigate('RestaurantNotifications');
  };

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Heading1 color={colors.onBackground} weight="bold">
                {t('orders')}
              </Heading1>
              <Body color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
                {t('manage_your_orders')}
              </Body>
            </View>

            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              {pendingOrdersCount > 0 && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcon name="bell" size={16} color="white" />
                  <Caption
                    color="white"
                    weight="bold"
                    style={{ marginLeft: 4 }}
                  >
                    {pendingOrdersCount} {t('pending')}
                  </Caption>
                </View>
              )}

              {/* Notification Icon Button */}
              <TouchableOpacity
                onPress={handleNotificationPress}
                style={{
                  backgroundColor: colors.surface,
                  padding: 12,
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcon                   name="bell-outline"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007aff',
            tabBarInactiveTintColor: colors.onSurfaceVariant,
            tabBarIndicatorStyle: { backgroundColor: '#007aff', height: 3 },
            tabBarStyle: { backgroundColor: colors.surface },
            tabBarScrollEnabled: true,
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          }}
        >
          <Tab.Screen
            name="Pending"
            options={{
              tabBarLabel: `${t('pending')} ${pendingOrdersCount > 0 ? `(${pendingOrdersCount})` : ''}`,
            }}
          >
            {() => <OrderTab status="pending" showActions={true} />}
          </Tab.Screen>
          <Tab.Screen
            name="Confirmed"
            options={{ tabBarLabel: t('confirmed') }}
          >
            {() => <OrderTab status="confirmed" />}
          </Tab.Screen>
          <Tab.Screen
            name="Preparing"
            options={{ tabBarLabel: t('preparing') }}
          >
            {() => <OrderTab status="preparing" />}
          </Tab.Screen>
          <Tab.Screen
            name="ReadyForPickup"
            options={{ tabBarLabel: t('ready_for_pickup') }}
          >
            {() => <OrderTab status="ready_for_pickup" />}
          </Tab.Screen>
          <Tab.Screen
            name="OutForDelivery"
            options={{ tabBarLabel: t('out_for_delivery') }}
          >
            {() => <OrderTab status="out_for_delivery" />}
          </Tab.Screen>
          <Tab.Screen
            name="Delivered"
            options={{ tabBarLabel: t('delivered') }}
          >
            {() => <OrderTab status="delivered" />}
          </Tab.Screen>
          <Tab.Screen
            name="Cancelled"
            options={{ tabBarLabel: t('cancelled') }}
          >
            {() => <OrderTab status="cancelled" />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </CommonView>
  );
};

export default OrdersList;
