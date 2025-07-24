import { View, Text, ScrollView, TouchableNativeFeedback } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { TextInput } from 'react-native-paper';
import PromotionCard from '@/src/components/customer/PromotionCard';
import { TextButton } from '@/src/components/common/TextButton';
import { CategoryFilters, images } from '@/assets/images';
import CategoryItem from '@/src/components/customer/CategoryItem';
import HomeHeader from '@/src/components/customer/HomeHeader';
import { navigate, navigateToSearch } from '@/src/navigation/navigationHelpers';
const HomeScreen = () => {
  //get user state in the home screen
  
  return (
    <CommonView>
      <ScrollView
        className="bg-white "
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <HomeHeader />

        <View className="px-3 py-2 bg-white">
          <TouchableNativeFeedback onPress={navigateToSearch}>
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
              onPress={navigateToSearch}
            />
          </TouchableNativeFeedback>
        </View>

        {/* Promotions section */}

        <View className="space-y-4 mt-4 flex-col">
          <View className="flex-row justify-between">
            <Text className="font-bold text-xl">Promotions</Text>
            <TextButton onPress={() => {}} text="see more" />
          </View>
          <PromotionCard
            percentage={100}
            image={images.customerImg}
            color="#007aff"
            subtitle={'DISCOUNT ONLY'}
            key={4}
            title={'Promotion Card'}
            days={2}
          />
        </View>

        {/* Food sections */}
        <View className=" flex-row flex-wrap">
          {CategoryFilters.map((Category) => (
            <CategoryItem
              image={Category.image}
              title={Category.title}
              key={Category.id}
              onPress={() => {}}
            />
          )).slice(0, 7)}
        </View>
        {/* Recommended for you  */}
        <View className="mx-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold">Recommended for you</Text>
            <TextButton onPress={() => {}} text="see more" />
              {/* {generate the list of food to be a list of 10} */}
          </View>
        </View>

        {/* restaurants near you */}
      </ScrollView>
    </CommonView>
  );
};

export default HomeScreen;
