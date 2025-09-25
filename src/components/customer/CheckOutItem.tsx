import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CartItem } from '@/src/stores/customerStores/cartStore';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import EditCartItemContent from './EditCartItemContent';
import { useTranslation } from 'react-i18next';

type CheckOutItemProps = CartItem;

const CheckOutItem = memo<CheckOutItemProps>(
  ({ id, menuItem, quantity, specialInstructions, addedAt }) => {
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
          addedAt={addedAt}
        />,
        {
          snapPoints: ['50%', '75%'],
          enablePanDownToClose: true,
          title: t('edit_item'),
          showHandle: true,
          backdropOpacity: 0.4,
        },
      );
    }, [
      present,
      id,
      menuItem,
      quantity,
      specialInstructions,
      dismiss,
      addedAt,
      t,
    ]);

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
        {/* Main row with image, details, quantity, and edit button */}
        <View className="flex-row items-center">
          {/* Food Image */}
          <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
            {menuItem.image ? (
              <Image
                source={{ uri: menuItem.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-xs">No Image</Text>
              </View>
            )}
          </View>

          {/* Middle Column - Food Name and Price */}
          <View className="flex-1 mx-3">
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 16,
              }}
              numberOfLines={1}
            >
              {menuItem.name}
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              {parseFloat(menuItem.price || '0').toLocaleString('fr-FR')} FCFA
            </Text>
          </View>

          {/* Right Column - Quantity and Edit Button */}
          <View className="items-end">
            {/* Quantity Box */}
            <View
              className="rounded-full px-2 py-1 mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-bold" style={{ color: colors.onPrimary }}>
                {quantity}x
              </Text>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={handleEditPress}
              className="rounded-lg px-3 py-1"
              style={{ backgroundColor: colors.surfaceVariant }}
              activeOpacity={0.7}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: colors.primary }}
              >
                {t('edit')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Instructions */}
        {specialInstructions ? (
          <View className="mt-3 pt-2 border-t border-gray-200">
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontSize: 14,
                fontStyle: 'italic',
              }}
            >
              {t('note_prefix')} {specialInstructions}
            </Text>
          </View>
        ) : null}
      </View>
    );
  },
);

CheckOutItem.displayName = 'CheckOutItem';

export default CheckOutItem;
