import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar } from 'react-native-paper';
import { icons, images } from '@/assets/images';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import RowView from '@/src/components/common/RowView';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';

const ProfileHomeScreen = ({
  navigation,
}: CustomerProfileStackScreenProps<'ProfileHome'>) => {
  return (
    <CommonView>
      <ScrollView
        className="flex-1 h-full bg-white py-3"
        showsVerticalScrollIndicator={false}
      >
        {/* profile pic and stuff */}
        <View className="flex-row justify-between items-center mb-3 px-3">
          <Avatar.Image
            source={icons.ProfilePlogo}
            size={100}
            className="bg-gray-500"
          />
          <View className="flex-col items-center  justify-center flex-1 mx-2">
            <Text className="font-semibold text-[18px]">Dev-Guy UIX</Text>
            <Text className="text-[15px]">+237 650 100 131</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
          >
            <AntDesign name="edit" color={'#007aff'} size={25} />
          </TouchableOpacity>
        </View>
        {/* divider */}
        <View className="h-[1px] bg-gray-200 mx-3 my-4" />
        <RowView
          title=" My Favorite Restaurants"
          onPress={() => {
            navigation.navigate('FavoriteRestaurantScreen');
          }}
          leftIconName="fast-food-outline"
        />
        <RowView
          title=" Special Offers and Promo"
          onPress={() => {}}
          leftIconName="gift-outline"
        />
        <RowView
          title="Payment Method"
          onPress={() => {
            navigation.navigate('PaymentMethods');
          }}
          leftIconName="card-outline"
        />
        <View className="h-[1px] bg-gray-200 mx-3 mb-4" />
        <RowView
          title="Profile"
          onPress={() => {
            navigation.navigate('EditProfile');
          }}
          leftIconName="log-in-outline"
        />
        <RowView
          title="Address"
          onPress={() => {}}
          leftIconName="location-outline"
        />
        {/* notification settings */}
        <RowView
          title="Notification"
          onPress={() => {}}
          leftIconName="notifications-outline"
        />
        <RowView
          title="Security"
          onPress={() => {}}
          leftIconName="shield-checkmark-outline"
        />
        <RowView
          title="Help"
          onPress={() => {
            navigation.navigate('Help', { screen: 'ContactUs' });
          }}
          leftIconName="shield-checkmark-outline"
        />
        <RowView
          title="Language Screen"
          onPress={() => {
            navigation.navigate('LanguageScreen');
          }}
          leftIconName="language-outline"
        />
      </ScrollView>
    </CommonView>
  );
};

export default ProfileHomeScreen;
