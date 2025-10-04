import { MaterialIcon } from '@/src/components/common/icons';
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

  const handleConfirmAndDismiss = () => {
    onConfirm();
    onDismiss();
  };

  return (
    <View style={{ flex: 1, pointerEvents: 'auto' }}>
      {/* Content */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            backgroundColor: colors.primaryContainer,
          }}
        >
          <MaterialIcon
            name="shopping-cart-checkout"
            size={24}
            color={colors.onPrimaryContainer}
          />
        </View>

        <Text
          style={{
            color: colors.onSurface,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            paddingHorizontal: 8,
          }}
        >
          {t('checkout_confirmation')}
        </Text>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.outline + '30',
          pointerEvents: 'auto',
        }}
      >
        <TouchableOpacity
          onPress={onDismiss}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
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
              fontSize: 14,
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
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: colors.onPrimary,
              fontSize: 14,
              fontWeight: '600',
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
