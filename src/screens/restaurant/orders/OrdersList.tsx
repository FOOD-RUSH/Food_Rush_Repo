import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Badge, useTheme, TextInput, Card } from 'react-native-paper';

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
import {
  getCustomerName,
  getTimeSinceOrder,
  isOrderOverdue,
  formatOrderTotal,
  getOrderItemsSummary,
  sortOrdersByPriority,
  createOrderSummary,
  ORDER_STATUS_COLORS,
} from '@/src/utils/orderUtils';
import { useUnreadNotificationCount } from '@/src/hooks/useNotifications';

const Tab = createMaterialTopTabNavigator();

// Note: ORDER_STATUSES and getStatusColors are now imported from orderUtils
// Keeping these constants for backward compatibility if needed

interface OrderCardProps {
  item: Order;
  index: number;
  onPress: (orderId: string) => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = React.memo(
  ({ item, index, onPress, showActions = false }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const translateXAnim = useRef(new Animated.Value(50)).current;
    const { width: screenWidth } = Dimensions.get('window');
    const isSmallScreen = screenWidth < 375;

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

    // Calculate total items in order
    const totalItems = item.items.reduce((sum, orderItem) => sum + orderItem.quantity, 0);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
        }}
      >
        <Card
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            marginBottom: 12,

            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: getStatusColor(item.status),
            shadowColor: colors.shadow || '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={() => onPress(item.id)}
        >
          {/* Order Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Body 
                color={colors.onSurface} 
                weight="semibold"
                style={{ fontSize: 16 }}
              >
                {getCustomerName(item)}
              </Body>
            </View>
            
            <View 
              style={{ 
                backgroundColor: getStatusColor(item.status),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Caption color="white" weight="bold" style={{ fontSize: 10, textTransform: 'uppercase' }}>
                {t(item.status)}
              </Caption>
            </View>
          </View>

          {/* Order Details */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcon 
                name="food" 
                size={16} 
                color={colors.onSurfaceVariant} 
              />
              <Body 
                color={colors.onSurfaceVariant} 
                style={{ marginLeft: 6, fontSize: 14 }}
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Body>
            </View>
            
            <Body 
              color={colors.primary} 
              weight="bold"
              style={{ fontSize: 16 }}
            >
              {formatOrderTotal(item.total)}
            </Body>
          </View>

          {/* Action Buttons for Pending Orders */}
          {showActions && item.status === 'pending' && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.error,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flex: 0.48,
                }}
                onPress={handleReject}
              >
                <Label color="white" weight="bold" align="center">
                  {t('reject')}
                </Label>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#4CAF50',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flex: 0.48,
                }}
                onPress={handleConfirm}
              >
                <Label color="white" weight="bold" align="center">
                  {t('accept')}
                </Label>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      </Animated.View>
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

  const {
    data: ordersData,
    isLoading,
    refetch,
    error,
  } = useGetOrders({
    status: status,
  });

  // Handle the data structure - ordersData is directly an array from the API
  const orders = Array.isArray(ordersData) ? ordersData : [];

  // Sort orders by priority (pending first, then by time)
  const sortedOrders = sortOrdersByPriority(orders);

  // Create order summary for logging
  const orderSummary = createOrderSummary(sortedOrders);

  // Log the orders data for debugging
  console.log(`📊 [OrderTab] ${status} orders:`, {
    ordersData,
    ordersCount: sortedOrders.length,
    isLoading,
    error,
    summary: orderSummary,
  });

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
    console.log(`🔄 [OrderTab] Refreshing ${status} orders`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refetch();
  };

  // Show error state if there's an error
  if (error) {
    console.error(`❌ [OrderTab] Error loading ${status} orders:`, error);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Error State */}
      {error && (
        <View style={{ padding: 16, backgroundColor: colors.errorContainer }}>
          <Body color={colors.onErrorContainer} align="center">
            {t('error_loading_orders')}: {error.message}
          </Body>
        </View>
      )}

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
        keyExtractor={(item) => `order-${item.id}`}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={{ padding: 4, paddingTop: 0 }}
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
            <MaterialCommunityIcon
              name={isLoading ? 'loading' : 'clipboard-list-outline'}
              size={48}
              color={colors.onSurfaceVariant}
            />
            <Label color={colors.onSurfaceVariant} style={{ marginTop: 8 }}>
              {isLoading
                ? t('loading_orders')
                : error
                  ? t('error_loading_orders')
                  : searchQuery
                    ? t('no_orders_match_search')
                    : t('no_orders_found')}
            </Label>
            {error && (
              <Caption
                color={colors.error}
                style={{ marginTop: 4, textAlign: 'center' }}
              >
                {error.message}
              </Caption>
            )}
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
  const pendingOrdersCount = Array.isArray(pendingOrdersData)
    ? pendingOrdersData.length
    : 0;
    
  const { unreadCount: notificationCount } = useUnreadNotificationCount();

  console.log('📊 [OrdersList] Pending orders count:', pendingOrdersCount);

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
              {/* Notification Icon Button with Badge */}
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
                  position: 'relative', // For positioning the badge
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcon
                  name="bell-outline"
                  size={24}
                  color={colors.onSurface}
                />
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
                      borderWidth: 1,
                      borderColor: colors.surface,
                    }}
                  >
                    <Caption
                      color="white"
                      weight="bold"
                      style={{ fontSize: 11 }}
                    >
                      {notificationCount}
                    </Caption>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.onSurfaceVariant,
            tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 3 },
            tabBarStyle: { backgroundColor: colors.surface, paddingTop: 8 },
            tabBarScrollEnabled: true,
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          }}
        >
          <Tab.Screen
            name="Pending"
            options={{
              tabBarLabel: ({ color }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Body color={color} weight="medium">
                    {t('pending')}
                  </Body>
                  {pendingOrdersCount > 0 && (
                    <View
                      style={{
                        backgroundColor: colors.error,
                        borderRadius: 8,
                        minWidth: 16,
                        height: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 4,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Caption color="white" weight="bold" style={{ fontSize: 10 }}>
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
