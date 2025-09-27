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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffMinutes = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60),
    );

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const hours = Math.floor(diffMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => onPress(order.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
        <View style={styles.statusContainer}>
          <MaterialCommunityIcon             name={statusConfig.icon}
            color={statusConfig.color}
            size={16}
          />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <Text style={[styles.timeText, { color: colors.onSurfaceVariant }]}>
        {order.items?.length} items • {getTimeAgo(order.createdAt)}
      </Text>

      <Text style={[styles.amountText, { color: colors.primary }]}>
        ${(order.total / 100).toFixed(2)}
      </Text>

      {order.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.rejectButton, { backgroundColor: colors.error }]}
            onPress={() => onReject(order.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: colors.primary }]}
            onPress={() => onConfirm(order.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
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
            <MaterialCommunityIcon               name="bell-outline"
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
              <MaterialCommunityIcon                 name="clipboard-text-outline"
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  rejectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  acceptButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
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
