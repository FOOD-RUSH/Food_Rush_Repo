 import React, { useState, useRef, useEffect } from 'react';
 import { View, Text, FlatList, Animated, TouchableOpacity, ScrollView, Easing,  Dimensions } from 'react-native';
 import { Chip, Badge, useTheme, TextInput } from 'react-native-paper';
 import { MaterialCommunityIcons } from '@expo/vector-icons';
 import { useNavigation, NavigationProp } from '@react-navigation/native';
 import { useTranslation } from 'react-i18next';
 import * as Haptics from 'expo-haptics';
 
 import CommonView from '@/src/components/common/CommonView';
 import { RestaurantOrdersStackParamList, RestaurantOrdersStackScreenProps } from '@/src/navigation/types';
 import { useGetOrders, useConfirmOrder, useRejectOrder } from '@/src/hooks/restaurant/useOrderApi';
 import { Order } from '@/src/services/restaurant/orderApi';
 
 // Constants
 const FILTERS = ['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'];
 const STATUS_COLORS = {
   pending: '#F59E0B',
   preparing: '#3B82F6',
   ready: '#10B981',
   delivered: '#8B5CF6',
   cancelled: '#EF4444',
   default: '#6B7280'
 };

const OrderScreen : React.FC<RestaurantOrdersStackScreenProps<'OrdersScreen'>>= ({navigation, route}) => {
  const { t } = useTranslation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFocused, setIsFocused] = useState(false);
  const {colors} = useTheme()

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Responsive utilities
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isLargeScreen = screenWidth > 414;

  // API hooks
  const { data: ordersData, isLoading, refetch } = useGetOrders({
    status: selectedFilter === 'all' ? undefined : selectedFilter,
  });

  const confirmOrderMutation = useConfirmOrder();
  const rejectOrderMutation = useRejectOrder();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.02 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isFocused, scaleAnim]);

  const onRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refetch();
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await confirmOrderMutation.mutateAsync(orderId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Failed to confirm order:', error);

      // Handle session expired errors gracefully
      if (error?.code === 'SESSION_EXPIRED' || error?.message?.includes('session has expired')) {
        // Don't show error to user, let the app handle logout
        return;
      }

      // For other errors, could show user-friendly message
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrderMutation.mutateAsync(orderId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Failed to reject order:', error);

      // Handle session expired errors gracefully
      if (error?.code === 'SESSION_EXPIRED' || error?.message?.includes('session has expired')) {
        // Don't show error to user, let the app handle logout
        return;
      }

      // For other errors, could show user-friendly message
    }
  };

  const orders = ordersData?.orders || [];

  const getStatusColor = (status: string) => STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;

  const OrderCard = React.memo(({ item, index }: { item: Order; index: number }) => {
    OrderCard.displayName = 'OrderCard';
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const translateXAnim = useRef(new Animated.Value(50)).current;

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

    const handlePress = () => {
      Haptics.selectionAsync();
      navigation.navigate('OrderDetails', { orderId: item.id });
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-xl mb-3 shadow-sm border-l-4"
          style={{
            borderLeftColor: getStatusColor(item.status),
            padding: isSmallScreen ? 12 : isLargeScreen ? 20 : 16,
            marginHorizontal: isSmallScreen ? 4 : isLargeScreen ? 8 : 6,
          }}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text
              className="font-bold text-gray-900 dark:text-blue-500"
              style={{
                fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {t('order')} #{item.id}
            </Text>
            <Badge
              style={{
                backgroundColor: getStatusColor(item.status),
                height: isSmallScreen ? 24 : isLargeScreen ? 28 : 26,
                fontSize: isSmallScreen ? 10 : isLargeScreen ? 14 : 12,
                color: 'white'
              }}
            >
              {isSmallScreen && t(item.status).length > 8 ? t(item.status).substring(0, 8) : t(item.status)}
            </Badge>
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Text
              className="text-gray-700 font-medium dark:text-blue-400"
              style={{
                fontSize: isSmallScreen ? 14 : isLargeScreen ? 16 : 15,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {item.customerName}
            </Text>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={isSmallScreen ? 14 : isLargeScreen ? 18 : 16}
                color="#6B7280"
              />
              <Text
                className="text-gray-600 ml-1 dark:text-blue-300"
                style={{
                  fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13,
                }}
              >
                {item.time}
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-100 pt-2 dark:border-gray-600">
            <Text
              className="text-gray-600 dark:text-blue-300"
              style={{
                fontSize: isSmallScreen ? 12 : isLargeScreen ? 14 : 13,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
            </Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text
                className="font-bold text-blue-600 dark:text-blue-400"
                style={{
                  fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                }}
              >
                ${item.total.toFixed(2)}
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name={
                    item.paymentMethod === 'credit_card' ? 'credit-card' :
                    item.paymentMethod === 'cash' ? 'cash' : 'cellphone'
                  }
                  size={isSmallScreen ? 16 : isLargeScreen ? 20 : 18}
                  color="#6B7280"
                />
                <Text
                  className="text-gray-500 ml-1 dark:text-blue-300"
                  style={{
                    fontSize: isSmallScreen ? 10 : isLargeScreen ? 12 : 11,
                  }}
                >
                  {item.paymentMethod === 'credit_card' ? (isSmallScreen ? 'Card' : t('credit_card')) :
                   item.paymentMethod === 'cash' ? t('cash') : (isSmallScreen ? 'Mobile' : t('mobile_payment'))}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  OrderCard.displayName = 'OrderCard';

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.id.includes(searchQuery);
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <CommonView>
      <View className="flex-1">
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim }} className="mb-6 px-2 pt-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-3">
              <Text
                className="font-bold text-gray-900 dark:text-blue-500"
                style={{
                  fontSize: isSmallScreen ? 24 : isLargeScreen ? 32 : 28,
                  lineHeight: isSmallScreen ? 28 : isLargeScreen ? 36 : 32,
                  color: colors.onBackground
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {t('order_dashboard')}
              </Text>
              <Text
                className="text-gray-500 mt-1 dark:text-blue-300"
                style={{
                  fontSize: isSmallScreen ? 12 : isLargeScreen ? 16 : 14,
                }}
                numberOfLines={1}
              >
                {t('manage_track_orders')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('RestaurantOrderHistory');
              }}
              style={{
                backgroundColor: '#DBEAFE',
                paddingHorizontal: isSmallScreen ? 12 : isLargeScreen ? 20 : 16,
                paddingVertical: isSmallScreen ? 8 : isLargeScreen ? 12 : 10,
                borderRadius: 8,
              }}
            >
              <Text
                className="text-blue-600 font-semibold"
                style={{
                  fontSize: isSmallScreen ? 14 : isLargeScreen ? 17 : 15,
                }}
              >
                {t('history')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search Bar */}


<TextInput
            placeholder={t('search_order_options')}
            left={
              <TextInput.Icon
                icon="magnify"
                size={30}
                color={colors.onSurface}
              />
            }
            mode="outlined"
            outlineStyle={{
              borderColor: colors.surface,
              borderWidth: 1,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
            }}
            style={{
              backgroundColor: colors.surface,
            }}
            className="py-1 px-3 rounded-2xl"
            placeholderTextColor={colors.onBackground}
            pointerEvents="box-only"
            onChangeText={setSearchQuery}

          />

        {/* Filter Chips */}
        <Animated.View style={{ opacity: fadeAnim }} className="mb-4 mt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: isSmallScreen ? 4 : isLargeScreen ? 8 : 6,
              paddingVertical: isSmallScreen ? 6 : isLargeScreen ? 10 : 8
            }}
          >
            {FILTERS.map((filter) => (
              <Chip
                key={filter}
                selected={selectedFilter === filter}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedFilter(filter);
                }}
                style={{
                  backgroundColor: selectedFilter === filter ? getStatusColor(filter) : colors.surfaceVariant,
                  marginRight: isSmallScreen ? 6 : isLargeScreen ? 12 : 8,
                  borderColor: getStatusColor(filter),
                  borderWidth: selectedFilter === filter ? 0 : 1,
                  height: isSmallScreen ? 32 : isLargeScreen ? 40 : 36,
                }}
                textStyle={{
                  color: selectedFilter === filter ? 'white' : colors.onBackground,
                  fontWeight: '600',
                  fontSize: isSmallScreen ? 13 : isLargeScreen ? 18 : 15,
                }}
                compact
              >
                {filter}
              </Chip>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Orders List */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={filteredOrders}
            renderItem={({ item, index }) => <OrderCard item={item} index={index} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={isLoading}
            onRefresh={onRefresh}
            ListEmptyComponent={
              isLoading ? (
                <View className="items-center justify-center py-10">
                  <MaterialCommunityIcons name="loading" size={40} color="#3B82F6" />
                  <Text className="text-gray-500 mt-2">{t('please_wait')}</Text>
                </View>
              ) : (
                <View className="items-center justify-center py-10">
                  <MaterialCommunityIcons name="cart-off" size={40} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2">{t('no_orders_found')}</Text>
                </View>
              )
            }
          />
        </Animated.View>
      </View>
    </CommonView>
  );
};

export default OrderScreen;
