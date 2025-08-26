import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { CartItem } from '@/src/stores/customerStores/cartStore';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import EditCartItemContent from './EditCartItemContent';
import { useTranslation } from 'react-i18next';

interface CheckOutItemProps extends CartItem {}

const CheckOutItem = memo<CheckOutItemProps>(
  ({ id, menuItem, ItemtotalPrice, quantity, specialInstructions }) => {
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
      <View
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
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Item Image */}
          {menuItem.image ? (
            <Image
              source={menuItem.image}
              // src= {menuItem.image}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                backgroundColor: colors.surfaceVariant,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                backgroundColor: colors.surfaceVariant,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons
                name="fastfood"
                size={24}
                color={colors.onSurfaceVariant}
              />
            </View>
          )}

          {/* Item Details */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            {/* Name and Edit Button */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color: colors.onSurface,
                  fontSize: 16,
                  fontWeight: '600',
                  flex: 1,
                  marginRight: 8,
                }}
                numberOfLines={2}
              >
                {menuItem.name}
              </Text>

              {/* Edit Icon */}
              <TouchableOpacity
                onPress={handleEditPress}
                style={{
                  padding: 6,
                  borderRadius: 12,
                  backgroundColor: colors.primaryContainer,
                }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="edit" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Special Instructions */}
            {specialInstructions && (
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 12,
                  fontStyle: 'italic',
                  marginBottom: 8,
                }}
                numberOfLines={2}
              >
                {t('note_prefix')}
                {specialInstructions}
              </Text>
            )}

            {/* Quantity and Price Row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Quantity Badge */}
              <View
                style={{
                  backgroundColor: colors.secondaryContainer,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: colors.onSecondaryContainer,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {t('quantity_prefix')}
                  {quantity}
                </Text>
              </View>

              {/* Unit Price */}

              {/* Total Price */}
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                {ItemtotalPrice.toLocaleString('fr-FR')}
                {t('fcfa_suffix')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

CheckOutItem.displayName = 'CheckOutItem';

export default CheckOutItem;
