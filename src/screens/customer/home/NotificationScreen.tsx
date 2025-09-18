import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonView from '@/src/components/common/CommonView';
import {
  useNotificationStore,
  useNotifications,
  useNotificationLoading,
  useNotificationLoadingMore,
  useNotificationError,
  useUnreadCount,
  useNotificationHasNextPage,
  useNotificationTotal,
} from '@/src/stores/customerStores/notificationStore';
import type { Notification } from '@/src/types';

const NotificationScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const insets = useSafeAreaInsets();

  // Store hooks
  const notifications = useNotifications();
  const isLoading = useNotificationLoading();
  const isLoadingMore = useNotificationLoadingMore();
  const error = useNotificationError();
  const unreadCount = useUnreadCount();
  const hasNextPage = useNotificationHasNextPage();
  const total = useNotificationTotal();

  // Store actions
  const {
    fetchNotifications,
    loadMoreNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    updateUnreadCount,
    clearError,
  } = useNotificationStore();

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    updateUnreadCount();
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refreshNotifications();
    await updateUnreadCount();
  }, [refreshNotifications, updateUnreadCount]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMoreNotifications();
    }
  }, [hasNextPage, isLoadingMore, loadMoreNotifications]);

  // Handle notification press
  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      if (!notification.readAt) {
        try {
          await markAsRead(notification.id);
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }

      // Handle navigation based on notification type and data
      if (notification.data) {
        if (notification.data.orderId) {
          // Navigate to order details
          console.log('Navigate to order:', notification.data.orderId);
        } else if (notification.data.restaurantId) {
          // Navigate to restaurant details
          console.log(
            'Navigate to restaurant:',
            notification.data.restaurantId,
          );
        }
      }
    },
    [markAsRead],
  );

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount > 0) {
      try {
        await markAllAsRead();
      } catch (error) {
        Alert.alert(
          t('error', 'Error'),
          t('mark_all_read_error', 'Failed to mark all notifications as read'),
        );
      }
    }
  }, [unreadCount, markAllAsRead, t]);

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return 'receipt-outline';
      case 'DELIVERY':
        return 'bicycle-outline';
      case 'PROMOTION':
        return 'pricetag-outline';
      case 'SYSTEM':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  // Get notification icon color based on type
  const getNotificationIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return colors.primary;
      case 'DELIVERY':
        return '#10B981'; // Green
      case 'PROMOTION':
        return '#F59E0B'; // Amber
      case 'SYSTEM':
        return colors.onSurfaceVariant;
      default:
        return colors.onSurfaceVariant;
    }
  };

  // Format notification time
  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return t('just_now', 'Just now');
    } else if (diffInHours < 24) {
      return t('hours_ago', '{{count}}h ago', { count: diffInHours });
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return t('days_ago', '{{count}}d ago', { count: diffInDays });
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  // Render notification item
  const renderNotificationItem: ListRenderItem<Notification> = ({ item }) => {
    const isUnread = !item.readAt;

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        className="px-4 py-4"
        style={{
          backgroundColor: isUnread ? colors.surfaceVariant : colors.background,
        }}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start space-x-3">
          {/* Notification Icon */}
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: isUnread
                ? getNotificationIconColor(item.type) + '20'
                : colors.surfaceVariant,
            }}
          >
            <Ionicons
              name={getNotificationIcon(item.type)}
              size={20}
              color={getNotificationIconColor(item.type)}
            />
          </View>

          {/* Notification Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className="font-semibold text-base flex-1"
                style={{
                  color: isUnread ? colors.onSurface : colors.onSurfaceVariant,
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {/* Time */}
              <Text
                className="text-xs ml-2"
                style={{ color: colors.onSurfaceVariant }}
              >
                {formatNotificationTime(item.createdAt)}
              </Text>
            </View>

            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
              numberOfLines={3}
            >
              {item.body}
            </Text>
          </View>

          {/* Unread indicator */}
          {isUnread && (
            <View
              className="w-2 h-2 rounded-full mt-2"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render footer for loading more
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View className="justify-center items-center flex-1 px-6">
      <Ionicons
        name="notifications-outline"
        size={80}
        color={colors.onSurfaceVariant}
        style={{ marginBottom: 16 }}
      />
      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {t('no_notifications', 'No Notifications')}
      </Text>
      <Text
        className="text-center text-base"
        style={{ color: colors.onSurfaceVariant }}
      >
        {t(
          'no_notifications_message',
          "You're all caught up! We'll notify you when something new happens.",
        )}
      </Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View className="justify-center items-center flex-1 px-6">
      <Ionicons
        name="alert-circle-outline"
        size={80}
        color={colors.error}
        style={{ marginBottom: 16 }}
      />
      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {t('error_loading_notifications', 'Error Loading Notifications')}
      </Text>
      <Text
        className="text-center text-base mb-4"
        style={{ color: colors.onSurfaceVariant }}
      >
        {error || t('generic_error', 'Something went wrong. Please try again.')}
      </Text>
      <TouchableOpacity
        onPress={() => {
          clearError();
          handleRefresh();
        }}
        className="px-6 py-3 rounded-lg"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="font-semibold" style={{ color: colors.onPrimary }}>
          {t('try_again', 'Try Again')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  if (isLoading && notifications.length === 0) {
    return (
      <CommonView>
        <View className="justify-center items-center flex-1">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            className="mt-4 text-base"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('loading_notifications', 'Loading notifications...')}
          </Text>
        </View>
      </CommonView>
    );
  }

  // Render error state
  if (error && notifications.length === 0) {
    return <CommonView>{renderErrorState()}</CommonView>;
  }

  return (
    <CommonView>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header with Mark All Read button */}
        {notifications.length > 0 && unreadCount > 0 && (
          <View
            className="px-4 py-3 border-b flex-row justify-between items-center"
            style={{
              borderBottomColor: colors.outline,
              paddingTop: insets.top + 12,
            }}
          >
            <Text
              className="text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('unread_notifications', '{{count}} unread', {
                count: unreadCount,
              })}
            </Text>
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text className="font-semibold" style={{ color: colors.primary }}>
                {t('mark_all_read', 'Mark All Read')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <Divider style={{ backgroundColor: colors.outline }} />
          )}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom,
          }}
        />
      </View>
    </CommonView>
  );
};

export default NotificationScreen;
