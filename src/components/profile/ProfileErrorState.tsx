import { IoniconsIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';

interface ProfileErrorStateProps {
  error: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({
  error,
  onRetry,
  showRetryButton = true,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.errorContainer,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <IoniconsIcon
          name="alert-circle"
          size={32}
          color={colors.onErrorContainer}
        />
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: colors.onSurface,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {t('unable_to_load_profile')}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 20,
        }}
      >
        {error}
      </Text>

      {showRetryButton && onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          buttonColor={colors.primary}
          textColor="white"
          contentStyle={{ paddingVertical: 8, paddingHorizontal: 24 }}
          style={{ borderRadius: 25 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
          icon="refresh"
        >
          {t('try_again')}
        </Button>
      )}
    </View>
  );
};

export default ProfileErrorState;
