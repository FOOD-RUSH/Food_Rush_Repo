import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useTheme, ActivityIndicator, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import CommonView from '@/src/components/common/CommonView';
import { useNotifications } from '@/src/contexts/SimpleNotificationProvider';
import type { Notification } from '@/src/types';

const NotificationScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    selectedFilter,
    notificationCounts,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    setFilter,
    clearError,
    hasNotifications,
    userType,
    isInitialized,
  } = useNotifications();

  // Log mount - removed console.log for production
  useEffect(() => {}, []);

  // Log state changes - removed console.log for production
  useEffect(() => {}, [
    notifications.length,
    unreadCount,
    isLoading,
    hasNextPage,
    selectedFilter,
    error,
  ]);

  // Show error alert
  useEffect(() => {
    if (error) {
      // Error handling - removed console.log for production
      Alert.alert(t('error'), error, [
        {
          text: t('retry'),
          onPress: () => {
            clearError();
            refresh();
          },
        },
        {
          text: t('dismiss'),
          onPress: clearError,
          style: 'cancel',
        },
      ]);
    }
  }, [error, t, clearError, refresh]);

  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      // Removed console.log for production

      if (!notification.readAt) {
        const success = await markAsRead(notification.id);
        // Removed console.log for production
      }

      // Handle navigation based on notification type and data
      try {
        if (notification.data?.orderId) {
          const screenName =
            userType === 'restaurant'
              ? 'RestaurantOrderDetails'
              : 'OrderReceipt';
          // Removed console.log for production
          navigation.navigate(
            screenName as never,
            {
              orderId: notification.data.orderId,
            } as never,
          );
        } else if (notification.data?.restaurantId) {
          // Removed console.log for production
          navigation.navigate(
            'RestaurantDetails' as never,
            {
              restaurantId: notification.data.restaurantId,
            } as never,
          );
        } else {
          Alert.alert(notification.title, notification.body);
        }
      } catch (navError) {
        // Navigation error - removed console.log for production
        Alert.alert(notification.title, notification.body);
      }
    },
    [markAsRead, navigation, userType],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount === 0) {
      // No unread notifications - removed console.log for production
      return;
    }

    // Removed console.log for production
    const success = await markAllAsRead();

    if (!success) {
      // Mark all as read failed - removed console.log for production
      Alert.alert(t('error'), t('mark_all_read_error'));
    } else {
      // Removed console.log for production
    }
  }, [unreadCount, markAllAsRead, t]);

  const handleLoadMore = useCallback(() => {
    // Removed console.log for production

    if (!isLoadingMore && hasNextPage) {
      loadMore();
    }
  }, [isLoadingMore, hasNextPage, loadMore]);

  const handleRefresh = useCallback(() => {
    // Removed console.log for production
    refresh();
  }, [refresh]);

  // Ensure freshest data when screen gains focus
  useFocusEffect(
    useCallback(() => {
      refresh();
      return () => {};
    }, [refresh]),
  );

  const getNotificationIcon = (
    type: Notification['type'],
    priority?: string,
  ) => {
    const icons = {
      order: 'receipt-outline',
      system: 'settings-outline',
      promotion: 'gift-outline',
      alert: 'warning-outline',
    };

    if (priority === 'high') return 'alert-circle';
    return icons[type] || 'notifications-outline';
  };

  const getNotificationColor = (
    type: Notification['type'],
    priority?: string,
  ) => {
    if (priority === 'high') return '#FF4444';

    const typeColors = {
      order: colors.primary,
      system: colors.onSurfaceVariant,
      promotion: '#10B981',
      alert: '#F59E0B',
    };

    return typeColors[type] || colors.onSurfaceVariant;
  };

  const formatTime = (createdAt: string) => {
    try {
      const date = new Date(createdAt);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60),
      );

      if (diffInHours < 1) return t('just_now');
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      // Date format error - removed console.log for production
      return '';
    }
  };

  const renderNotification: ListRenderItem<Notification> = ({ item }) => {
    const isUnread = !item.readAt;
    const iconName = getNotificationIcon(item.type, item.priority);
    const iconColor = getNotificationColor(item.type, item.priority);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        className="px-4 py-4 border-b"
        style={{
          backgroundColor: isUnread
            ? colors.surfaceVariant + '40'
            : 'transparent',
          borderBottomColor: colors.outline + '30',
        }}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start space-x-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: iconColor + '20' }}
          >
            <IoniconsIcon name={iconName as any} size={20} color={iconColor} />
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className={`text-base flex-1 ${isUnread ? 'font-semibold' : 'font-medium'}`}
                style={{ color: colors.onSurface }}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <View className="flex-row items-center ml-2">
                <Text
                  className="text-xs"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {formatTime(item.createdAt)}
                </Text>
                {isUnread && (
                  <View
                    className="w-2 h-2 rounded-full ml-2"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </View>
            </View>

            <Text
              className="text-sm mb-2"
              style={{ color: colors.onSurfaceVariant }}
              numberOfLines={3}
            >
              {item.body}
            </Text>

            <View className="flex-row items-center justify-between">
              <Chip
                compact
                style={{
                  backgroundColor: iconColor + '20',
                  height: 24,
                }}
                textStyle={{
                  fontSize: 10,
                  color: iconColor,
                  textTransform: 'capitalize',
                }}
              >
                {item.type}
              </Chip>

              {item.priority === 'high' && (
                <Text
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: '#FF4444',
                    color: 'white',
                  }}
                >
                  {t('high_priority')}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filters = [
    { key: 'all', label: t('all'), count: notificationCounts.all },
    { key: 'unread', label: t('unread'), count: notificationCounts.unread },
    { key: 'order', label: t('orders'), count: notificationCounts.order },
    { key: 'system', label: t('system'), count: notificationCounts.system },
    {
      key: 'promotion',
      label: t('promos'),
      count: notificationCounts.promotion,
    },
    { key: 'alert', label: t('alerts'), count: notificationCounts.alert },
  ];

  const renderFilter = ({ item }: { item: (typeof filters)[0] }) => (
    <TouchableOpacity
      onPress={() => {
        // Removed console.log for production
        setFilter(item.key as any);
      }}
      className="px-3 py-2 mr-2 rounded-full flex-row items-center"
      style={{
        backgroundColor:
          selectedFilter === item.key ? colors.primary : colors.surfaceVariant,
      }}
    >
      <Text
        className="text-sm font-medium"
        style={{
          color:
            selectedFilter === item.key
              ? colors.onPrimary
              : colors.onSurfaceVariant,
        }}
      >
        {item.label}
      </Text>
      {item.count > 0 && (
        <View
          className="ml-2 px-2 py-0.5 rounded-full min-w-[20px] items-center"
          style={{
            backgroundColor:
              selectedFilter === item.key ? colors.onPrimary : colors.primary,
          }}
        >
          <Text
            className="text-xs font-bold"
            style={{
              color:
                selectedFilter === item.key ? colors.primary : colors.onPrimary,
            }}
          >
            {item.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="justify-center items-center flex-1 px-6 py-12">
      <IoniconsIcon
        name="notifications-outline"
        size={64}
        color={colors.onSurfaceVariant}
        style={{ marginBottom: 16 }}
      />
      <Text
        className="text-xl font-semibold text-center mb-2"
        style={{ color: colors.onSurface }}
      >
        {selectedFilter === 'unread'
          ? t('no_unread_notifications')
          : t('no_notifications')}
      </Text>
      <Text
        className="text-center text-base"
        style={{ color: colors.onSurfaceVariant }}
      >
        {selectedFilter === 'unread'
          ? t('youre_all_caught_up')
          : t('well_notify_when_something_happens')}
      </Text>

      {/* Debug info in development */}
      {__DEV__ && (
        <View className="mt-4 p-4 bg-gray-100 rounded">
          <Text className="text-xs font-mono">
            Debug Info:{'\n'}
            Initialized: {String(isInitialized)}
            {'\n'}
            Loading: {String(isLoading)}
            {'\n'}
            Error: {error || 'none'}
            {'\n'}
            User Type: {userType || 'none'}
          </Text>
        </View>
      )}
    </View>
  );

  // Loading state
  if (isLoading && !isInitialized) {
    return (
      <CommonView>
        <View className="justify-center items-center flex-1">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            className="mt-4 text-base"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('loading_notifications')}
          </Text>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {hasNotifications && unreadCount > 0 && (
          <View
            className="px-4 py-3 border-b flex-row justify-between items-center"
            style={{ borderBottomColor: colors.outline }}
          >
            <Text style={{ color: colors.onSurfaceVariant }}>
              {unreadCount === 1
                ? t('unread_notification_count', { count: unreadCount })
                : t('unread_notification_count_plural', { count: unreadCount })}
            </Text>
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text className="font-semibold" style={{ color: colors.primary }}>
                {t('mark_all_read')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="py-3">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters.filter((f) => f.count > 0 || f.key === 'all')}
            renderItem={renderFilter}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && isInitialized}
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
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      </View>
    </CommonView>
  );
};

export default NotificationScreen;
