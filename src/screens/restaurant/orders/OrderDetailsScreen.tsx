import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, ScrollView, Animated } from 'react-native';
import { Button, Badge, Divider, ProgressBar, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
=======
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Searchbar, Chip, Badge, Button, Divider } from 'react-native-paper';
>>>>>>> origin/Customer_Setup
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
<<<<<<< HEAD
import { RootStackScreenProps } from '@/src/navigation/types';
import { useGetOrderById, useConfirmOrder, useRejectOrder } from '@/src/hooks/restaurant/useOrderApi';
import { OrderItem } from '@/src/services/restaurant/orderApi';

const OrderDetailsScreen: React.FC<RootStackScreenProps<'RestaurantOrderDetails'>> = ({
  route, navigation
=======
type OrderDetailsParams = {
  OrderDetails: {
    orderId: string;
  };
};

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  time: string;
}

const OrderScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const orders: Order[] = [
    {
      id: '1',
      customerName: 'John Doe',
      items: ['Burger', 'Fries'],
      total: 15.99,
      status: 'pending',
      time: '12:30 PM',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      items: ['Pizza', 'Salad'],
      total: 20.49,
      status: 'preparing',
      time: '1:00 PM',
    },
    // Add more sample orders as needed
  ];

  const OrderCard = React.memo(
    ({ item, index }: { item: Order; index: number }) => {
      const scaleAnim = useRef(new Animated.Value(0.9)).current;

      useEffect(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      }, [index, scaleAnim]);

      return (
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }}
        >
          <TouchableOpacity
            className="bg-white p-4 rounded-xl mb-3 shadow-sm"
            onPress={() => {
              /* Navigate to order details */
            }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Order #{item.id}</Text>
              <Badge>{item.status}</Badge>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">{item.customerName}</Text>
              <Text className="text-gray-600">{item.time}</Text>
            </View>

            <View className="border-t border-gray-100 pt-2">
              <Text className="text-gray-500">{item.items.join(', ')}</Text>
              <Text className="text-lg font-bold text-blue-500 mt-2">
                ${item.total.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
  );

  OrderCard.displayName = 'OrderCard';

  return (
    <CommonView>
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">Orders</Text>
          <Text className="text-gray-500 mt-2">
            Manage your restaurant orders
          </Text>
        </View>

        <Searchbar
          placeholder="Search orders"
          onChangeText={setSearchQuery}
          value={searchQuery}
          className="mb-4 rounded-xl"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {['all', 'pending', 'preparing', 'ready', 'delivered'].map(
            (filter) => (
              <Chip
                key={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
                className="mr-2"
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Chip>
            ),
          )}
        </ScrollView>

        <FlatList
          data={orders}
          renderItem={({ item, index }) => (
            <OrderCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </CommonView>
  );
};

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

const OrderDetailsScreen = ({
  route,
}: {
  route: RouteProp<OrderDetailsParams, 'OrderDetails'>;
>>>>>>> origin/Customer_Setup
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { orderId } = route.params;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

<<<<<<< HEAD
  // API hooks
  const { data: orderData, isLoading } = useGetOrderById(orderId);
  const confirmOrderMutation = useConfirmOrder();
  const rejectOrderMutation = useRejectOrder();

  // State
  const [status, setStatus] = useState(orderData?.status || 'pending');
  const [prepProgress, setPrepProgress] = useState(0);

  // Responsive utilities
  const buttonHeight = 48;
  const fontSize = 16;
=======
  const orderItems: OrderItem[] = [
    { quantity: 2, name: 'Burger', price: 25.99 },
    { quantity: 1, name: 'Fries', price: 19.99 },
  ];
>>>>>>> origin/Customer_Setup

  useEffect(() => {
    if (orderData) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
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

  // Handle order not found
  if (!orderData) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center p-6">
          <MaterialCommunityIcons name="alert-circle" size={48} color={colors.error} />
          <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.onSurface }}>
            {t('order_not_found')}
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.onSurfaceVariant }}>
            {t('order_could_not_be_found')}
          </Text>
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
      case 'pending': return colors.warning || '#F59E0B';
      case 'preparing': return colors.primary;
      case 'ready': return colors.success || '#10B981';
      case 'delivered': return '#8B5CF6';
      case 'cancelled': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  const handleStatusChange = async (newStatus: typeof status) => {
    if (!orderData) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatus(newStatus);

      if (newStatus === 'preparing') {
        await confirmOrderMutation.mutateAsync(orderId);
        setPrepProgress(0);
      } else if (newStatus === 'cancelled') {
        await rejectOrderMutation.mutateAsync(orderId);
      }
    } catch (error: any) {
      // Handle session expired errors gracefully
      if (error?.code === 'SESSION_EXPIRED' || error?.message?.includes('session has expired')) {
        // Don't show error to user, let the app handle logout
        return;
      }

      // For other errors, revert status and could show user-friendly message
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
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
<<<<<<< HEAD
          {/* Order Header */}
          <View className="p-5 rounded-xl mb-4" style={{ backgroundColor: colors.surface }}>
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-2xl font-bold" style={{ color: colors.onSurface }}>
                  {t('order_prefix')}{orderId}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons name="clock-outline" size={18} color={colors.onSurfaceVariant} />
                  <Text className="ml-2" style={{ color: colors.onSurfaceVariant }}>
                    {orderData.time}
                  </Text>
                </View>
              </View>
              <Badge
                size={24}
                style={{ backgroundColor: getStatusColor() }}
              >
                <Text className="text-white font-medium">{t(status)}</Text>
              </Badge>
=======
          {/* Order Status */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              Order #{orderId}
            </Text>
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#9CA3AF"
              />
              <Text className="text-gray-500 ml-2">Received at 10:30 AM</Text>
>>>>>>> origin/Customer_Setup
            </View>

            {status === 'preparing' && (
              <View className="mt-4">
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors.onSurfaceVariant }}>{t('preparation_progress')}</Text>
                  <Text style={{ color: colors.onSurfaceVariant }}>
                    {getEstimatedTimeLeft()} {t('min_left')}
                  </Text>
                </View>
                <ProgressBar
                  progress={prepProgress}
                  color={colors.primary}
                  className="h-2 rounded-full"
                />
              </View>
            )}
          </View>

          {/* Customer Details */}
          <View className="p-5 rounded-xl mb-4" style={{ backgroundColor: colors.surface }}>
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="account-circle" size={24} color={colors.onSurfaceVariant} />
              <Text className="text-lg font-semibold ml-2" style={{ color: colors.onSurface }}>
                {t('customer_details')}
              </Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="account" size={18} color={colors.onSurfaceVariant} />
                <Text className="ml-3" style={{ color: colors.onSurface }}>
                  {orderData.customerName}
                </Text>
              </View>

              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="phone" size={18} color={colors.onSurfaceVariant} />
                <Text className="ml-3" style={{ color: colors.onSurface }}>
                  {orderData.customerPhone}
                </Text>
              </View>

              <View className="flex-row items-start">
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={18} 
                  color={colors.onSurfaceVariant} 
                  style={{ marginTop: 2 }} 
                />
                <Text className="ml-3 flex-1" style={{ color: colors.onSurface }}>
                  {orderData.customerAddress}
                </Text>
              </View>
            </View>

            {orderData.specialInstructions && (
              <View className="mt-4 p-3 rounded-lg border" style={{ 
                backgroundColor: colors.warningContainer || '#FEF3C7',
                borderColor: colors.warning || '#F59E0B'
              }}>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons 
                    name="alert-circle" 
                    size={18} 
                    color={colors.warning || '#D97706'} 
                  />
                  <Text className="font-medium ml-2" style={{ color: colors.onWarningContainer || '#92400E' }}>
                    {t('special_instructions')}
                  </Text>
                </View>
                <Text className="mt-1" style={{ color: colors.onWarningContainer || '#92400E' }}>
                  {orderData.specialInstructions}
                </Text>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View className="p-5 rounded-xl mb-4" style={{ backgroundColor: colors.surface }}>
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="food" size={24} color={colors.onSurfaceVariant} />
              <Text className="text-lg font-semibold ml-2" style={{ color: colors.onSurface }}>
                {t('order_items')}
              </Text>
            </View>

            {orderData.items.map((item: OrderItem, index: number) => (
              <View key={item.id} className={index !== 0 ? "pt-3 pb-2" : "pb-2"} style={{
                borderTopWidth: index !== 0 ? 1 : 0,
                borderTopColor: colors.outline
              }}>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="w-8" style={{ color: colors.onSurfaceVariant }}>
                      {item.quantity}x
                    </Text>
                    <Text className="font-medium flex-1" style={{ color: colors.onSurface }}>
                      {item.name}
                    </Text>
                  </View>
                  <Text className="font-semibold" style={{ color: colors.primary }}>
                    {(item.price * item.quantity).toLocaleString()} {t('currency_xaf')}
                  </Text>
                </View>

                {item.modifications && item.modifications.length > 0 && (
                  <View className="ml-8 mt-1">
                    {item.modifications.map((mod: string, modIndex: number) => (
                      <View key={modIndex} className="flex-row items-center">
                        <MaterialCommunityIcons name="circle-small" size={20} color={colors.onSurfaceVariant} />
                        <Text className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                          {mod}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <Divider className="my-3" />

            <View className="space-y-2">
             <View className="flex-row justify-between mb-2">
               <Text style={{ color: colors.onSurfaceVariant }}>{t('subtotal')}</Text>
               <Text style={{ color: colors.onSurface }}>
                 {orderData.subtotal.toLocaleString()} {t('currency_xaf')}
               </Text>
             </View>

             <View className="flex-row justify-between mb-2">
               <Text style={{ color: colors.onSurfaceVariant }}>{t('tax')}</Text>
               <Text style={{ color: colors.onSurface }}>
                 {orderData.tax.toLocaleString()} {t('currency_xaf')}
               </Text>
             </View>

             {orderData.deliveryFee > 0 && (
               <View className="flex-row justify-between mb-2">
                 <Text style={{ color: colors.onSurfaceVariant }}>{t('delivery_fee')}</Text>
                 <Text style={{ color: colors.onSurface }}>
                   {orderData.deliveryFee.toLocaleString()} {t('currency_xaf')}
                 </Text>
               </View>
             )}

             <View className="flex-row justify-between mt-2 pt-2" style={{
               borderTopWidth: 1,
               borderTopColor: colors.outline
             }}>
               <Text className="font-bold text-lg" style={{ color: colors.onSurface }}>
                 {t('total')}
               </Text>
               <Text className="font-bold text-lg" style={{ color: colors.primary }}>
                 {orderData.total.toLocaleString()} {t('currency_xaf')}
               </Text>
             </View>
           </View>

            <View className="mt-4 flex-row items-center">
              <MaterialCommunityIcons
                name={
                  orderData.paymentMethod === 'credit_card' ? 'credit-card' :
                  orderData.paymentMethod === 'cash' ? 'cash' : 'cellphone'
                }
                size={20}
                color={colors.onSurfaceVariant}
              />
              <Text className="ml-2" style={{ color: colors.onSurface }}>
                {t('paid_with')} {orderData.paymentMethod === 'credit_card' ? t('credit_card') :
                          orderData.paymentMethod === 'cash' ? t('cash') : t('mobile_payment')}
              </Text>
            </View>
          </View>

<<<<<<< HEAD
          {/* Order Actions */}
          <View className="px-4 pb-4">
            {status === 'pending' && (
              <View className="space-y-3">
                <Button
                  mode="contained"
                  onPress={() => handleStatusChange('preparing')}
                  className="mb-3"
                  contentStyle={{
                    height: buttonHeight,
                    flexDirection: 'row-reverse',
                  }}
                  labelStyle={{
                    fontSize: fontSize,
                    fontWeight: '600',
                  }}
                  icon="check"
                >
                  {t('accept_order')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleStatusChange('cancelled')}
                  style={{
                    borderColor: colors.error,
                  }}
                  contentStyle={{
                    height: buttonHeight,
                    flexDirection: 'row-reverse',
                  }}
                  textColor={colors.error}
                  labelStyle={{
                    fontSize: fontSize,
                    fontWeight: '600',
                  }}
                  icon="close"
                >
                  {t('reject_order')}
                </Button>
              </View>
            )}

            {status === 'preparing' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('ready')}
                contentStyle={{
                  height: buttonHeight,
                  flexDirection: 'row-reverse',
                }}
                labelStyle={{
                  fontSize: fontSize,
                  fontWeight: '600',
                }}
                icon="check-all"
                disabled={prepProgress < 1}
              >
                {t('mark_as_ready')}
              </Button>
            )}

            {(status === 'ready' || status === 'cancelled') && (
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                contentStyle={{
                  height: buttonHeight,
                  flexDirection: 'row-reverse',
                }}
                labelStyle={{
                  fontSize: fontSize,
                  fontWeight: '600',
                }}
                icon="arrow-left"
              >
                {t('back_to_orders')}
              </Button>
            )}
=======
          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              mode="contained"
              onPress={() => {
                /* Handle accept order */
              }}
              className="rounded-xl"
            >
              Accept Order
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                /* Handle reject order */
              }}
              className="rounded-xl"
              textColor="red"
            >
              Reject Order
            </Button>
>>>>>>> origin/Customer_Setup
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderDetailsScreen;
