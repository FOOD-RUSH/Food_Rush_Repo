import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CartItem } from '@/src/stores/customerStores/cartStore';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import EditCartItemContent from './EditCartItemContent';
import { useTranslation } from 'react-i18next';

interface CheckOutItemProps extends CartItem {}

const CheckOutItem = memo<CheckOutItemProps>(
  ({ id, menuItem, quantity, specialInstructions }) => {
    const { colors } = useTheme();
    const { present, dismiss } = useBottomSheet();
    const { t } = useTranslation('translation');

    // Handle edit item press
    const handleEditPress = useCallback(() => {
      present(
        <EditCartItemContent
          id={id}
          menuItem={menuItem}
          quantity={quantity}
          specialInstructions={specialInstructions}
          onDismiss={dismiss}
          
        />,
        {
          snapPoints: ['50%', '75%'],
          enablePanDownToClose: true,
          title: t('edit_item'),
          showHandle: true,
          backdropOpacity: 0.4,
        },
      );
    }, [present, id, menuItem, quantity, specialInstructions, dismiss, t]);

    return (
      <TouchableOpacity
        onPress={handleEditPress}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.outline + '20',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <View>
          <Text
            style={{
              color: colors.onSurface,
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
            }}
            
          >
            {menuItem.name}
          </Text>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: 14,
            }}
          >
            {t('quantity')}: {quantity}
          </Text>
          {specialInstructions ? (
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 14,
                fontStyle: 'italic',
                marginTop: 4,
              }}
            >
              {t('note_prefix')} {specialInstructions}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  },
);

CheckOutItem.displayName = 'CheckOutItem';

export default CheckOutItem;
