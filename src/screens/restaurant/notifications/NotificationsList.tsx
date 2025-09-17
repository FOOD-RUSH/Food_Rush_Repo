import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme, Card, Badge, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'promotion' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string;
  priority: 'low' | 'medium' | 'high';
}

const NotificationsList: React.FC<RootStackScreenProps<'RestaurantNotifications'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'order' | 'system' | 'unread'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: t('new_order_received'),
      message: 'Order #12345 from John Doe - 2x Jollof Rice, 1x Grilled Chicken',
      timestamp: '2 minutes ago',
      isRead: false,
      orderId: '12345',
      priority: 'high',
    },
    {
      id: '2',
      type: 'order',
      title: t('order_cancelled'),
      message: 'Order #12344 has been cancelled by the customer',
      timestamp: '15 minutes ago',
      isRead: false,
      orderId: '12344',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'system',
      title: t('menu_item_low_stock'),
      message: 'Grilled Chicken is running low. Only 3 portions left.',
      timestamp: '1 hour ago',
      isRead: true,
      priority: 'medium',
    },
    {
      id: '4',
      type: 'promotion',
      title: t('weekend_promotion'),
      message: 'Weekend special: 20% off on all main courses. Promote to your customers!',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'low',
    },
    {
      id: '5',
      type: 'alert',
      title: t('payment_received'),
      message: 'Payment of 25,000 XAF received for Order #12340',
      timestamp: '5 hours ago',
      isRead: true,
      priority: 'low',
    },
    {
      id: '6',
      type: 'system',
      title: t('app_update_available'),
      message: 'New app version available with improved order management features',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low',
    },
  ]);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconMap = {
      order: 'receipt',
      system: 'cog',
      promotion: 'tag',
      alert: 'alert-circle',
    };
    return iconMap[type as keyof typeof iconMap] || 'bell';
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return '#FF4444';
    if (priority === 'medium') return '#FF8800';
    
    const colorMap = {
      order: '#007aff',
      system: '#6B7280',
      promotion: '#00C851',
      alert: '#FF8800',
    };
    return colorMap[type as keyof typeof colorMap] || '#6B7280';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8800';
      default: return '#6B7280';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationPress = (notification: Notification) => {
    Haptics.selectionAsync();
    
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate based on notification type
    if (notification.type === 'order' && notification.orderId) {
      // Navigate to order details
        navigation.navigate('RestaurantOrderDetails', { orderId: notification.orderId! });
    } else {
      // Navigate to notification details
        navigation.navigate('RestaurantNotificationDetails', {
          notificationId: notification.id,
        });
    }
  };

  const markAllAsRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Card
      style={{
        marginBottom: 8,
        backgroundColor: item.isRead ? colors.surface : '#007aff10',
        borderLeftWidth: 4,
        borderLeftColor: getNotificationColor(item.type, item.priority),
      }}
    >
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={{ padding: 16 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <MaterialCommunityIcons
              name={getNotificationIcon(item.type, item.priority) as any}
              size={24}
              color={getNotificationColor(item.type, item.priority)}
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: item.isRead ? '500' : 'bold',
                    color: colors.onSurface,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {!item.isRead && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#007aff',
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                  marginBottom: 8,
                  lineHeight: 20,
                }}
                numberOfLines={2}
              >
                {item.message}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                  {item.timestamp}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Chip
                    style={{
                      backgroundColor: getNotificationColor(item.type, item.priority) + '20',
                      height: 24,
                    }}
                    textStyle={{
                      fontSize: 10,
                      color: getNotificationColor(item.type, item.priority),
                    }}
                    compact
                  >
                    {t(item.type)}
                  </Chip>
                  {item.priority === 'high' && (
                    <MaterialCommunityIcons
                      name="exclamation"
                      size={16}
                      color="#FF4444"
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const filters = [
    { key: 'all', label: t('all'), count: notifications.length },
    { key: 'unread', label: t('unread'), count: unreadCount },
    { key: 'order', label: t('orders'), count: notifications.filter(n => n.type === 'order').length },
    { key: 'system', label: t('system'), count: notifications.filter(n => n.type === 'system').length },
  ];

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Removed custom header - using navigator header instead */}
        {/* Mark all as read button moved to header right */}
        {unreadCount > 0 && (
          <View style={{ padding: 16, paddingBottom: 0 }}>
            <TouchableOpacity
              onPress={markAllAsRead}
              style={{
                backgroundColor: '#007aff',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                alignSelf: 'flex-end',
              }}
            >
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                {t('mark_all_read')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filters */}
        <View style={{ padding: 16, paddingTop: 12 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedFilter(item.key as any);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: selectedFilter === item.key ? '#007aff' : colors.surfaceVariant,
                  borderRadius: 20,
                  marginRight: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    color: selectedFilter === item.key ? 'white' : colors.onSurfaceVariant,
                  }}
                >
                  {item.label}
                </Text>
                {item.count > 0 && (
                  <Badge
                    style={{
                      backgroundColor: selectedFilter === item.key ? 'white' : '#007aff',
                      marginLeft: 6,
                    }}
                    size={18}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: selectedFilter === item.key ? '#007aff' : 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.count}
                    </Text>
                  </Badge>
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007aff']}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={48}
                color={colors.onSurfaceVariant}
              />
              <Text style={{ color: colors.onSurfaceVariant, marginTop: 8, fontSize: 16 }}>
                {selectedFilter === 'unread' ? t('no_unread_notifications') : t('no_notifications')}
              </Text>
            </View>
          }
        />
      </View>
    </CommonView>
  );
};

export default NotificationsList;