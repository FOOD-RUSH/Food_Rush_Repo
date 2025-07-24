import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '@/assets/images';
import InputField from '@/src/components/customer/InputField';
import { TextInput } from 'react-native-paper';

const EditProfileScreen = () => {
  return (
    <SafeAreaView className="h-full bg-white flex">
      <ScrollView className="h-full bg-white flex">
        <View className="flex-column px-2 justify-center items-center">
          <Image
            className="h-[100px] w-[100px] object-cover "
            source={icons.ProfilePlogo}
          />
          <InputField placeholder="Full Name" inputStyle="bg-lightblue" />
          <InputField placeholder="NickName" inputStyle="bg-lightblue" />

          <InputField
            placeholder="Email"
            inputStyle="bg-lightblue"
            right={ <TextInput.Icon icon={'mail'} />}
          />
          <InputField
            placeholder="+237 690 000 000"
            right={
              <>
                <Image className="h-[20px] w-[20px]" src={icons.card} /> 
              </>
            }
          />
          
          {/* npx expo install @react-native-picker/picker */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
