import React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ProfileLoadingStateProps {
  message?: string;
  showIcon?: boolean;
}

const ProfileLoadingState: React.FC<ProfileLoadingStateProps> = ({
  message,
  showIcon = true,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  message = message || t('loading_your_profile');

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      {showIcon && (
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primaryContainer,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name="person" size={32} color={colors.onPrimaryContainer} />
        </View>
      )}

      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginBottom: 16 }}
      />

      <Text
        style={{
          fontSize: 16,
          color: colors.onSurface,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {message}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
          opacity: 0.7,
        }}
      >
        {t('please_wait_while_we_fetch_your_information')}
      </Text>
    </View>
  );
};

export default ProfileLoadingState;
