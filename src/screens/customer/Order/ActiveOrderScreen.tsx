import { View, Text, Image, FlatList } from 'react-native';
import React from 'react';
import OrderItemCard, {
  OrderItemCardProps,
} from '@/src/components/customer/OrderItemCard';
import CommonView from '@/src/components/common/CommonView';

const orderItems: OrderItemCardProps[] = [
  {
    foodId: '1',
    restaurantId: '101',
    foodName: 'Pizza Margherita',
    image: require('@/assets/images/apple.png'),
    foodPrice: '12.99',
    quantity: 2,
    orderStatus: 'active',
    distance: '2.4 km'
  },
  {
    foodId: '2',
    restaurantId: '102',
    foodName: 'Spaghetti Carbonara',
    image: require('@/assets/images/apple.png'),
    foodPrice: '10.99',
    quantity: 1,
    orderStatus: 'active',
    distance: '1.8 km'
  },
  {
    foodId: '3',
    restaurantId: '103',
    foodName: 'Caesar Salad',
    image: require('@/assets/images/apple.png'),
    foodPrice: '8.99',
    quantity: 3,
    orderStatus: 'active',
    distance: '3.2 km'
  },
];

const ActiveOrderScreen = () => {
  const renderEmptyComponent = () => (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Image
        source={require('@/assets/images/NoOrdersLight.png')}
        className="w-48 h-48 mb-6"
        resizeMode="contain"
      />
      <Text className="text-gray-500 text-lg text-center">
        No active orders found.
      </Text>
      <Text className="text-gray-400 text-sm text-center mt-2">
        Your active orders will appear here
      </Text>
    </View>
  );

  return (
    <CommonView backgroundColor="#fff">
      <View className="flex-1">
        <FlatList
          data={orderItems}
          renderItem={({ item }) => (
            <OrderItemCard
              foodId={item.foodId}
              restaurantId={item.restaurantId}
              foodName={item.foodName}
              image={item.image}
              foodPrice={item.foodPrice}
              quantity={item.quantity}
              orderStatus={item.orderStatus}
              distance={item.distance}
            />
          )}
          keyExtractor={(item) => item.foodId}
          contentContainerStyle={{ 
            paddingTop: 8,
            paddingBottom: 20,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
    </CommonView>
  );
};

export default ActiveOrderScreen;
