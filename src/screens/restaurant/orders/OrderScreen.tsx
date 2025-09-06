import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, ScrollView, Easing,TextInput } from 'react-native';
import { Searchbar, Chip, Badge, Button, Divider, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import * as Haptics from 'expo-haptics';

// Use your existing navigation types
import { RestaurantOrdersStackParamList } from '@/src/navigation/types';

// Import API hooks
import { useGetOrders, useGetOrderById, useAcceptOrder, useRejectOrder, useMarkOrderAsReady, useMarkOrderAsDelivered } from '@/src/hooks/restaurant/useOrderApi';
import { Order, OrderItem } from '@/src/services/restaurant/orderApi';

const OrderScreen = () => {
  // Use your existing RestaurantOrdersStackParamList type
  const navigation = useNavigation<NavigationProp<RestaurantOrdersStackParamList>>();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // API hooks
  const { data: ordersData, isLoading, refetch } = useGetOrders({
    status: selectedFilter === 'all' ? undefined : selectedFilter,
  });

  const acceptOrderMutation = useAcceptOrder();
  const rejectOrderMutation = useRejectOrder();
  const markAsReadyMutation = useMarkOrderAsReady();
  const markAsDeliveredMutation = useMarkOrderAsDelivered();

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

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrderMutation.mutateAsync(orderId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrderMutation.mutateAsync({ orderId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to reject order:', error);
    }
  };

  const orders = ordersData?.orders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'preparing': return '#3B82F6';
      case 'ready': return '#10B981';
      case 'delivered': return '#8B5CF6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const OrderCard = React.memo(({ item, index }: { item: Order; index: number }) => {
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
      // Pass only orderId as per your navigation type definition
      navigation.navigate('OrderDetails', { 
        orderId: item.id
      });
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity 
          className="bg-white p-4 rounded-xl mb-3 shadow-sm border-l-4"
          style={{ borderLeftColor: getStatusColor(item.status) }}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-gray-900">{t('order')} #{item.id}</Text>
            <Badge
              style={{ backgroundColor: getStatusColor(item.status) }}
              className="text-white"
            >
              {t(item.status)}
            </Badge>
          </View>
          
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-700 font-medium">{item.customerName}</Text>
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{item.time}</Text>
            </View>
          </View>

          <View className="border-t border-gray-100 pt-2">
            <Text className="text-gray-600" numberOfLines={1} ellipsizeMode="tail">
              {item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
            </Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-lg font-bold text-blue-600">
                ${item.total.toFixed(2)}
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name={
                    item.paymentMethod === 'credit_card' ? 'credit-card' :
                    item.paymentMethod === 'cash' ? 'cash' : 'cellphone'
                  } 
                  size={18} 
                  color="#6B7280" 
                />
                <Text className="text-gray-500 ml-1 text-xs">
                  {item.paymentMethod === 'credit_card' ? t('credit_card') :
                   item.paymentMethod === 'cash' ? t('cash') : t('mobile_payment')}
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
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="mb-6"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-gray-900">{t('order_dashboard')}</Text>
              <Text className="text-gray-500 mt-1">{t('manage_track_orders')}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('OrderHistory');
              }}
              className="bg-blue-100 px-4 py-2 rounded-lg"
            >
              <Text className="text-blue-600 font-semibold">{t('history')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Animated.View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            height: 45,
            marginHorizontal: 4,
            marginBottom: 16,
            justifyContent: 'center',
            elevation: 2,
            transform: [{ scale: scaleAnim }],
            borderWidth: isFocused ? 2 : 0,
            borderColor: '#2196F3',
          }}>
            {/* Search icon */}
            {(isFocused || searchQuery) && (
              <Animated.View style={{
                position: 'absolute',
                left: 12,
                top: 12,
                zIndex: 1,
                opacity: scaleAnim.interpolate({
                  inputRange: [1, 1.02],
                  outputRange: [0.8, 1]
                })
              }}>
                <MaterialCommunityIcons 
                  name="magnify" 
                  size={20} 
                  color="#2196F3" 
                />
              </Animated.View>
            )}
            
            <TextInput
              placeholder={t('search_orders')}
              placeholderTextColor="#90CAF9"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                color: '#2196F3',
                height: 45,
                fontSize: 16,
                textAlign: isFocused ? 'left' : 'center',
                textAlignVertical: 'center',
                includeFontPadding: false,
                paddingLeft: (isFocused || searchQuery) ? 40 : 16,
                paddingRight: 16,
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!searchQuery) setIsFocused(false);
              }}
            />
          </Animated.View>
        </Animated.View>

        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="mb-4 mt-2"
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2,
              paddingVertical:8
             }}
          >
            {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map((filter) => (
              <Chip
                key={filter}
                selected={selectedFilter === filter}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedFilter(filter);
                }}
                style={{ 
                  backgroundColor: selectedFilter === filter ? getStatusColor(filter) : '#F3F4F6',
                  marginRight: 8,
                  borderColor: getStatusColor(filter),
                  borderWidth: selectedFilter === filter ? 0 : 1
                }}
                textStyle={{ 
                  color: selectedFilter === filter ? 'white' : '#4B5563',
                  fontWeight: '600'
                }}
                compact
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Chip>
            ))}
          </ScrollView>
        </Animated.View>

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

const OrderDetailsScreen = ({
  route
}: {
  route: RouteProp<RestaurantOrdersStackParamList, 'OrderDetails'>
}) => {
  // Use your existing RestaurantOrdersStackParamList type
  const navigation = useNavigation<NavigationProp<RestaurantOrdersStackParamList>>();
  const { t } = useTranslation();
  const { orderId } = route.params;

  // React hooks must be called at the top level - before any conditional logic
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // API hooks
  const { data: orderData, isLoading } = useGetOrderById(orderId);
  const acceptOrderMutation = useAcceptOrder();
  const rejectOrderMutation = useRejectOrder();
  const markAsReadyMutation = useMarkOrderAsReady();
  const markAsDeliveredMutation = useMarkOrderAsDelivered();
  
  // Initialize state with default values - hooks must be called consistently
  const [status, setStatus] = useState(orderData?.status || 'pending');
  const [prepProgress, setPrepProgress] = useState(0);
  
  useEffect(() => {
    // Only run animations if orderData exists
    if (orderData) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          speed: 1,
          bounciness: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Simulate preparation progress
      if (status === 'preparing') {
        const interval = setInterval(() => {
          setPrepProgress(prev => {
            if (prev >= 1) {
              clearInterval(interval);
              return 1;
            }
            return prev + 0.05;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [status, orderData, fadeAnim, slideAnim]);
  
  // Handle case where order is not found - after all hooks are called
  if (!orderData) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4">{t('order_not_found')}</Text>
          <Text className="text-gray-600 mt-2">{t('order_could_not_be_found')}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            className="mt-4"
          >
            {t('go_back')}
          </Button>
        </View>
      </CommonView>
    );
  }
  const getStatusColor = () => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'preparing': return '#3B82F6';
      case 'ready': return '#10B981';
      case 'delivered': return '#8B5CF6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleStatusChange = async (newStatus: typeof status) => {
    if (!orderData) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatus(newStatus);

      if (newStatus === 'preparing') {
        await acceptOrderMutation.mutateAsync(orderId);
        setPrepProgress(0);
      } else if (newStatus === 'ready') {
        await markAsReadyMutation.mutateAsync(orderId);
      } else if (newStatus === 'delivered') {
        await markAsDeliveredMutation.mutateAsync(orderId);
      } else if (newStatus === 'cancelled') {
        await rejectOrderMutation.mutateAsync({ orderId });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Revert status on error
      setStatus(orderData.status);
    }
  };

  const getEstimatedTimeLeft = () => {
    const totalTime = orderData.estimatedPrepTime;
    const timeLeft = Math.ceil(totalTime * (1 - prepProgress));
    return timeLeft > 0 ? timeLeft : 0;
  };

  return (
    <CommonView>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Order Header */}
          <View className="bg-white p-5 rounded-xl mb-4 shadow-sm">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-2xl font-bold text-gray-900">{t('order')} #{orderId}</Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">{orderData.time}</Text>
                </View>
              </View>
              <Badge 
                size={24}
                style={{ backgroundColor: getStatusColor() }}
                className="text-white px-2"
              >
                {t(status)}
              </Badge>
            </View>

            {status === 'preparing' && (
              <View className="mt-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600">{t('preparation_progress')}</Text>
                  <Text className="text-gray-600">{getEstimatedTimeLeft()} {t('min_left')}</Text>
                </View>
                <ProgressBar 
                  progress={prepProgress} 
                  color="#3B82F6"
                  className="h-2 rounded-full"
                />
              </View>
            )}
          </View>

          {/* Customer Details */}
          <View className="bg-white p-5 rounded-xl mb-4">
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="account-circle" size={24} color="#4B5563" />
              <Text className="text-lg font-semibold ml-2">{t('customer_details')}</Text>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="account" size={18} color="#6B7280" />
                <Text className="text-gray-700 ml-3">{orderData.customerName}</Text>
              </View>
              
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="phone" size={18} color="#6B7280" />
                <Text className="text-gray-700 ml-3">{orderData.customerPhone}</Text>
              </View>
              
              <View className="flex-row items-start">
                <MaterialCommunityIcons name="map-marker" size={18} color="#6B7280" style={{ marginTop: 2 }} />
                <Text className="text-gray-700 ml-3 flex-1">{orderData.customerAddress}</Text>
              </View>
            </View>

            {orderData.specialInstructions && (
              <View className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="alert-circle" size={18} color="#D97706" />
                  <Text className="text-amber-800 font-medium ml-2">{t('special_instructions')}</Text>
                </View>
                <Text className="text-amber-800 mt-1">{orderData.specialInstructions}</Text>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View className="bg-white p-5 rounded-xl mb-4">
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="food" size={24} color="#4B5563" />
              <Text className="text-lg font-semibold ml-2">{t('order_items')}</Text>
            </View>
            
            {orderData.items.map((item: OrderItem, index: number) => (
              <View key={item.id} className={index !== 0 ? "border-t border-gray-100 pt-3 pb-2" : "pb-2"}>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-gray-600 w-8">{item.quantity}x</Text>
                    <Text className="text-gray-800 font-medium">{item.name}</Text>
                  </View>
                  <Text className="font-semibold">${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                
                {item.modifications && item.modifications.length > 0 && (
                  <View className="ml-8 mt-1">
                    {item.modifications.map((mod: string, modIndex: number) => (
                      <View key={modIndex} className="flex-row items-center">
                        <MaterialCommunityIcons name="circle-small" size={20} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm">{mod}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
            
            <Divider className="my-3" />
            
            <View className="space-y-2">
             <View className="flex-row justify-between">
               <Text className="text-gray-600">{t('subtotal')}</Text>
               <Text className="text-gray-700">${orderData.subtotal.toFixed(2)}</Text>
             </View>

             <View className="flex-row justify-between">
               <Text className="text-gray-600">{t('tax')}</Text>
               <Text className="text-gray-700">${orderData.tax.toFixed(2)}</Text>
             </View>

             {orderData.deliveryFee > 0 && (
               <View className="flex-row justify-between">
                 <Text className="text-gray-600">{t('delivery_fee')}</Text>
                 <Text className="text-gray-700">${orderData.deliveryFee.toFixed(2)}</Text>
               </View>
             )}

             <View className="flex-row justify-between mt-2">
               <Text className="font-bold text-lg">{t('total')}</Text>
               <Text className="font-bold text-lg text-blue-600">${orderData.total.toFixed(2)}</Text>
             </View>
           </View>
            
            <View className="mt-4 flex-row items-center">
              <MaterialCommunityIcons 
                name={
                  orderData.paymentMethod === 'credit_card' ? 'credit-card' :
                  orderData.paymentMethod === 'cash' ? 'cash' : 'cellphone'
                } 
                size={20} 
                color="#4B5563" 
              />
              <Text className="text-gray-700 ml-2">
                {t('paid_with')} {orderData.paymentMethod === 'credit_card' ? t('credit_card') :
                          orderData.paymentMethod === 'cash' ? t('cash') : t('mobile_payment')}
              </Text>
            </View>
          </View>

          {/* Order Actions */}
          <View className="space-y-3">
            {status === 'pending' && (
              <>
                <Button
                  mode="contained"
                  onPress={() => handleStatusChange('preparing')}
                  className="rounded-lg py-2"
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  icon="check"
                >
                  {t('accept_order')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleStatusChange('cancelled')}
                  className="rounded-lg py-2 border-red-500"
                  textColor="#EF4444"
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  icon="close"
                >
                  {t('reject_order')}
                </Button>
              </>
            )}
            
            {status === 'preparing' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('ready')}
                className="rounded-lg py-2"
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
                icon="check-all"
                disabled={prepProgress < 1}
              >
                {t('mark_as_ready')}
              </Button>
            )}
            
            {status === 'ready' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('delivered')}
                className="rounded-lg py-2"
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
                icon="truck-delivery"
              >
                {t('mark_as_delivered')}
              </Button>
            )}

            {(status === 'delivered' || status === 'cancelled') && (
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                className="rounded-lg py-2"
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
                icon="arrow-left"
              >
                {t('back_to_orders')}
              </Button>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};


export default OrderScreen;
