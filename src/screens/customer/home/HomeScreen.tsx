import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput } from 'react-native-paper';
import { TextButton } from '@/src/components/common/TextButton';
import { CategoryFilters, images } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
import HomeHeader from '@/src/components/customer/HomeHeader';
import FoodItemCard from '@/src/components/customer/FoodItemCard';
import {
  ScrollView,
  TouchableNativeFeedback,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { RestaurantCard } from '@/src/components/customer/RestaurantCard';
import HomeScreenHeaders from '@/src/components/customer/HomeScreenHeaders';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import ClassicFoodCard from '@/src/components/customer/ClassicFoodCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({
  navigation,
}: CustomerHomeStackScreenProps<'HomeScreen'>) => {
  //get user state in the home screen

  const foodItems = [
    {
      id: '1',
      FoodName: 'Egg & Pasta',
      FoodPrice: 650,
      FoodImage: images.onboarding2,
      RestarantName: 'Resto Chez Dialo',
      distanceFromUser: 190,
      DeliveryPrice: 2.5,
      rating: 4.9,
      status: 'PROMO',
    },
    {
      id: '2',
      FoodName: 'BHB',
      FoodPrice: 500,
      FoodImage: images.onboarding2,
      RestarantName: 'Marie Du Boust',
      distanceFromUser: 250,
      DeliveryPrice: 3.0,
      rating: 5.0,
      status: 'PROMO',
    },
    {
      id: '3',
      FoodName: 'Chicken Wings',
      FoodPrice: 750,
      FoodImage: images.onboarding2,
      RestarantName: 'The Chicken Spot',
      distanceFromUser: 180,
      DeliveryPrice: 4.5,
      rating: 4.8,
      status: 'PROMO',
    },
    {
      id: '4',
      FoodName: 'Beef Burger',
      FoodPrice: 900,
      FoodImage: images.onboarding2,
      RestarantName: 'Burger Joint',
      distanceFromUser: 220,
      DeliveryPrice: 4.5,
      rating: 4.6,
      status: 'PROMO',
    },
    {
      id: '5',
      FoodName: 'Margherita Pizza',
      FoodPrice: 800,
      FoodImage: images.onboarding2,
      RestarantName: 'Pizza Palace',
      distanceFromUser: 310,
      DeliveryPrice: 4.5,
      rating: 4.7,
      status: 'PROMO',
    },
  ];

  const restaurantItems = [
    {
      deliveryFee: 500,
      restaurantName: 'Mama Coco',
      distanceFromUser: 1.3,
      estimatedTime: '20-30min',
      rating: 4.2,
      image: images.onboarding3,
      restaurantID: '1',
    },
    {
      deliveryFee: 500,
      restaurantName: 'Mama Coco',
      distanceFromUser: 1.3,
      estimatedTime: '20-30min',
      rating: 4.2,
      image: images.onboarding3,
      restaurantID: '2',
    },
    {
      deliveryFee: 500,
      restaurantName: 'Mama Coco',
      distanceFromUser: 1.3,
      estimatedTime: '20-30min',
      rating: 4.2,
      image: images.onboarding3,
      restaurantID: '3',
    },
    {
      deliveryFee: 500,
      restaurantName: 'Mama Coco',
      distanceFromUser: 1.3,
      estimatedTime: '20-30min',
      rating: 4.2,
      image: images.onboarding3,
      restaurantID: '4',
    },
    {
      deliveryFee: 500,
      restaurantName: 'Mama Coco',
      distanceFromUser: 1.3,
      estimatedTime: '20-30min',
      rating: 4.2,
      image: images.onboarding3,
      restaurantID: '5',
    },
  ];

  // Updated carousel item renderer with proper spacing
  const RenderDiscountCarouselItem = ({ index, animationValue }: any) => {
    const food = foodItems[index];

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.95, 1, 0.95],
      );
      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.8, 1, 0.8],
      );
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View style={[animatedStyle, { paddingHorizontal: 8 }]}>
        <ClassicFoodCard
          id={food.id}
          foodName={food.FoodName}
          foodPrice={food.FoodPrice}
          restaurantName={food.RestarantName}
          distance={food.distanceFromUser}
          rating={food.rating}
          status={food.status}
        />
      </Animated.View>
    );
  };

  return (
    <CommonView >
      <ScrollView
        className="bg-white "
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <HomeHeader />

        <View className="px-1 py-2 bg-white">
          
            <TextInput
              placeholder="Search your craving"
              left={
                <TextInput.Icon
                  icon="magnify"
                  size={30}
                  color={'black'}
                  background={'rgb(202, 221, 240)'}
                  className="pt-3 pl-2"
                />
              }
              mode="outlined"
              outlineStyle={{
                borderColor: '#c4def8',
                borderWidth: 1,
                borderRadius: 20,
              }}
              style={{
                backgroundColor: 'rgb(202, 221, 240)',
                paddingTop: 5,
                paddingBottom: 5,
                paddingRight: 10,
                paddingLeft: 10,
              }}
              placeholderTextColor="#999"
              onPress={() => {navigation.navigate('SearchScreen', { type: 'search' })}}
            />
        </View>
        
        {/* Promotions section */}
        <HomeScreenHeaders title="Promotion" onPress={() => {}} />

        {/* Food sections */}
        <View className=" flex-row flex-wrap">
          {CategoryFilters.map((item) => (
            <CategoryItem image={item.image} title={item.title} key={item.id} />
          ))}
        </View>

        {/* Discounts Guaranteed - Carousel Section */}
        <HomeScreenHeaders title="Discount Guaranteed! 👋" onPress={() => {}} />

        <View style={{ marginBottom: 20}}>
          <Carousel
            width={width * 0.65} // Show approximately 1.8 cards at once
            height={300}
            autoPlay={true}
            autoPlayInterval={4000}
            data={foodItems}
            scrollAnimationDuration={600}
            renderItem={RenderDiscountCarouselItem}
            style={{
              width: width,
              height: 300,
              backgroundColor: '#f5f3ee',
              marginLeft: 0,
            }}
            pagingEnabled={false}
            snapEnabled={true}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 40,
            }}
          />
        </View>

        {/* Recommended for you  */}
        <HomeScreenHeaders title="Recommended for you" onPress={() => {}} />
        {foodItems.map((item) => (
          <FoodItemCard
            key={item.id}
            foodId={item.id}
            restarantId={item.id}
            FoodName={item.FoodName}
            FoodImage={item.FoodImage}
            RestarantName={item.RestarantName}
            distanceFromUser={item.distanceFromUser}
            DeliveryPrice={item.DeliveryPrice}
            FoodPrice={item.FoodPrice}
          />
        ))}

        {/* restaurants near you */}
        <HomeScreenHeaders title="Restaurant near you" onPress={() => {}} />
        {restaurantItems.map((item) => (
          <RestaurantCard
            key={item.restaurantID}
            deliveryFee={item.deliveryFee}
            distanceFromUser={item.distanceFromUser}
            estimatedTime={item.estimatedTime}
            image={item.image}
            rating={item.rating}
            restaurantName={item.restaurantName}
            restaurantID={item.restaurantID}
          />
        ))}
      </ScrollView>
    </CommonView>
  );
};

export default HomeScreen;
