import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface ResettingPasswordProps {
  isPending: boolean;
}

const ResettingPassword: React.FC<ResettingPasswordProps> = ({ isPending }) => {
  const { t } = useTranslation('translation');

  return (
    <View className="items-center p-6">
      <Image
        source={require('@/assets/images/Food Emojies/🍔02.png')}
        className="w-32 h-32 mb-6"
      />
      <Text className="text-2xl font-bold text-center mb-4">
        {t('resetting_password')}
      </Text>
      <Button mode="contained" loading={isPending} disabled={isPending}>
        {t('please_wait')}
      </Button>
    </View>
  );
};

export default ResettingPassword;
