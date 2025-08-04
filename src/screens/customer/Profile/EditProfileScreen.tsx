import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '@/assets/images';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import InputField from '@/src/components/customer/InputField';
import { Dropdown } from 'react-native-element-dropdown';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Button } from 'react-native-paper';

const EditProfileScreen = ({
  navigation,
}: RootStackScreenProps<'EditProfile'>) => {
  interface GenderProps {
    id: number;
    type: string;
    label: string;
  }

  const gender: GenderProps[] = [
    { id: 1, type: 'male', label: 'Male' },
    { id: 2, type: 'female', label: 'FeMale' },
  ];
  const [selectedValue, setSelectedValue] = useState<string>('Male');
  return (
    <SafeAreaView className="h-full bg-white flex">
      <ScrollView className="h-full bg-white flex px-3 ">
        <View className="flex-column px-2 justify-center items-center">
          <View className="relative mb-3 ">
            <Image
              className="h-[100px] w-[100px] object-cover relative"
              source={icons.ProfilePlogo}
            />
            <MaterialIcons
              name="edit"
              color={'#007aff'}
              size={20}
              className="absolute bottom-1 right-2"
            />
          </View>
        </View>
        <InputField placeholder="Enter Name" />
        <InputField placeholder="User Name" />
        <InputField placeholder="mm/dd/yy" />
        <InputField
          placeholder="Email"
          rightIcon={<Ionicons size={23} name="mail-outline" />}
        />
        <Dropdown
          data={gender}
          valueField={'type'}
          labelField={'label'}
          value={selectedValue}
          style={{
            height: 62,
            borderColor: 'gray',
            borderRadius: 8,
            paddingHorizontal: 10,
            backgroundColor: '#d1d5db',
            margin: 9,
          }}
          containerStyle={{ backgroundColor: '#d1d5db' }}
          onChange={() => setSelectedValue((item) => item)}
        />
        <InputField
          leftIcon={
            <>
              <View className="flex-row items-center">
                <Text className="text-2xl">🇨🇲</Text>
                <MaterialIcons name="keyboard-arrow-down" size={25} />
              </View>
            </>
          }
          placeholder="Phone Number"
        />
        <Button
          mode="contained"
          buttonColor={'#007Aff'}
          textColor="white"
          contentStyle={{ paddingVertical: 12 }}
          style={{ borderRadius: 25, marginTop: 16 }}
          labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
          className="active:opacity-75"
        >
          update
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
