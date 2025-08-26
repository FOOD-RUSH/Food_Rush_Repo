import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const { t } = useTranslation('translation');

  return (
    <View>
      <Text>{t('profile_screen')}</Text>
    </View>
  );
};

export default ProfileScreen;
