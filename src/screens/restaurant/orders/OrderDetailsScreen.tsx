import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { Button, Badge, Divider, ProgressBar } from 'react-native-paper';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantOrdersStackParamList } from '@/src/navigation/types';
import { useGetOrderById, useConfirmOrder, useRejectOrder } from '@/src/hooks/restaurant/useOrderApi';
import { OrderItem } from '@/src/services/restaurant/orderApi';

const OrderDetailsScreen = ({
  route
}: {
  route: RouteProp<RestaurantOrdersStackParamList, 'OrderDetails'>
}) => {
  const navigation = useNavigation<NavigationProp<RestaurantOrdersStackParamList>>();
  const { t } = useTranslation();
  const { orderId } = route.params;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
        await confirmOrderMutation.mutateAsync(orderId);
        setPrepProgress(0);
      } else if (newStatus === 'cancelled') {
        await rejectOrderMutation.mutateAsync(orderId);
      }
    } catch (error: any) {
      console.error('Failed to update order status:', error);

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
          <View className="space-y-3 px-2">
            {status === 'pending' && (
              <View className="space-y-3">
                <Button
                  mode="contained"
                  onPress={() => handleStatusChange('preparing')}
                  style={{
                    height: buttonHeight,
                    justifyContent: 'center',
                    borderRadius: 12,
                    elevation: 2,
                  }}
                  contentStyle={{
                    height: buttonHeight,
                    flexDirection: 'row-reverse',
                  }}
                  labelStyle={{
                    fontSize: fontSize,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                  icon="check"
                >
                  {t('accept_order')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleStatusChange('cancelled')}
                  style={{
                    height: buttonHeight,
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#EF4444',
                  }}
                  contentStyle={{
                    height: buttonHeight,
                    flexDirection: 'row-reverse',
                  }}
                  textColor="#EF4444"
                  labelStyle={{
                    fontSize: fontSize,
                    fontWeight: '600',
                    textAlign: 'center',
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
                style={{
                  height: buttonHeight,
                  justifyContent: 'center',
                  borderRadius: 12,
                  elevation: 2,
                }}
                contentStyle={{
                  height: buttonHeight,
                  flexDirection: 'row-reverse',
                }}
                labelStyle={{
                  fontSize: fontSize,
                  fontWeight: '600',
                  textAlign: 'center',
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
                style={{
                  height: buttonHeight,
                  justifyContent: 'center',
                  borderRadius: 12,
                  borderWidth: 2,
                }}
                contentStyle={{
                  height: buttonHeight,
                  flexDirection: 'row-reverse',
                }}
                labelStyle={{
                  fontSize: fontSize,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
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

export default OrderDetailsScreen;
