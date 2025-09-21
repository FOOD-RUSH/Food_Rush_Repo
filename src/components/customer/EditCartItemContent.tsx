import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useCartStore, CartItem } from '@/src/stores/customerStores/cartStore';
import { useTranslation } from 'react-i18next';

interface CartItemProps extends Omit<CartItem, 'ItemtotalPrice'> {
  onDismiss: () => void;
}

const EditCartItemContent: React.FC<CartItemProps> = ({
  id,
  menuItem,
  quantity,
  specialInstructions,
  onDismiss,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [pquantity, setQuantity] = useState(quantity);
  const [instructions, setInstructions] = useState(specialInstructions || '');

  // Cart actions
  const updateItemQuantity = useCartStore((state) => state.modifyCart);
  const removeItem = useCartStore((state) => state.deleteCart);
  const addtoCart = useCartStore((state) => state.addtoCart);

  // Handle quantity changes
  const handleIncrease = useCallback(() => {
    setQuantity((prev) => (prev < 99 ? prev + 1 : prev));
  }, []);

  const handleDecrease = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  // Handle save changes
  const handleSave = useCallback(() => {
    // Update quantity
    updateItemQuantity(id, pquantity);

    // For special instructions, we need to remove and re-add the item
    if (specialInstructions !== instructions) {
      removeItem(id);
      addtoCart(menuItem, pquantity, instructions);
    }

    onDismiss();
  }, [
    id,
    pquantity,
    instructions,
    specialInstructions,
    updateItemQuantity,
    removeItem,
    menuItem,
    onDismiss,
    addtoCart,
  ]);

  // Check if there are changes
  const hasChanges = useMemo(() => {
    return (
      quantity !== pquantity || specialInstructions !== (instructions || '')
    );
  }, [quantity, pquantity, specialInstructions, instructions]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Header with item name */}
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Text
          style={{
            color: colors.onSurface,
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {menuItem.name}
        </Text>
      </View>

      {/* Item Image */}

      {/* Quantity Selector */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderWidth: 0,
        }}
      >
        <Text
          style={{
            color: colors.onSurface,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
          }}
        >
          {t('quantity')}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Decrease Button */}
          <TouchableOpacity
            onPress={handleDecrease}
            disabled={pquantity <= 1}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor:
                pquantity > 1 ? colors.primary : colors.surfaceVariant,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="remove"
              size={20}
              color={pquantity > 1 ? colors.onPrimary : colors.onSurfaceVariant}
            />
          </TouchableOpacity>

          {/* Quantity Display */}
          <Text
            style={{
              color: colors.onSurface,
              fontSize: 18,
              fontWeight: '700',
              marginHorizontal: 20,
              minWidth: 30,
              textAlign: 'center',
            }}
          >
            {pquantity}
          </Text>

          {/* Increase Button */}
          <TouchableOpacity
            onPress={handleIncrease}
            disabled={pquantity >= 99}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Special Instructions */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderWidth: 0,
        }}
      >
        <Text
          style={{
            color: colors.onSurface,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
          }}
        >
          {t('special_instructions_optional')}
        </Text>

        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder={t('special_instructions_placeholder')}
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 0,
            borderRadius: 8,
            padding: 12,
            backgroundColor: colors.surface,
            color: colors.onSurface,
            fontSize: 14,
            textAlignVertical: 'top',
            minHeight: 120,
          }}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={onDismiss}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
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
          onPress={handleSave}
          disabled={!hasChanges}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: hasChanges
              ? colors.primary
              : colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: hasChanges ? colors.onPrimary : colors.onSurfaceVariant,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {t('save')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditCartItemContent;
