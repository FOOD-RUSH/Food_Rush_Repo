import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { lightTheme } from '@/src/config/theme';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Button, Card, TouchableRipple } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import CheckOutItem from '@/src/components/customer/CheckOutItem';
import { images } from '@/assets/images';

const CheckOutScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Checkout'>) => {
  return (
    <CommonView>
      <ScrollView
        className="px-2 py-3 h-full mt-[-39px] flex-col "
        showsVerticalScrollIndicator={false}
      >
        {/* Adress Card */}
        <Card
          mode="outlined"
          style={{
            marginVertical: 12,
            borderColor: 'white',
            boxShadow: '0px 1px 5px 3px  rgba(0, 0, 0, 0.15)',
          }}
        >
          <Card.Content className=" ">
            <Text className="font-semibold text-[17px] ">Delivery To</Text>
            <View className="h-[1px] bg-gray-400  my-3" />
            <View className="flex-row items-center justify-between">
              <Ionicons name="location" color={'#007aff'} size={30} />
              <View className="flex-col mx-2">
                <View className="flex-row mb-2">
                  <Text className="text-[18px] font-semibold mr-2">Home</Text>
                  <Text className="flex bg-blue-300 rounded-md px-2 py-1 text-primaryColor text-xs">
                    Default
                  </Text>
                </View>
                <Text className="text-center text-gray-400 text-[16px]">
                  Time Square NYC, Manhattan
                </Text>
              </View>
              <TouchableOpacity className="rounded-full p-1 active:bg-gray-600">
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={25}
                  color={'#007aff'}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Order Summary */}

        <Card
          mode="outlined"
          style={{
            marginVertical: 12,
            borderColor: 'white',
            boxShadow: '0px 1px 5px 3px  rgba(0, 0, 0, 0.15)',
          }}
        >
          <View className="py-5 px-2">
            <View className="flex-row justify-between mb-3 px-1">
              <Text className="font-semibold text-[17px] ">Order Summary</Text>
              <TouchableOpacity
                onPress={() => {}}
                activeOpacity={0.8}
                className="border-[2px] border-solid border-primaryColor rounded-full px-3 justify-center"
              >
                <Text className="text-primaryColor font-semibold text-[12px] text-center ">
                  Add Items
                </Text>
              </TouchableOpacity>
            </View>
            <View className="h-[1px] bg-gray-300 my-2" />
            <CheckOutItem
              foodId={'MAMA COC'}
              restaurantID={'Vegetable'}
              foodName={'wfgf'}
              foodPrice={0}
              quantity={0}
              foodImage={images.customerImg}
            />
          </View>

          {/*Flatlist with component*/}
        </Card>

        {/* payement section */}

        <Card
          style={{
            marginVertical: 12,
            borderColor: 'white',
            boxShadow: '0px 1px 5px 3px  rgba(0, 0, 0, 0.15)',
          }}
          mode="outlined"
        >
          <View className="px-3 py-3 flex-col ">
            <View className="flex-row justify-between space-x-2 ">
              <Ionicons name="card-outline" color={'#007aff'} size={27} />
              <View className="flex-row space-x-1">
                <Text className="text-primaryColor text-[14px] mr-1 align-middle">
                  E-Wallet
                </Text>
                <TouchableOpacity className="rounded-full active:bg-gray-500 p-1">
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={20}
                    color={lightTheme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="h-[1px] bg-gray-300 my-3" />

            <View className="flex-row justify-between space-x-2">
              <MaterialIcons name="discount" color={'#007aff'} size={27} />
              <View className="flex-row space-x-1">
                <Text className="text-primaryColor text-[14px] mr-1  align-middle">
                  E-Wallet
                </Text>
                <TouchableOpacity className="rounded-full active:bg-gray-500 p-1">
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={20}
                    color={lightTheme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        {/* money totals */}

        <Card
          style={{
            marginVertical: 12,
            borderColor: 'white',
            boxShadow: '0px 1px 5px 3px  rgba(0, 0, 0, 0.15)',
          }}
          mode="outlined"
        >
          <View className="flex-col px-3 py-6 ">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-900 ">SubTotal: </Text>
              <Text className="font-bold ">500 XAF </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 ">Delivery Fee: </Text>
              <Text className="font-bold "> 2300 XAF</Text>
            </View>
            <Seperator backgroundColor="bg-gray-300" />
            <View className="flex-row justify-between items-center ">
              <Text className="text-primaryColor ">Discount: </Text>
              <Text className="font-bold text-primaryColor "> 2300 XAF</Text>
            </View>
          </View>
        </Card>
        {/* button */}
      </ScrollView>
      <TouchableOpacity className="bg-primaryColor rounded-full py-4 px-6 my-4">
        <Text className="text-[16px] font-semibold text-center text-white">
          Place Order - 25600FCFA
        </Text>
      </TouchableOpacity>
    </CommonView>
  );
};

export default CheckOutScreen;
