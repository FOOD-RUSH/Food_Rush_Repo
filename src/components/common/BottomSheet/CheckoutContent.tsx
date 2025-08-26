import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface CheckoutContentProps {
  onDismiss: () => void;
  onConfirm: () => void;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  onDismiss,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
      }}
    >
      <Text
        style={{
          color: colors.onSurface,
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        {t('checkout_confirmation')}
      </Text>

      {/* Google-style Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 8,
          paddingTop: 8,
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
              color: colors.primary,
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: 0.1,
            }}
          >
            {t('cancel')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onConfirm();
            onDismiss();
          }}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: colors.primary,
            minWidth: 100,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: colors.onPrimary,
              fontSize: 14,
              fontWeight: '500',
              letterSpacing: 0.1,
            }}
          >
            {t('place_order')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutContent;
