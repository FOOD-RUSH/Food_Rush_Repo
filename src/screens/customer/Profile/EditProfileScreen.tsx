import { useTranslation } from 'react-i18next';
import { View, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { icons } from '@/assets/images';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import InputField from '@/src/components/customer/InputField';
import { RootStackScreenProps } from '@/src/navigation/types';
import { Button, useTheme } from 'react-native-paper';
import CommonView from '@/src/components/common/CommonView';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { useUpdateProfile } from '@/src/hooks/customer/useAuthhooks';

const EditProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EditProfile'>) => {
  const { t } = useTranslation('translation');
  const LoggedInUser = useAuthUser();

  const [fullName, setFullName] = useState(LoggedInUser?.fullName || '');
  const [email, setEmail] = useState(LoggedInUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(
    LoggedInUser?.phoneNumber || '',
  );

  const { colors } = useTheme();

  const updateProfileMutation = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName,
        email,
        phoneNumber,
      });
      Alert.alert(t('success'), t('profile_updated_successfully'));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert(t('error'), t('failed_to_update_profile' as any));
    }
  };

  return (
    <CommonView>
      <ScrollView
        className="h-full pb-14  mt-[-39px] pt-4 pb-15"
        style={{ backgroundColor: colors.background }}
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
          placeholder={t('enter_name')}
          value={fullName}
          onChangeText={setFullName}
        />
        <InputField placeholder="mm/dd/yy" />
        <InputField
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          leftIcon={<Ionicons size={23} name="mail-outline" color={colors.onSurface} />}
        />
        <InputField
          leftIcon={
            <View className="flex-row items-center">
              <Text className="text-2xl">🇨🇲</Text>
              <MaterialIcons name="keyboard-arrow-down" size={25} color={colors.onSurface} />
            </View>
          }
          placeholder={t('phone_number')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Button
          mode="contained"
          buttonColor={'#007Aff'}
          textColor="white"
          contentStyle={{ paddingVertical: 12 }}
          style={{ borderRadius: 25, marginTop: 16 }}
          labelStyle={{
            fontSize: 16,
            fontWeight: '600',
            color: 'white',
            marginVertical: 8,
          }}
          className="active:opacity-75 mb-2"
          onPress={handleUpdate}
        loading={updateProfileMutation.status === 'pending'}
        disabled={updateProfileMutation.status === 'pending'}
        >
          {t('update')}
        </Button>
      </ScrollView>
    </CommonView>
  );
};

export default EditProfileScreen;
