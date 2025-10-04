import { MaterialIcon } from '@/src/components/common/icons';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import React, { useState, useMemo } from 'react';
import { Card, useTheme, Text } from 'react-native-paper';
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

const { width: screenWidth } = Dimensions.get('window');

const MenuItemCard = ({ item }: { item: FoodProps }) => {
  const addToCart = useCartStore((state) => state.addItemtoCart);
  const removeFromCart = useCartStore((state) => state.removeItemByFoodId);
  const isInCart = useIsItemInCart(item.id);
  const quantityInCart = useItemQuantityInCart(item.id);
  const [isSelect, setIsSelected] = useState(false);
  const { t } = useTranslation('translation');
  const { colors } = useTheme();

  // Responsive dimensions based on screen width
  const cardDimensions = useMemo(() => {
    const isTablet = screenWidth >= 768;
    const isDesktop = screenWidth >= 1024;
    
    if (isDesktop) {
      return {
        imageSize: 120,
        padding: 20,
        margin: 16,
        borderRadius: 20,
        minHeight: 140,
        fontSize: {
          name: 18,
          price: 16,
          cart: 12,
        },
        iconSize: 24,
      };
    } else if (isTablet) {
      return {
        imageSize: 100,
        padding: 16,
        margin: 12,
        borderRadius: 18,
        minHeight: 120,
        fontSize: {
          name: 16,
          price: 15,
          cart: 11,
        },
        iconSize: 22,
      };
    } else {
      return {
        imageSize: 80,
        padding: 14,
        margin: 8,
        borderRadius: 16,
        minHeight: 100,
        fontSize: {
          name: 14,
          price: 14,
          cart: 10,
        },
        iconSize: 20,
      };
    }
  }, []);

  // Helper function to get image source
  const getImageSource = () => {
    if (item.pictureUrl) {
      return {
        uri: item.pictureUrl.startsWith('http')
          ? item.pictureUrl
          : item.pictureUrl,
      };
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
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: borderColor,
            borderRadius: cardDimensions.borderRadius,
            marginHorizontal: cardDimensions.margin,
            marginVertical: cardDimensions.margin / 2,
            padding: cardDimensions.padding,
            minHeight: cardDimensions.minHeight,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
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
            <Image
              source={getImageSource()}
              style={[
                styles.image,
                {
                  width: cardDimensions.imageSize,
                  height: cardDimensions.imageSize,
                  borderRadius: cardDimensions.borderRadius * 0.8,
                },
              ]}
              resizeMode="cover"
            />
            {/* Cart indicator */}
            {isInCart && (
              <View
                style={[
                  styles.cartIndicator,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.cartIndicatorText,
                    {
                      color: colors.onPrimary,
                      fontSize: cardDimensions.fontSize.cart,
                    },
                  ]}
                >
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
                    fontSize: cardDimensions.fontSize.name,
                  },
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
                    size={cardDimensions.iconSize}
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
                  fontSize: cardDimensions.fontSize.price,
                },
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
                    fontSize: cardDimensions.fontSize.cart,
                  },
                ]}
                numberOfLines={1}
              >
                {quantityInCart} {t('in_cart') || 'in cart'}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  image: {
    backgroundColor: '#f5f5f5',
  },
  cartIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 24,
    minHeight: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartIndicatorText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    minWidth: 0,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nameText: {
    flex: 1,
    minWidth: 0,
    fontWeight: '600',
  },
  cartIconContainer: {
    marginLeft: 12,
    flexShrink: 0,
  },
  priceText: {
    marginTop: 4,
    flexShrink: 1,
    minWidth: 0,
    fontWeight: '700',
  },
  cartText: {
    marginTop: 6,
    flexShrink: 1,
    minWidth: 0,
    fontStyle: 'italic',
  },
});

export default MenuItemCard;