import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
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

  // Cart actions - Fixed: Removed state selector that could cause re-renders
  const updateItemQuantity = useCartStore((state) => state.modifyCart);
  const removeItem = useCartStore((state) => state.deleteCart);
  const addtoCart = useCartStore((state) => state.addtoCart);

  // Handle quantity changes - Fixed: Removed dependency on pquantity in useCallback
  const handleIncrease = useCallback(() => {
    setQuantity((prev) => (prev < 99 ? prev + 1 : prev));
  }, []);

  const handleDecrease = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  // Handle save changes - Fixed: Stable dependencies
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    sectionContainer: {
      marginBottom: 24,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    sectionTitle: {
      color: colors.onSurface,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 16,
      letterSpacing: 0.15,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryContainer,
      borderRadius: 20,
      padding: 6,
      alignSelf: 'flex-start',
      elevation: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    quantityButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    quantityButtonActive: {
      backgroundColor: colors.primary,
    },
    quantityButtonInactive: {
      backgroundColor: colors.surfaceVariant,
    },
    quantityText: {
      color: colors.onPrimaryContainer,
      fontSize: 20,
      fontWeight: '700',
      marginHorizontal: 24,
      minWidth: 36,
      textAlign: 'center',
    },
    textInput: {
      borderWidth: 2,
      borderColor: colors.outline,
      borderRadius: 12,
      padding: 16,
      backgroundColor: colors.surface,
      color: colors.onSurface,
      fontSize: 14,
      textAlignVertical: 'top',
      minHeight: 100,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    saveButton: {
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      elevation: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    },
    saveButtonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.container}>
      {/* Quantity Selector */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('quantity')}</Text>

        <View style={styles.quantityContainer}>
          {/* Decrease Button */}
          <TouchableOpacity
            onPress={handleDecrease}
            disabled={pquantity <= 1}
            style={[
              styles.quantityButton,
              pquantity > 1
                ? styles.quantityButtonActive
                : styles.quantityButtonInactive,
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="remove"
              size={22}
              color={pquantity > 1 ? colors.onPrimary : colors.onSurfaceVariant}
            />
          </TouchableOpacity>

          {/* Quantity Display */}
          <Text style={styles.quantityText}>{pquantity}</Text>

          {/* Increase Button */}
          <TouchableOpacity
            onPress={handleIncrease}
            disabled={pquantity >= 99}
            style={[styles.quantityButton, styles.quantityButtonActive]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={22} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Special Instructions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {t('special_instructions_optional')}
        </Text>

        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder={t('special_instructions_placeholder')}
          multiline
          numberOfLines={3}
          style={styles.textInput}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={!hasChanges}
        style={styles.saveButton}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>
          {hasChanges ? t('save_changes') : t('no_changes')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditCartItemContent;
