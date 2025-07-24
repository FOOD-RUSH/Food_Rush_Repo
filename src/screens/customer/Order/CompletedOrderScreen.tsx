import { View, Text, FlatList, Image } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import OrderItemCard, {
  OrderItemCardProps,
} from '@/src/components/customer/OrderItemCard';

const orderItems: OrderItemCardProps[] = [
  {
    foodId: '1',
    restaurantId: '101',
    foodName: 'Pizza Margherita',
    image: require('@/assets/images/apple.png'),
    foodPrice: '12.99',
    quantity: 2,
    orderStatus: 'completed',
    distance: '2.4 km'
  },
  {
    foodId: '2',
    restaurantId: '102',
    foodName: 'Spaghetti Carbonara',
    image: require('@/assets/images/apple.png'),
    foodPrice: '10.99',
    quantity: 1,
    orderStatus: 'completed',
    distance: '1.8 km'
  },
  {
    foodId: '3',
    restaurantId: '103',
    foodName: 'Caesar Salad',
    image: require('@/assets/images/apple.png'),
    foodPrice: '8.99',
    quantity: 3,
    orderStatus: 'completed',
    distance: '3.2 km'
  },
];

const CompletedOrderScreen = () => {
  const renderEmptyComponent = () => (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Image
        source={require('@/assets/images/NoOrdersLight.png')}
        className="w-48 h-48 mb-6"
        resizeMode="contain"
      />
      <Text className="text-gray-500 text-lg text-center">
        No completed orders found.
      </Text>
      <Text className="text-gray-400 text-sm text-center mt-2">
        Your completed orders will appear here
      </Text>
    </View>
  );

  return (
    <CommonView backgroundColor="#fff">
      <View className="flex-1 h-full">
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
            marginTop: 0,
            paddingTop: 8,
            elevation: 3,
            paddingBottom: 20,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          className='pt-10 '
        />
      </View>
    </CommonView>
  );
};

export default CompletedOrderScreen;
