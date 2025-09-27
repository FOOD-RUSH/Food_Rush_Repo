import { MaterialIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';

interface LogoutContentProps {
  onDismiss: () => void;
  onConfirmLogout: () => void;
}

const LogoutContent: React.FC<LogoutContentProps> = ({
  onDismiss,
  onConfirmLogout,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const handleConfirmAndDismiss = () => {
    onConfirmLogout();
    onDismiss();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Content */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            backgroundColor: colors.errorContainer,
          }}
        >
          <MaterialIcon             name="logout"
            size={32}
            color={colors.onErrorContainer}
          />
        </View>

        <Text
          style={{
            color: colors.onSurface,
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
            paddingHorizontal: 8,
          }}
        >
          {t('logout_confirmation')}
        </Text>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.outline + '30',
        }}
      >
        <TouchableOpacity
          onPress={onDismiss}
          style={{
            flex: 1,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.outline,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {t('cancel')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirmAndDismiss}
          style={{
            flex: 1,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: colors.error,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            shadowColor: colors.error,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: colors.onError,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {t('log_out')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoutContent;
