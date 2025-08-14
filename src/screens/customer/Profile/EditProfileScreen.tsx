import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '@/assets/images';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import InputField from '@/src/components/customer/InputField';
import { Dropdown } from 'react-native-element-dropdown';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Button } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';

const EditProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EditProfile'>) => {
  const LoggedInUser = useAuthUser();

  interface GenderProps {
    id: number;
    type: string;
    label: string;
  }

  const gender: GenderProps[] = [
    { id: 1, type: 'male', label: 'Male' },
    { id: 2, type: 'female', label: 'FeMale' },
  ];

  const [fullName, setFullName] = useState(
    LoggedInUser?.profile?.userName || '',
  );
  const [userName, setUserName] = useState(
    LoggedInUser?.profile?.userName || '',
  );
  const [email, setEmail] = useState(LoggedInUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(
    LoggedInUser?.profile?.phoneNumber || '',
  );
  const [genderValue, setGenderValue] = useState('Male');

  const handleUpdate = () => {
    console.log({
      fullName,
      userName,
      email,
      phoneNumber,
      gender: genderValue,
    });
    // Here you would typically call an API to update the user profile
  };

  return (
    <CommonView>
      <ScrollView
        className="h-full bg-white pb-14  mt-[-39px] pt-4 pb-15"
        showsVerticalScrollIndicator={false}
      >
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
        <InputField
          placeholder="Enter Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <InputField
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
        />
        <InputField placeholder="mm/dd/yy" />
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          rightIcon={<Ionicons size={23} name="mail-outline" />}
        />
        <Dropdown
          data={gender}
          valueField={'type'}
          labelField={'label'}
          value={genderValue}
          style={{
            height: 62,
            borderColor: '#e5e7eb',
            borderRadius: 8,
            paddingHorizontal: 10,
            backgroundColor: '#e5e7eb',
            margin: 9,
          }}
          itemTextStyle={{ color: 'gray' }}
          containerStyle={{ backgroundColor: '#d1d5db' }}
          selectedTextStyle={{ color: 'gray' }}
          onChange={(item) => setGenderValue(item.type)}
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
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </ScrollView>
      <Button
        mode="contained"
        buttonColor={'#007Aff'}
        textColor="white"
        contentStyle={{ paddingVertical: 12 }}
        style={{ borderRadius: 25, marginTop: 16 }}
        labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
        className="active:opacity-75 mb-2"
        onPress={handleUpdate}
      >
        update
      </Button>
    </CommonView>
  );
};

export default EditProfileScreen;
