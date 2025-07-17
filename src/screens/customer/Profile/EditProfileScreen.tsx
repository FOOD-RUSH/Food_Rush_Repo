import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '@/assets/images';
import InputField from '@/src/components/customer/InputField';
import { MaterialIcons } from '@expo/vector-icons';

const EditProfileScreen = () => {
  return (
    <SafeAreaView className="h-full bg-white flex">
      <ScrollView className="h-full bg-white flex">
        <View className="flex-column px-2 justify-center items-center">
          <Image
            className="h-[100px] w-[100px] object-cover "
            src={icons.ProfilePlogo}
          />
          <InputField placeholder="Full Name" inputStyle="bg-lightblue" />
          <InputField placeholder="NickName" inputStyle="bg-lightblue" />

          <InputField
            placeholder="Email"
            inputStyle="bg-lightblue"
            right={<MaterialIcons name="email" />}
          />
          <InputField
            placeholder="+237 690 000 000"
            right={
              <>
                <Image className="h-[20px] w-[20px]" src={icons.card} />
              </>
            }
          />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
