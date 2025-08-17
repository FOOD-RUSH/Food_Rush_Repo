import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { Card, Button, useTheme } from 'react-native-paper';
import { useCartStore, CartItem } from '@/src/stores/customerStores/cartStore';
import { useLanguage } from '@/src/contexts/LanguageContext';
import Toast from 'react-native-toast-message';

interface CheckOutItemProps extends CartItem {}

const CheckOutItem: React.FC<CheckOutItemProps> = React.memo(
  ({ id, ItemtotalPrice, menuItem, quantity }) => {
    const { colors } = useTheme();
    const { t } = useLanguage();
    const [showModal, setShowModal] = useState(false);
    const [stateQuantity, setStateQuantity] = useState(quantity);

    const modifyCart = useCartStore((state) => state.modifyCart);
    const deleteCart = useCartStore((state) => state.deleteCart);

    // Memoize formatted price
    const formattedPrice = useMemo(
      () =>
        (ItemtotalPrice || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
      [ItemtotalPrice],
    );

    // Handle opening modal
    const handleEditPress = useCallback(() => {
      setStateQuantity(quantity);
      setShowModal(true);
    }, [quantity]);

    // Handle closing modal
    const handleCloseModal = useCallback(() => {
      setShowModal(false);
      setStateQuantity(quantity); // Reset to original quantity
    }, [quantity]);

    // Handle quantity change
    const handleQuantityChange = useCallback((newQuantity: number) => {
      setStateQuantity(Math.max(1, newQuantity));
    }, []);

    // Handle save quantity
    const handleSaveQuantity = useCallback(() => {
      if (stateQuantity > 0) {
        modifyCart(id, stateQuantity);
        setShowModal(false);
        
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: 'Quantity updated successfully',
          position: 'top',
        });
      }
    }, [id, stateQuantity, modifyCart, t]);

    // Handle delete item
    const handleDeleteItem = useCallback(() => {
      deleteCart(id);
      
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: 'Item removed from cart',
        position: 'top',
      });
    }, [id, deleteCart, t]);

    return (
      <>
        <Card
          mode="contained"
          style={{
            backgroundColor: colors.surface,
            marginVertical: 4,
            elevation: 1,
          }}
        >
          <View className="flex-row px-3 py-3 items-center">
            <View className="rounded-lg overflow-hidden">
              <Image
                source={menuItem.image || images.customerImg}
                defaultSource={images.customerImg}
                className="h-[70px] w-[70px]"
                resizeMode="cover"
              />
            </View>

            <View className="flex-col justify-center flex-1 ml-3">
              <Text
                numberOfLines={2}
                className="text-base font-semibold mb-1"
                style={{ color: colors.onSurface }}
              >
                {menuItem.name || 'Unknown Item'}
              </Text>
              <Text
                className="font-semibold text-sm"
                style={{ color: colors.primary }}
              >
                {formattedPrice} FCFA
              </Text>
            </View>

            <View className="flex-col justify-center items-center ml-2">
              <View
                className="px-2 py-1 rounded-md border mb-2"
                style={{ borderColor: colors.primary }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  {quantity}x
                </Text>
              </View>

              <View className="flex-row">
                <TouchableOpacity
                  className="rounded-full p-2 mr-1"
                  onPress={handleEditPress}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <AntDesign name="edit" color={colors.primary} size={18} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="rounded-full p-2 ml-1"
                  onPress={handleDeleteItem}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <AntDesign name="delete" color={colors.error} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        {/* Quantity Edit Modal */}
        <Modal
          visible={showModal}
          onRequestClose={handleCloseModal}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <Pressable
            onPress={handleCloseModal}
            className="flex-1 justify-center items-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <Pressable
              className="p-6 rounded-2xl w-full max-w-[280px]"
              style={{ backgroundColor: colors.surface }}
              onPress={() => {}} // Prevent modal close when pressing inside
            >
              <Text
                className="text-lg font-semibold text-center mb-6"
                style={{ color: colors.onSurface }}
              >
                {t('update_quantity')}
              </Text>

              <View className="flex-row items-center justify-center mb-6">
                <Pressable
                  className="rounded-full w-12 h-12 items-center justify-center border"
                  style={{ borderColor: colors.outline }}
                  onPress={() => handleQuantityChange(stateQuantity - 1)}
                  disabled={stateQuantity <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={
                      stateQuantity <= 1
                        ? colors.onSurfaceVariant
                        : colors.primary
                    }
                  />
                </Pressable>

                <Text
                  className="mx-6 text-3xl font-bold text-center min-w-[50px]"
                  style={{ color: colors.onSurface }}
                >
                  {stateQuantity}
                </Text>

                <Pressable
                  className="rounded-full w-12 h-12 items-center justify-center border"
                  style={{ borderColor: colors.outline }}
                  onPress={() => handleQuantityChange(stateQuantity + 1)}
                >
                  <Ionicons name="add" size={24} color={colors.primary} />
                </Pressable>
              </View>

              <View className="flex-row space-x-3">
                <Button
                  mode="outlined"
                  onPress={handleCloseModal}
                  className="flex-1"
                  labelStyle={{ fontSize: 14 }}
                >
                  {t('cancel')}
                </Button>

                <Button
                  mode="contained"
                  onPress={handleSaveQuantity}
                  className="flex-1"
                  labelStyle={{ fontSize: 14 }}
                >
                  {t('save')}
                </Button>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  },
);

CheckOutItem.displayName = 'CheckOutItem';

export default CheckOutItem;
