import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { images } from '@/assets/images';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';

interface ResettingPasswordProps {
  isPending: boolean;
}

const ResettingPassword: React.FC<ResettingPasswordProps> = ({ isPending }) => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();

  return (
    <View className="items-center p-6">
      <Image source={images.Loading_reset} className="w-40 h-40 mb-6" />

      <Text
        className="text-2xl font-bold text-center mb-4"
        style={{ color: colors.onBackground }}
      >
        {t('resetting_password')}
      </Text>
      <Button mode="contained" loading={isPending} disabled={isPending}>
        <Text className="text-xl" style={{ color: colors.onBackground }}>
          {t('please_wait')}
        </Text>
      </Button>
    </View>
  );
};

export default ResettingPassword;

export const RestPasswordSuccess: React.FC = () => {
  const { colors } = useTheme();
  const navigation =
    useNavigation<AuthStackScreenProps<'ResetPassword'>['navigation']>();

  const handleNavigationToLogin = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SignIn',
          params: { userType: 'customer' },
        },
      ],
    });
  }, [navigation]);

  return (
    <View className="items-center p-6 ">
      <Image source={images.customerImg} className="w-40 h-40 mb-6" />
      <Text
        className="text-2xl font-bold text-center mb-4"
        style={{ color: colors.onBackground }}
      >
        You have successfully reset your password
      </Text>
      <Button mode="contained" onPress={handleNavigationToLogin}>
        <Text className="text-xl" style={{ color: colors.onBackground }}>
          Navigate to Login
        </Text>
      </Button>
    </View>
  );
};
