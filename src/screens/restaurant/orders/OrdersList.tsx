import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, ScrollView, Easing, Dimensions } from 'react-native';
import { Chip, Badge, useTheme, TextInput, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantOrdersStackScreenProps } from '@/src/navigation/types';
import { useGetOrders, useConfirmOrder, useRejectOrder } from '@/src/hooks/restaurant/useOrderApi';
import { Order } from '@/src/services/restaurant/orderApi';
import RestaurantAvailabilityToggle from '@/src/components/restaurant/RestaurantAvailabilityToggle';

const Tab = createMaterialTopTabNavigator();

// Constants
const ORDER_STATUSES = {
  NEW: 'new',
  PREPARING: 'preparing', 
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
} as const;

const STATUS_COLORS = {
  new: '#007aff',
  preparing: '#FF8800',
  ready: '#00C851',
  completed: '#8B5CF6',
  canceled: '#FF4444',
  default: '#6B7280'
};

interface OrderCardProps {
  item: Order;
  index: number;
  onPress: (orderId: string) => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ item, index, onPress, showActions = false }) => {
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

  const getStatusColor = (status: string) => STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;

  const handleConfirm = async () => {
    try {
      await confirmOrderMutation.mutateAsync(item.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to confirm order:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrderMutation.mutateAsync(item.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to reject order:', error);
    }
  };

  const getTimeSinceOrder = () => {
    const orderTime = new Date(item.createdAt || item.time);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  const isOverdue = () => {
    if (item.status !== 'new') return false;
    const orderTime = new Date(item.createdAt || item.time);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
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
          borderLeftColor: isOverdue() ? '#FF4444' : getStatusColor(item.status),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={() => onPress(item.id)}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: isSmallScreen ? 16 : 18,
                fontWeight: 'bold',
                color: colors.onSurface,
              }}
            >
              #{item.id}
            </Text>
            {item.status === 'new' && (
              <Badge
                style={{
                  backgroundColor: '#007aff',
                  marginLeft: 8,
                }}
                size={20}
              >
                NEW
              </Badge>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={isOverdue() ? '#FF4444' : colors.onSurfaceVariant}
            />
            <Text
              style={{
                fontSize: 12,
                color: isOverdue() ? '#FF4444' : colors.onSurfaceVariant,
                marginLeft: 4,
                fontWeight: isOverdue() ? 'bold' : 'normal',
              }}
            >
              {getTimeSinceOrder()}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: colors.onSurface,
            }}
          >
            {item.customerName}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#007aff',
            }}
          >
            {item.total.toLocaleString()} XAF
          </Text>
        </View>

        {/* Items */}
        <Text
          style={{
            fontSize: 13,
            color: colors.onSurfaceVariant,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
        </Text>

        {/* Actions for New Orders */}
        {showActions && item.status === 'new' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#FF4444',
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 8,
                flex: 0.45,
              }}
              onPress={handleReject}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {t('reject')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#007aff',
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 8,
                flex: 0.45,
              }}
              onPress={handleConfirm}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {t('accept')}
              </Text>
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

  const { data: ordersData, isLoading, refetch } = useGetOrders({
    status: status === 'all' ? undefined : status,
  });

  const orders = ordersData?.orders || [];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          style={{ backgroundColor: colors.surface }}
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
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        refreshing={isLoading}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={48}
              color={colors.onSurfaceVariant}
            />
            <Text style={{ color: colors.onSurfaceVariant, marginTop: 8, fontSize: 16 }}>
              {t('no_orders_found')}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const OrdersList: React.FC<RestaurantOrdersStackScreenProps<'OrdersList'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data: newOrdersData } = useGetOrders({ status: 'new' });
  const newOrdersCount = newOrdersData?.orders?.length || 0;

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.onBackground }}>
                {t('orders')}
              </Text>
              <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 }}>
                {t('manage_your_orders')}
              </Text>
            </View>
            {newOrdersCount > 0 && (
              <View
                style={{
                  backgroundColor: '#007aff',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="bell" size={16} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 4 }}>
                  {newOrdersCount} {t('new')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Restaurant Availability Toggle */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <RestaurantAvailabilityToggle
            showAsCard={false}
            compact={true}
          />
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
            name="New"
            options={{
              tabBarLabel: `${t('new')} ${newOrdersCount > 0 ? `(${newOrdersCount})` : ''}`,
            }}
          >
            {() => <OrderTab status="new" showActions={true} />}
          </Tab.Screen>
          <Tab.Screen
            name="Preparing"
            options={{ tabBarLabel: t('preparing') }}
          >
            {() => <OrderTab status="preparing" />}
          </Tab.Screen>
          <Tab.Screen
            name="Ready"
            options={{ tabBarLabel: t('ready') }}
          >
            {() => <OrderTab status="ready" />}
          </Tab.Screen>
          <Tab.Screen
            name="Completed"
            options={{ tabBarLabel: t('completed') }}
          >
            {() => <OrderTab status="completed" />}
          </Tab.Screen>
          <Tab.Screen
            name="Canceled"
            options={{ tabBarLabel: t('canceled') }}
          >
            {() => <OrderTab status="canceled" />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </CommonView>
  );
};

export default OrdersList;