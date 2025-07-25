import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Searchbar, Chip, Badge, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import CommonView from '@/src/components/common/CommonView';

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

  const OrderCard = React.memo(({ item, index }: { item: Order; index: number }) => {
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
          onPress={() => {/* Navigate to order details */}}
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
  });

  OrderCard.displayName = 'OrderCard';

  return (
    <CommonView>
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">Orders</Text>
          <Text className="text-gray-500 mt-2">Manage your restaurant orders</Text>
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
          {['all', 'pending', 'preparing', 'ready', 'delivered'].map((filter) => (
            <Chip
              key={filter}
              selected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
              className="mr-2"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Chip>
          ))}
        </ScrollView>

        <FlatList
          data={orders}
          renderItem={({ item, index }) => <OrderCard item={item} index={index} />}
          keyExtractor={item => item.id}
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
  route 
}: { 
  route: RouteProp<OrderDetailsParams, 'OrderDetails'> 
}) => {
  const { orderId } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const orderItems: OrderItem[] = [
    { quantity: 2, name: "Burger", price: 25.99 },
    { quantity: 1, name: "Fries", price: 19.99 },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Order Status */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="text-2xl font-bold text-gray-800">Order #{orderId}</Text>
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="clock-outline" size={20} color="#9CA3AF" />
              <Text className="text-gray-500 ml-2">Received at 10:30 AM</Text>
            </View>
          </View>

          {/* Customer Details */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="text-lg font-semibold mb-2">Customer Details</Text>
            <View className="space-y-2">
              <Text className="text-gray-600">John Doe</Text>
              <Text className="text-gray-600">+1 234 567 890</Text>
              <Text className="text-gray-600">123 Street Name, City</Text>
            </View>
          </View>

          {/* Order Items */}
          <View className="bg-white p-4 rounded-xl mb-4">
            <Text className="text-lg font-semibold mb-2">Order Items</Text>
            {orderItems.map((item, index) => (
              <View key={index} className="flex-row justify-between py-2">
                <View className="flex-row items-center">
                  <Text className="text-gray-600">{item.quantity}x</Text>
                  <Text className="text-gray-800 ml-2">{item.name}</Text>
                </View>
                <Text className="font-semibold">${item.price}</Text>
              </View>
            ))}
            <Divider className="my-2" />
            <View className="flex-row justify-between mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-blue-500">$45.98</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              mode="contained"
              onPress={() => {/* Handle accept order */}}
              className="rounded-xl"
            >
              Accept Order
            </Button>
            <Button
              mode="outlined"
              onPress={() => {/* Handle reject order */}}
              className="rounded-xl"
              textColor="red"
            >
              Reject Order
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  );
};

export default OrderDetailsScreen;
