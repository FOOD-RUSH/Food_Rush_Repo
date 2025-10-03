import { MaterialIcon } from '@/src/components/common/icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Card, useTheme } from 'react-native-paper';
import { FoodProps } from '@/src/types';
import { images } from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
import {
  useCartStore,
  useIsItemInCart,
  useItemQuantityInCart,
} from '@/src/stores/customerStores/cartStore';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/src/hooks/useResponsive';
import ResponsiveImage from '@/src/components/common/ResponsiveImage';


const MenuItemCard = ({ item }: { item: FoodProps }) => {
  const addToCart = useCartStore((state) => state.addtoCart);
  const removeFromCart = useCartStore((state) => state.deleteCartByFoodId);
  const isInCart = useIsItemInCart(item.id);
  const quantityInCart = useItemQuantityInCart(item.id);
  const [isSelect, setIsSelected] = useState(false);
  const { t } = useTranslation('translation');

  const { screen, scale } = useResponsive();
  const { colors } = useTheme();
  
  // Responsive dimensions
  const imageSize = scale(90); // Responsive image size based on screen
  const borderWidth = StyleSheet.hairlineWidth;
  const padding = scale(12);
  const margin = scale(10);
  
  // Helper function to get image source
  const getImageSource = () => {
    if (item.pictureUrl) {
      // Handle backend image URL
      const baseUrl = 'https://your-api-base-url.com'; // Replace with actual API base URL
      return { uri: item.pictureUrl.startsWith('http') ? item.pictureUrl : `${baseUrl}${item.pictureUrl}` };
    }
    return images.onboarding2;
  };

  const longPress = () => {
    setIsSelected(!isSelect);
    if (isSelect) {
      addToCart(item, 1, '');
    } else {
      removeFromCart(item.id);
    }
  };
  const navigation =
    useNavigation<RootStackScreenProps<'RestaurantDetails'>['navigation']>();
  const borderColor = isSelect
    ? colors.primary
    : isInCart
      ? colors.primary
      : colors.outline;

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Card
        mode="outlined"
        style={[
          {
            backgroundColor: colors.surface,
            borderColor: borderColor,
            borderRadius: scale(16),
            marginHorizontal: margin,
            marginVertical: margin / 2,
            padding: padding,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: StyleSheet.hairlineWidth,
            },
            shadowOpacity: 0.1,
            shadowRadius: scale(2),
            elevation: 1,
          },
        ]}
        key={item.id}
        onPress={() => {
          navigation.navigate('FoodDetails', {
            foodId: item.id,
          });
        }}
        onLongPress={longPress}
      >
        <View style={styles.rowContainer}>
          <View style={styles.imageContainer}>
            <ResponsiveImage
              source={getImageSource()}
              width={imageSize}
              height={imageSize}
              aspectRatio={1}
              resizeMode="cover"
              containerStyle={styles.image}
            />
            {/* Cart indicator */}
            {isInCart && (
              <View
                style={[
                  styles.cartIndicator,
                  { backgroundColor: colors.primary }
                ]}
              >
                <Text style={[styles.cartIndicatorText, { color: 'white' }]}>
                  {quantityInCart}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <View style={styles.nameContainer}>
              <Text
                style={[
                  styles.nameText,
                  { 
                    color: colors.onSurface,
                    fontSize: scale(16),
                    lineHeight: scale(22),
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              {isInCart && (
                <View style={styles.cartIconContainer}>
                  <MaterialIcon 
                    name="shopping-cart"
                    size={scale(20)}
                    color={colors.primary}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.priceText,
                {
                  color: colors.primary,
                  fontSize: scale(16),
                  lineHeight: scale(22),
                  flexShrink: 1,
                }
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.price} XAF
            </Text>
            {isInCart && (
              <Text
                style={[
                  styles.cartText,
                  {
                    color: colors.onSurfaceVariant,
                    fontSize: scale(12),
                    lineHeight: scale(16),
                  }
                ]}
                numberOfLines={1}
              >
                {quantityInCart} in cart
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
    flexShrink: 0, // Prevent image container from shrinking
  },
  image: {
    borderRadius: 16,
  },
  cartIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIndicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0, // This allows flex items to shrink below their content size
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameText: {
    flex: 1,
    fontWeight: '600',
    minWidth: 0, // Allow text to shrink
  },
  cartIconContainer: {
    marginLeft: 8,
    flexShrink: 0, // Prevent cart icon from shrinking
  },
  priceText: {
    fontWeight: '600',
    marginTop: 4,
    flexShrink: 1,
    minWidth: 0, // Allow price text to shrink
  },
  cartText: {
    marginTop: 4,
    flexShrink: 1,
    minWidth: 0, // Allow cart text to shrink
  },
});

export default MenuItemCard;
