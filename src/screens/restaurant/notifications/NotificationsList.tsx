import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTheme, Card, Badge, Chip, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Typography, Heading5, Body, Label, Caption, Overline } from '@/src/components/common/Typography';
import { useNotifications } from '@/src/hooks/shared/useNotifications';
import type { Notification } from '@/src/types';

// Notification interface is now imported from types

const NotificationsList: React.FC<RootStackScreenProps<'RestaurantNotifications'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  // Use the shared notifications hook (works for both customer and restaurant)
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    selectedFilter,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setFilter,
    clearError,
    notificationCounts,
  } = useNotifications();
  
  const [refreshing, setRefreshing] = useState(false);

  // Handle errors
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error,
        position: 'top',
      });
      clearError();
    }
  }, [error, clearError, t]);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconMap = {
      order: 'receipt',
      system: 'cog',
      promotion: 'tag',
      alert: 'alert-circle',
    };
    return iconMap[type as keyof typeof iconMap] || 'bell';
  };

  const getNotificationColor = (notification: Notification) => {
    if (notification.priority === 'high') return '#FF4444';
    if (notification.priority === 'medium') return '#FF8800';
    
    const colorMap = {
      order: '#007aff',
      system: '#6B7280',
      promotion: '#00C851',
      alert: '#FF8800',
    };
    return colorMap[notification.type as keyof typeof colorMap] || '#6B7280';
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return t('just_now');
      if (diffInMinutes < 60) return `${diffInMinutes} ${t('minutes_ago')}`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t('hours_ago')}`;
      return `${Math.floor(diffInMinutes / 1440)} ${t('days_ago')}`;
    } catch {
      return timestamp;
    }
  };

  // Notifications are already filtered by the hook

  const handleNotificationPress = async (notification: Notification) => {
    Haptics.selectionAsync();
    
    // Mark as read if not already read
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === 'order' && notification.data?.orderId) {
      // Navigate to order details
      navigation.navigate('RestaurantOrderDetails', { orderId: notification.data.orderId });
    } else {
      // Show notification details in alert for now
      Alert.alert(
        notification.title,
        notification.body,
        [{ text: t('ok'), style: 'default' }]
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const success = await markAllAsRead();
    if (success) {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('all_notifications_marked_read'),
        position: 'top',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };
  
  const handleLoadMore = () => {
    if (hasNextPage && !isLoadingMore) {
      loadMore();
    }
  };
  
  const handleDeleteNotification = (notification: Notification) => {
    Alert.alert(
      t('delete_notification'),
      t('are_you_sure_delete_notification'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteNotification(notification.id);
            if (success) {
              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('notification_deleted'),
                position: 'top',
              });
            }
          },
        },
      ]
    );
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Card
      style={{
        marginBottom: 8,
        backgroundColor: item.readAt ? colors.surface : '#007aff10',
        borderLeftWidth: 4,
        borderLeftColor: getNotificationColor(item),
      }}
    >
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        onLongPress={() => handleDeleteNotification(item)}
        style={{ padding: 16 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <MaterialCommunityIcons
              name={getNotificationIcon(item.type, item.priority || 'low') as any}
              size={24}
              color={getNotificationColor(item)}
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Label
                  color={colors.onSurface}
                  weight={item.readAt ? 'medium' : 'bold'}
                  numberOfLines={1}
                  style={{ flex: 1 }}
                >
                  {item.title}
                </Label>
                {!item.readAt && (
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
              <Body
                color={colors.onSurfaceVariant}
                numberOfLines={2}
                style={{
                  marginBottom: 8,
                  lineHeight: 20,
                }}
              >
                {item.body}
              </Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Caption color={colors.onSurfaceVariant}>
                  {formatTimestamp(item.createdAt)}
                </Caption>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Chip
                    style={{
                      backgroundColor: getNotificationColor(item) + '20',
                      height: 24,
                    }}
                    textStyle={{
                      fontSize: 10,
                      color: getNotificationColor(item),
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
    { key: 'all', label: t('all'), count: notificationCounts.all },
    { key: 'unread', label: t('unread'), count: notificationCounts.unread },
    { key: 'order', label: t('orders'), count: notificationCounts.order },
    { key: 'system', label: t('system'), count: notificationCounts.system },
    { key: 'promotion', label: t('promotions'), count: notificationCounts.promotion },
    { key: 'alert', label: t('alerts'), count: notificationCounts.alert },
  ];

  return (
    <CommonView>
      <View style={{ flex: 1 }}>
        {/* Removed custom header - using navigator header instead */}
        {/* Mark all as read button moved to header right */}
        {unreadCount > 0 && (
          <View style={{ padding: 16, paddingBottom: 0 }}>
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={{
                backgroundColor: '#007aff',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                alignSelf: 'flex-end',
              }}
            >
              <Body color="white" weight="semibold">
                {t('mark_all_read')}
              </Body>
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
                  setFilter(item.key as any);
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
                <Label
                  color={selectedFilter === item.key ? 'white' : colors.onSurfaceVariant}
                  weight="semibold"
                >
                  {item.label}
                </Label>
                {item.count > 0 && (
                  <Badge
                    style={{
                      backgroundColor: selectedFilter === item.key ? 'white' : '#007aff',
                      marginLeft: 6,
                    }}
                    size={18}
                  >
                    <Overline
                      color={selectedFilter === item.key ? '#007aff' : 'white'}
                      weight="bold"
                    >
                      {item.count}
                    </Overline>
                  </Badge>
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={onRefresh}
              colors={['#007aff']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={48}
                color={colors.onSurfaceVariant}
              />
              <Label color={colors.onSurfaceVariant} style={{ marginTop: 8 }}>
                {isLoading ? t('loading_notifications') : 
                 selectedFilter === 'unread' ? t('no_unread_notifications') : t('no_notifications')}
              </Label>
            </View>
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="loading"
                  size={24}
                  color={colors.primary}
                />
                <Caption color={colors.onSurfaceVariant} style={{ marginTop: 8 }}>
                  {t('loading_more')}
                </Caption>
              </View>
            ) : null
          }
        />
      </View>
      
      {/* Floating Action Button for refresh */}
      <FAB
        icon="refresh"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: colors.primary,
        }}
        onPress={onRefresh}
        disabled={isLoading || refreshing}
      />
    </CommonView>
  );
};

export default NotificationsList;