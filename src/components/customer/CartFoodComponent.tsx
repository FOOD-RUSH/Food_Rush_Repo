import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { images } from '@/assets/images';
import { useTheme, Card } from 'react-native-paper';
import { CartItem, useCartStore } from '@/src/stores/customerStores/cartStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  clamp,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

// Constants
const SWIPE_THRESHOLD = -60;
const DELETE_THRESHOLD = -120;
const ANIMATION_DURATION = 200;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

interface CartFoodComponentProps extends CartItem {
  onDelete?: (id: string) => void;
}

const CartFoodComponent: React.FC<CartFoodComponentProps> = React.memo(
  ({ id, menuItem, quantity, specialInstructions, onDelete }) => {
    const { colors } = useTheme();
    const { t } = useTranslation('translation');
    const deleteCart = useCartStore((state) => state.deleteCart);

    // Shared values
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    // Calculate and memoize formatted price
    const formattedPrice = useMemo(() => {
      const itemTotal = quantity * parseFloat(menuItem.price || '0');
      return itemTotal.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }, [quantity, menuItem.price]);

    // Haptic feedback helper
    const triggerHaptic = useCallback(() => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptics might not be available on all devices
        console.log(error);
      }
    }, []);

    // Safe delete handler
    const handleDelete = useCallback(() => {
      try {
        deleteCart(id);
        onDelete?.(id);
      } catch (error) {
        console.error('Error deleting cart item:', error);
        Alert.alert(t('error'), t('failed_to_delete_item'));
      }
    }, [id, deleteCart, onDelete, t]);

    // Confirm delete with alert
    const confirmDelete = useCallback(() => {
      Alert.alert(
        t('remove_item'),
        `${t('remove')} ${menuItem.name} from your cart?`,
        [
          {
            text: t('cancel'),
            style: 'cancel',
            onPress: () => {
              translateX.value = withSpring(0, SPRING_CONFIG);
            },
          },
          {
            text: t('remove'),
            style: 'destructive',
            onPress: () => {
              // Animate out smoothly
              opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
              scale.value = withTiming(0.8, { duration: ANIMATION_DURATION });
              translateX.value = withTiming(
                -300,
                {
                  duration: ANIMATION_DURATION,
                },
                (finished) => {
                  if (finished) {
                    runOnJS(handleDelete)();
                  }
                },
              );
            },
          },
        ],
        { cancelable: true },
      );
    }, [menuItem.name, handleDelete, t]);

    // Simplified pan gesture
    const panGesture = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .failOffsetY([-15, 15])
      .onUpdate((event) => {
        'worklet';
        // Only allow left swipe
        const newTranslateX = clamp(event.translationX, -150, 5);
        translateX.value = newTranslateX;
      })
      .onEnd(() => {
        'worklet';
        const currentTranslateX = translateX.value;

        if (currentTranslateX < DELETE_THRESHOLD) {
          // Show delete confirmation
          translateX.value = withSpring(-100, SPRING_CONFIG);
          runOnJS(triggerHaptic)();
          runOnJS(confirmDelete)();
        } else if (currentTranslateX < SWIPE_THRESHOLD) {
          // Show delete button
          translateX.value = withSpring(-80, SPRING_CONFIG);
          runOnJS(triggerHaptic)();
        } else {
          // Reset position
          translateX.value = withSpring(0, SPRING_CONFIG);
        }
      });

    // Reset swipe
    const resetSwipe = useCallback(() => {
      translateX.value = withSpring(0, SPRING_CONFIG);
    }, []);

    // Animated styles
    const containerAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      }),
      [opacity, scale],
    );

    const cardAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [{ translateX: translateX.value }],
      }),
      [translateX],
    );

    const deleteBackgroundStyle = useAnimatedStyle(() => {
      const progress = clamp(Math.abs(translateX.value) / 100, 0, 1);
      return {
        backgroundColor: `rgba(220, 38, 38, ${interpolate(progress, [0, 1], [0, 0.9])})`,
        borderRadius: 12,
      };
    }, [translateX]);

    const deleteIconStyle = useAnimatedStyle(() => {
      const progress = Math.abs(translateX.value);
      const iconScale = interpolate(progress, [0, 80], [0.5, 1]);
      return {
        transform: [{ scale: clamp(iconScale, 0.5, 1) }],
      };
    }, [translateX]);

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.wrapper, containerAnimatedStyle]}>
          {/* Delete background */}
          <Animated.View
            style={[styles.deleteBackground, deleteBackgroundStyle]}
          >
            <Pressable
              style={styles.deleteButton}
              onPress={confirmDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Animated.View style={deleteIconStyle}>
                <MaterialIcons name="delete" size={24} color="#fff" />
              </Animated.View>
              <Text style={styles.deleteText}>{t('remove')}</Text>
            </Pressable>
          </Animated.View>

          {/* Swipeable card */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={cardAnimatedStyle}>
              <Pressable onPress={resetSwipe}>
                <Card
                  mode="outlined"
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.outline,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.foodImage}
                        source={menuItem.image || images.customerImg}
                        defaultSource={images.customerImg}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.contentSection}>
                      <Text
                        style={[styles.foodName, { color: colors.onSurface }]}
                        numberOfLines={2}
                      >
                        {menuItem.name || 'Unknown Item'}
                      </Text>

                      <View style={styles.metaInfo}>
                        <Text
                          style={[
                            styles.quantity,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          {quantity}{' '}
                          {quantity > 1 ? t('items_suffix') : t('item')}
                        </Text>
                        <Text
                          style={[
                            styles.separator,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          {t('separator')}
                        </Text>
                        <Text
                          style={[
                            styles.distance,
                            { color: colors.onSurfaceVariant },
                          ]}
                        >
                          1.5{t('km_unit')}
                        </Text>
                      </View>

                      {specialInstructions && (
                        <View style={styles.instructionsContainer}>
                          <MaterialIcons
                            name="note"
                            size={12}
                            color={colors.onSurfaceVariant}
                            style={styles.noteIcon}
                          />
                          <Text
                            style={[
                              styles.instructions,
                              { color: colors.onSurfaceVariant },
                            ]}
                            numberOfLines={1}
                          >
                            {specialInstructions}
                          </Text>
                        </View>
                      )}

                      <Text style={[styles.price, { color: colors.primary }]}>
                        {formattedPrice} FCFA
                      </Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </View>
    );
  },
);
// 653264634

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    boxShadow: '1px 0px 3px rgba(0, 0, 0, 0.15)',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  deleteText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  foodImage: {
    height: 70,
    width: 70,
    backgroundColor: '#f5f5f5',
  },
  contentSection: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    minHeight: 70,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteIcon: {
    marginRight: 3,
  },
  instructions: {
    fontSize: 11,
    fontStyle: 'italic',
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

CartFoodComponent.displayName = 'CartFoodComponent';

export default CartFoodComponent;
