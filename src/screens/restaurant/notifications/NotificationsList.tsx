// src/screens/restaurant/RestaurantNotificationScreen.tsx
import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useTheme, ActivityIndicator, Chip, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { useNotifications } from '@/src/contexts/SimpleNotificationProvider';
import type { Notification } from '@/src/types';

const RestaurantNotificationScreen = () => {
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
    sendLocalNotification,
  } = useNotifications();

  // Restaurant-specific notification handling
  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      Haptics.selectionAsync();

      // Mark as read if not already read
      if (!notification.readAt) {
        await markAsRead(notification.id);
      }

      // Navigate based on notification type
      switch (notification.type) {
        case 'order':
          if (notification.data?.orderId) {
            navigation.navigate(
              'RestaurantOrderDetails' as never,
              {
                orderId: notification.data.orderId,
              } as never,
            );
          }
          break;

        case 'system':
          // Show system notification details
          Alert.alert(notification.title, notification.body);
          break;

        case 'promotion':
          // Navigate to promotions or show details
          Alert.alert(notification.title, notification.body);
          break;

        case 'alert':
          // Show alert details
          Alert.alert(notification.title, notification.body, [
            { text: t('ok'), style: 'default' },
          ]);
          break;

        default:
          Alert.alert(notification.title, notification.body);
      }
    },
    [markAsRead, navigation, t],
  );

  // Mark all as read with haptic feedback
  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const success = await markAllAsRead();
      if (success) {
        // Success feedback handled by the hook
      } else {
        Alert.alert(t('error'), t('mark_all_read_error'));
      }
    }
  }, [unreadCount, markAllAsRead, t]);

  // Filter change with haptic feedback
  const handleFilterChange = useCallback(
    (filter: string) => {
      Haptics.selectionAsync();
      setFilter(filter as any);
    },
    [setFilter],
  );



  // Get restaurant-specific notification icon
  const getNotificationIcon = (type: string, priority?: string) => {
    const iconMap: Record<string, string> = {
      order: 'receipt',
      system: 'cog',
      promotion: 'tag-outline',
      alert: 'alert-circle',
      business: 'chart-line',
      inventory: 'package-variant',
      reminder: 'clock-outline',
    };

    if (priority === 'high') return 'alert-circle';
    return iconMap[type] || 'bell';
  };

  // Get notification color based on type and priority
  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'high') return '#FF4444';
    if (priority === 'medium') return '#FF8800';

    const colorMap: Record<string, string> = {
      order: colors.primary,
      system: '#6B7280',
      promotion: '#10B981',
      alert: '#F59E0B',
      business: '#8B5CF6',
      inventory: '#EF4444',
      reminder: '#06B6D4',
    };

    return colorMap[type] || colors.onSurfaceVariant;
  };

  // Format timestamp for restaurant context
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 1) return t('just_now');
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return timestamp;
    }
  };

  // Render notification item with restaurant-specific styling
  const renderNotificationItem: ListRenderItem<Notification> = ({ item }) => {
    const isUnread = !item.readAt;
    const iconName = getNotificationIcon(item.type, item.priority);
    const iconColor = getNotificationColor(item.type, item.priority);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert(
            t('notification_options'),
            t('what_would_you_like_to_do'),
            [
              { text: t('cancel'), style: 'cancel' },
              {
                text: t('mark_as_read'),
                onPress: () => markAsRead(item.id),
              },
            ],
          );
        }}
        style={{
          backgroundColor: isUnread ? iconColor + '10' : colors.surface,
          marginBottom: 8,
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: iconColor,
          padding: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: iconColor + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <MaterialCommunityIcon
              name={iconName as any}
              size={20}
              color={iconColor}
            />
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: isUnread ? '600' : '500',
                  color: colors.onSurface,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.onSurfaceVariant,
                    marginRight: 8,
                  }}
                >
                  {formatTimestamp(item.createdAt)}
                </Text>
                {isUnread && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: colors.onSurfaceVariant,
                lineHeight: 20,
                marginBottom: 8,
              }}
              numberOfLines={2}
            >
              {item.body}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Chip
                compact
                style={{
                  backgroundColor: iconColor + '20',
                  height: 28,
                }}
                textStyle={{
                  fontSize: 11,
                  color: iconColor,
                  textTransform: 'capitalize',
                }}
              >
                {t(item.type)}
              </Chip>

              {item.priority === 'high' && (
                <View
                  style={{
                    backgroundColor: '#FF4444',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: '600',
                    }}
                  >
                    {t('high').toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Refresh on focus to avoid stale data after role/login switches
  useFocusEffect(
    React.useCallback(() => {
      refresh();
      return () => {};
    }, [refresh])
  );

  // Restaurant-specific filters
  const restaurantFilters = [
    { key: 'all', label: t('all'), count: notificationCounts.all },
    { key: 'unread', label: t('unread'), count: notificationCounts.unread },
    { key: 'order', label: t('orders'), count: notificationCounts.order },
    { key: 'alert', label: t('alerts'), count: notificationCounts.alert },
    { key: 'system', label: t('system'), count: notificationCounts.system },
    {
      key: 'promotion',
      label: t('promos'),
      count: notificationCounts.promotion,
    },
  ];

  // Render filter chip
  const renderFilterChip = ({
    item,
  }: {
    item: (typeof restaurantFilters)[0];
  }) => (
    <TouchableOpacity
      onPress={() => handleFilterChange(item.key)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor:
          selectedFilter === item.key ? colors.primary : colors.surfaceVariant,
        borderRadius: 20,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
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
          style={{
            backgroundColor:
              selectedFilter === item.key ? colors.onPrimary : colors.primary,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 6,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: 'bold',
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

  // Empty state for restaurant
  const renderEmptyState = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
      }}
    >
      <MaterialCommunityIcon
        name="bell-outline"
        size={64}
        color={colors.onSurfaceVariant}
        style={{ marginBottom: 16 }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: colors.onSurface,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {selectedFilter === 'unread' ? t('youre_all_caught_up') : t('no_notifications')}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
        }}
      >
        {selectedFilter === 'unread'
          ? t('youve_read_all_notifications')
          : t('new_orders_updates_appear_here')}
      </Text>
    </View>
  );

  // Loading state
  if (isLoading && !hasNotifications) {
    return (
      <CommonView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: colors.onSurfaceVariant,
            }}
          >
            {t('loading_notifications')}
          </Text>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Mark all read button */}
        {hasNotifications && unreadCount > 0 && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.outline + '30',
            }}
          >
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                alignSelf: 'flex-end',
              }}
            >
              <Text
                style={{
                  color: colors.onPrimary,
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {t('mark_all_read_count', { count: unreadCount })}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filter chips */}
        <View style={{ paddingVertical: 12 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={restaurantFilters.filter(
              (f) => f.count > 0 || f.key === 'all',
            )}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {/* Notifications list */}
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 4,
            paddingBottom: insets.bottom + 80, // Space for FAB
          }}
          ListFooterComponent={
            isLoadingMore ? (
              <View
                style={{
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="small" color={colors.primary} />
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: colors.onSurfaceVariant,
                  }}
                >
                  {t('loading_more')}
                </Text>
              </View>
            ) : null
          }
        />

        {/* Floating refresh button */}
        <FAB
          icon="refresh"
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: colors.primary,
          }}
          onPress={refresh}
          disabled={isLoading}
        />
      </View>
    </CommonView>
  );
};

export default RestaurantNotificationScreen;
