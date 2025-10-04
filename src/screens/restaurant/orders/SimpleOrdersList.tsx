import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme, ActivityIndicator, Chip } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import {
  useGetOrders,
  useConfirmOrder,
  useRejectOrder,
} from '@/src/hooks/restaurant/useOrderApi';
import CommonView from '@/src/components/common/CommonView';

type OrderStatus = 'all' | 'pending' | 'preparing' | 'ready' | 'completed';

// Order status configuration
const ORDER_STATUS = {
  pending: { color: '#3B82F6', label: 'New', icon: 'clock-outline' },
  confirmed: {
    color: '#F59E0B',
    label: 'Confirmed',
    icon: 'check-circle-outline',
  },
  preparing: { color: '#F59E0B', label: 'Preparing', icon: 'chef-hat' },
  ready_for_pickup: { color: '#10B981', label: 'Ready', icon: 'check-circle' },
  delivered: { color: '#6B7280', label: 'Delivered', icon: 'truck-delivery' },
  cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'close-circle' },
} as const;

interface OrderCardProps {
  order: any;
  onPress: (orderId: string) => void;
  onConfirm: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onConfirm,
  onReject,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const statusConfig = ORDER_STATUS[order.status] || ORDER_STATUS.pending;

  // Calculate total items in order
  const totalItems =
    order.items?.reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => onPress(order.id)}
    >
      {/* Order Header */}
      <View style={styles.cardHeader}>
        <Text style={[styles.orderNumber, { fontSize: 16, fontWeight: '600' }]}>
          {order.customer?.fullName || 'Customer'}
        </Text>
        <View
          style={{
            backgroundColor: statusConfig.color,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.detailsContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcon
            name="food"
            size={14}
            color={colors.onSurfaceVariant}
          />
          <Text style={[styles.timeText, { marginLeft: 6, fontSize: 14 }]}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <Text style={[styles.amountText, { fontSize: 16, fontWeight: 'bold' }]}>
          ${order.total}
        </Text>
      </View>

      {/* Action Buttons for Pending Orders */}
      {order.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.rejectButton, { backgroundColor: colors.error }]}
            onPress={() => onReject(order.id)}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => onConfirm(order.id)}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const SimpleOrdersList: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  const { data: ordersData, isLoading, refetch } = useGetOrders();
  const confirmOrder = useConfirmOrder();
  const rejectOrder = useRejectOrder();

  const filteredOrders = useMemo(() => {
    const orders = ordersData?.orders || [];

    if (activeTab === 'all') return orders;

    return orders.filter((order) => {
      switch (activeTab) {
        case 'pending':
          return order.status === 'pending';
        case 'preparing':
          return order.status === 'preparing' || order.status === 'confirmed';
        case 'ready':
          return order.status === 'ready_for_pickup';
        case 'completed':
          return ['delivered', 'cancelled'].includes(order.status);
        default:
          return true;
      }
    });
  }, [ordersData, activeTab]);

  const orderCounts = useMemo(() => {
    const orders = ordersData?.orders || [];
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      preparing: orders.filter((o) =>
        ['preparing', 'confirmed'].includes(o.status),
      ).length,
      ready: orders.filter((o) => o.status === 'ready_for_pickup').length,
      completed: orders.filter((o) =>
        ['delivered', 'cancelled'].includes(o.status),
      ).length,
    };
  }, [ordersData]);

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await confirmOrder.mutateAsync(orderId);
    } catch (error) {
      console.error('Failed to confirm order:', error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrder.mutateAsync({ orderId });
    } catch (error) {
      console.error('Failed to reject order:', error);
    }
  };

  const renderStatusChip = (status: OrderStatus, label: string) => (
    <Chip
      key={status}
      mode="outlined"
      selected={activeTab === status}
      onPress={() => setActiveTab(status)}
      style={[
        styles.chip,
        activeTab === status && { backgroundColor: colors.primaryContainer },
      ]}
      textStyle={{
        color: activeTab === status ? colors.primary : colors.onSurface,
      }}
    >
      {label} ({orderCounts[status]})
    </Chip>
  );

  if (isLoading && !ordersData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CommonView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
            {t('orders') || 'Orders'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcon
              name="bell-outline"
              size={24}
              color={colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Status Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {renderStatusChip('all', 'All')}
          {renderStatusChip('pending', 'New')}
          {renderStatusChip('preparing', 'Preparing')}
          {renderStatusChip('ready', 'Ready')}
          {renderStatusChip('completed', 'Completed')}
        </ScrollView>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={handleOrderPress}
              onConfirm={handleConfirmOrder}
              onReject={handleRejectOrder}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcon
                name="clipboard-text-outline"
                size={48}
                color={colors.onSurfaceDisabled}
              />
              <Text
                style={[styles.emptyText, { color: colors.onSurfaceDisabled }]}
              >
                {t('no_orders_found') || 'No orders found'}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 16,
    height: 50,
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  rejectButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  acceptButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default SimpleOrdersList;
