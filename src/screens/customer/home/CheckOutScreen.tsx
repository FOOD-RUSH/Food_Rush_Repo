import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Card } from 'react-native-paper';
import Seperator from '@/src/components/common/Seperator';
import CheckOutItem from '@/src/components/customer/CheckOutItem';
import { images } from '@/assets/images';
import { useTheme } from '@/src/hooks/useTheme';

const CheckOutScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Checkout'>) => {
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-text';
  const secondaryTextColor =
    theme === 'light' ? 'text-gray-400' : 'text-text-secondary';
  const primaryColor = theme === 'light' ? '#007aff' : '#3b82f6';
  const dividerColor = theme === 'light' ? 'bg-gray-300' : 'bg-gray-700';

  return (
    <CommonView>
      <ScrollView
        className="px-2 py-4 flex-1 mt-[-39px] flex-col"
        showsVerticalScrollIndicator={false}
      >
        {/* Adress Card */}
        <Card
          mode="outlined"
          style={{
            marginVertical: 12,
            borderColor: cardBackgroundColor,
            backgroundColor: cardBackgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
            boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Card.Content>
            <Text className={`font-semibold text-lg ${textColor}`}>
              Delivery To
            </Text>
            <View className={`h-[1px] my-3 ${dividerColor}`} />
            <View className="flex-row items-center justify-between">
              <Ionicons name="location" color={primaryColor} size={30} />
              <View className="flex-col mx-2">
                <View className="flex-row mb-2 items-center">
                  <Text className={`text-lg font-semibold mr-2 ${textColor}`}>
                    Home
                  </Text>
                  <Text
                    className="flex bg-blue-300 rounded-md px-2 py-1 text-xs"
                    style={{ color: primaryColor }}
                  >
                    Default
                  </Text>
                </View>
                <Text className={`text-center text-base ${secondaryTextColor}`}>
                  Time Square NYC, Manhattan
                </Text>
              </View>
              <TouchableOpacity className="rounded-full p-1 active:bg-gray-600">
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={25}
                  color={primaryColor}
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
            borderColor: cardBackgroundColor,
            backgroundColor: cardBackgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
            boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          <View className="py-5 px-2">
            <View className="flex-row justify-between mb-3 px-1">
              <Text className={`font-semibold text-lg ${textColor}`}>
                Order Summary
              </Text>
              <TouchableOpacity
                onPress={() => {}}
                activeOpacity={0.8}
                className="border-[2px] border-solid rounded-full px-3 justify-center"
                style={{ borderColor: primaryColor }}
              >
                <Text
                  className="font-semibold text-xs text-center"
                  style={{ color: primaryColor }}
                >
                  Add Items
                </Text>
              </TouchableOpacity>
            </View>
            <View className={`h-[1px] my-2 ${dividerColor}`} />
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
            borderColor: cardBackgroundColor,
            backgroundColor: cardBackgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
            boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
          }}
          mode="outlined"
        >
          <View className="px-3 py-3 flex-col">
            <View className="flex-row justify-between space-x-2">
              <Ionicons name="card-outline" color={primaryColor} size={27} />
              <View className="flex-row space-x-1 items-center">
                <Text
                  className="text-sm mr-1 align-middle"
                  style={{ color: primaryColor }}
                >
                  E-Wallet
                </Text>
                <TouchableOpacity className="rounded-full active:bg-gray-500 p-1">
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={20}
                    color={primaryColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className={`h-[1px] my-3 ${dividerColor}`} />

            <View className="flex-row justify-between space-x-2">
              <MaterialIcons name="discount" color={primaryColor} size={27} />
              <View className="flex-row space-x-1 items-center">
                <Text
                  className="text-sm mr-1 align-middle"
                  style={{ color: primaryColor }}
                >
                  Promo Code
                </Text>
                <TouchableOpacity className="rounded-full active:bg-gray-500 p-1">
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={20}
                    color={primaryColor}
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
            borderColor: cardBackgroundColor,
            backgroundColor: cardBackgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
            boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
          }}
          mode="outlined"
        >
          <View className="flex-col px-3 py-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className={`${textColor}`}>SubTotal:</Text>
              <Text className={`font-bold ${textColor}`}>500 XAF</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className={`${textColor}`}>Delivery Fee:</Text>
              <Text className={`font-bold ${textColor}`}>2300 XAF</Text>
            </View>
            <Seperator />
            <View className="flex-row justify-between items-center">
              <Text style={{ color: primaryColor }}>Discount:</Text>
              <Text className="font-bold" style={{ color: primaryColor }}>
                2300 XAF
              </Text>
            </View>
          </View>
        </Card>
        {/* button */}
      </ScrollView>
      <View className='pb-[10px] pt-2'>
        <TouchableOpacity
        className="rounded-full py-4 px-6"
        style={{ backgroundColor: primaryColor }}
      >
        <Text className="text-base font-semibold text-center text-white mb-">
          Place Order - 25600FCFA
        </Text>
      </TouchableOpacity>
      </View>
      
    </CommonView>
  );
};

export default CheckOutScreen;
