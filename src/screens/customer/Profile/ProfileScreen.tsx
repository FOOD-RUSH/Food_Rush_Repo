import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Avatar, Switch } from 'react-native-paper';
import { images } from '@/assets/images';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import RowView from '@/src/components/common/RowView';

const ProfileScreen = () => {
  return (
    <CommonView>
      <ScrollView
        className="flex h-full bg-white pt-0 mt-0"
        showsVerticalScrollIndicator={false}
      >
        {/* profile pic and stuff */}
        <View className="flex-row justify-between items-center mb-3">
          <Avatar.Image
            source={images.customerImg}
            size={100}
            className="bg-gray-500"
          />
          <View className="flex-col items-center  justify-center flex-1 mx-2">
            <Text className="font-semibold text-[18px]">Dev-Guy UIX</Text>
            <Text className="text-[15px]">+237 650 100 131</Text>
          </View>
          <AntDesign name="edit" color={'#007aff'} />
        </View>
        {/* divider */}
        <View className="h-[1px] bg-gray-400 mx-3 my-4" />
        <RowView
          title=" My Favorite Restaurants"
          onPress={() => {}}
          leftIconName="fast-food-outline"
        />
        <RowView
          title=" Special Offers and Promo"
          onPress={() => {}}
          leftIconName="gift-outline"
        />
        <RowView
          title="Payment Method"
          onPress={() => {}}
          leftIconName="card-outline"
        />
        <View className="h-[1px] bg-gray-400 mx-3 mb-4" />
        <RowView
          title="Profile"
          onPress={() => {}}
          leftIconName="log-in-outline"
        />
        <RowView
          title="Address"
          onPress={() => {}}
          leftIconName="location-outline"
        />
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
          title="Payment Method"
          onPress={() => {}}
          leftIconName="card-outline"
        />
        <View className="flex-row justify-between">
          <View className="flex-row flex-1 ">
            <Ionicons name="eye-sharp" />
            <Text className="Dark Mode" />
          </View>
          <Switch value={false} />
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default ProfileScreen;
