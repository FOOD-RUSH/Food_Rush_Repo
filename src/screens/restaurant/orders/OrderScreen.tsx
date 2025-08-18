import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, ScrollView, Easing } from 'react-native';
import { Searchbar, Chip, Badge, Button, Divider, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import CommonView from '@/src/components/common/CommonView';
import * as Haptics from 'expo-haptics';

// Use your existing navigation types
import { RestaurantOrdersStackParamList } from '@/src/navigation/types';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  time: string;
  paymentMethod: 'credit_card' | 'cash' | 'mobile_payment';
  specialInstructions: string;
  estimatedPrepTime: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  modifications?: string[];
}

const OrderScreen = () => {
  // Use your existing RestaurantOrdersStackParamList type
  const navigation = useNavigation<NavigationProp<RestaurantOrdersStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const orders: Order[] = [
    {
      id: '1',
      customerName: 'John Doe',
      customerPhone: '+1 234 567 890',
      customerAddress: '123 Main St, Apt 4B, New York, NY',
      items: [
        { id: '101', quantity: 1, name: 'Classic Burger', price: 12.99, modifications: ['No onion', 'Extra cheese'] },
        { id: '102', quantity: 2, name: 'Truffle Fries', price: 5.99 }
      ],
      total: 26.97,
      subtotal: 24.97,
      tax: 1.75,
      deliveryFee: 0,
      status: 'pending',
      time: '12:30 PM',
      paymentMethod: 'credit_card',
      specialInstructions: 'Please ring the bell twice',
      estimatedPrepTime: 20
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerPhone: '+1 987 654 321',
      customerAddress: '456 Park Ave, Floor 3, New York, NY',
      items: [
        { id: '103', quantity: 1, name: 'Margherita Pizza', price: 16.99 },
        { id: '104', quantity: 1, name: 'Caesar Salad', price: 8.99, modifications: ['No croutons'] },
        { id: '105', quantity: 1, name: 'Lemonade', price: 3.50 }
      ],
      total: 32.48,
      subtotal: 29.48,
      tax: 2.06,
      deliveryFee: 0,
      status: 'preparing',
      time: '1:00 PM',
      paymentMethod: 'mobile_payment',
      specialInstructions: 'Please make pizza well done',
      estimatedPrepTime: 25
    },
    {
      id: '3',
      customerName: 'Alex Johnson',
      customerPhone: '+1 555 123 4567',
      customerAddress: '789 Broadway, New York, NY',
      items: [
        { id: '106', quantity: 2, name: 'Chicken Wings', price: 14.99, modifications: ['BBQ sauce', 'Extra crispy'] },
        { id: '107', quantity: 1, name: 'Onion Rings', price: 6.99 },
        { id: '108', quantity: 3, name: 'Craft Beer', price: 7.50 }
      ],
      total: 58.47,
      subtotal: 53.47,
      tax: 3.74,
      deliveryFee: 0,
      status: 'ready',
      time: '2:15 PM',
      paymentMethod: 'cash',
      specialInstructions: 'Please pack everything securely',
      estimatedPrepTime: 15
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

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
            <Text className="text-lg font-bold text-gray-900">Order #{item.id}</Text>
            <Badge 
              style={{ backgroundColor: getStatusColor(item.status) }}
              className="text-white"
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
                  {item.paymentMethod === 'credit_card' ? 'Credit Card' :
                   item.paymentMethod === 'cash' ? 'Cash' : 'Mobile Pay'}
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
              <Text className="text-3xl font-bold text-gray-900">Order Dashboard</Text>
              <Text className="text-gray-500 mt-1">Manage and track all orders</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('OrderHistory');
              }}
              className="bg-blue-100 px-4 py-2 rounded-lg"
            >
              <Text className="text-blue-600 font-semibold">History</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Searchbar
            placeholder="Search orders..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            className="mb-8 rounded-xl"
            iconColor="#ed0808ff"
            inputStyle={{ color: '#181717ff',
              height:40,
              paddingVertical:8,
              fontSize:16
             }}
            placeholderTextColor="#4cbb0cff"
            elevation={2}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              height:45,
              marginHorizontal: 4,
              marginBottom: 16
            }}
          />
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
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <MaterialCommunityIcons name="cart-off" size={40} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No orders found</Text>
              </View>
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
  const { orderId } = route.params;
  
  // React hooks must be called at the top level - before any conditional logic
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Mock data - in real app, you'd fetch this by orderId
  const orders: Order[] = [
    {
      id: '1',
      customerName: 'John Doe',
      customerPhone: '+1 234 567 890',
      customerAddress: '123 Main St, Apt 4B, New York, NY',
      items: [
        { id: '101', quantity: 1, name: 'Classic Burger', price: 12.99, modifications: ['No onion', 'Extra cheese'] },
        { id: '102', quantity: 2, name: 'Truffle Fries', price: 5.99 }
      ],
      total: 26.97,
      subtotal: 24.97,
      tax: 1.75,
      deliveryFee: 0,
      status: 'pending',
      time: '12:30 PM',
      paymentMethod: 'credit_card',
      specialInstructions: 'Please ring the bell twice',
      estimatedPrepTime: 20
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerPhone: '+1 987 654 321',
      customerAddress: '456 Park Ave, Floor 3, New York, NY',
      items: [
        { id: '103', quantity: 1, name: 'Margherita Pizza', price: 16.99 },
        { id: '104', quantity: 1, name: 'Caesar Salad', price: 8.99, modifications: ['No croutons'] },
        { id: '105', quantity: 1, name: 'Lemonade', price: 3.50 }
      ],
      total: 32.48,
      subtotal: 29.48,
      tax: 2.06,
      deliveryFee: 0,
      status: 'preparing',
      time: '1:00 PM',
      paymentMethod: 'mobile_payment',
      specialInstructions: 'Please make pizza well done',
      estimatedPrepTime: 25
    },
    {
      id: '3',
      customerName: 'Alex Johnson',
      customerPhone: '+1 555 123 4567',
      customerAddress: '789 Broadway, New York, NY',
      items: [
        { id: '106', quantity: 2, name: 'Chicken Wings', price: 14.99, modifications: ['BBQ sauce', 'Extra crispy'] },
        { id: '107', quantity: 1, name: 'Onion Rings', price: 6.99 },
        { id: '108', quantity: 3, name: 'Craft Beer', price: 7.50 }
      ],
      total: 58.47,
      subtotal: 53.47,
      tax: 3.74,
      deliveryFee: 0,
      status: 'ready',
      time: '2:15 PM',
      paymentMethod: 'cash',
      specialInstructions: 'Please pack everything securely',
      estimatedPrepTime: 15
    },
  ];

  // Find the order by ID
  const orderData = orders.find(order => order.id === orderId);
  
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
          <Text className="text-xl font-bold text-gray-900 mt-4">Order Not Found</Text>
          <Text className="text-gray-600 mt-2">Order #{orderId} could not be found.</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            className="mt-4"
          >
            Go Back
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

  const handleStatusChange = (newStatus: typeof status) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStatus(newStatus);
    if (newStatus === 'preparing') {
      setPrepProgress(0);
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
                <Text className="text-2xl font-bold text-gray-900">Order #{orderId}</Text>
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
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </View>

            {status === 'preparing' && (
              <View className="mt-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600">Preparation Progress</Text>
                  <Text className="text-gray-600">{getEstimatedTimeLeft()} min left</Text>
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
              <Text className="text-lg font-semibold ml-2">Customer Details</Text>
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
                  <Text className="text-amber-800 font-medium ml-2">Special Instructions</Text>
                </View>
                <Text className="text-amber-800 mt-1">{orderData.specialInstructions}</Text>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View className="bg-white p-5 rounded-xl mb-4">
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="food" size={24} color="#4B5563" />
              <Text className="text-lg font-semibold ml-2">Order Items</Text>
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
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="text-gray-700">${orderData.subtotal.toFixed(2)}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Tax</Text>
                <Text className="text-gray-700">${orderData.tax.toFixed(2)}</Text>
              </View>
              
              {orderData.deliveryFee > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Delivery Fee</Text>
                  <Text className="text-gray-700">${orderData.deliveryFee.toFixed(2)}</Text>
                </View>
              )}
              
              <View className="flex-row justify-between mt-2">
                <Text className="font-bold text-lg">Total</Text>
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
                Paid with {orderData.paymentMethod === 'credit_card' ? 'Credit Card' :
                         orderData.paymentMethod === 'cash' ? 'Cash' : 'Mobile Payment'}
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
                  Accept Order
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleStatusChange('cancelled')}
                  className="rounded-lg py-2 border-red-500"
                  textColor="#EF4444"
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  icon="close"
                >
                  Reject Order
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
                Mark as Ready
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
                Mark as Delivered
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
                Back to Orders
              </Button>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};


export default OrderScreen;