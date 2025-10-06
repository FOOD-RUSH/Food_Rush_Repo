import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import FoodItemCard, { FoodItemCardProps } from './FoodItemCard';

interface AnimatedFoodItemCardProps extends FoodItemCardProps {
  animationValue?: SharedValue<number>;
  index?: number;
  isCarousel?: boolean;
}

const AnimatedFoodItemCard: React.FC<AnimatedFoodItemCardProps> = ({
  animationValue,
  index = 0,
  isCarousel = false,
  ...props
}) => {
  // Platform-specific shadow configuration (moved outside useAnimatedStyle)
  const isIOS = Platform.OS === 'ios';
  
  // Enhanced animation style for carousel
  const animatedStyle = useAnimatedStyle(() => {
    if (!animationValue || !isCarousel) {
      return {};
    }

    // Scale animation - more pronounced for carousel
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.85, 1, 0.85],
    );

    // Opacity animation
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.6, 1, 0.6],
    );

    // Rotation animation for more dynamic effect
    const rotateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [-15, 0, 15],
    );

    // Translation for parallax effect
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [-20, 0, 20],
    );

    // Platform-specific shadow animation
    const shadowOpacity = isIOS ? interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.05, 0.12, 0.05],
    ) : 0;

    const elevation = !isIOS ? interpolate(
      animationValue.value,
      [-1, 0, 1],
      [3, 6, 3],
    ) : 0;

    return {
      transform: [
        { scale: withSpring(scale, { damping: 15, stiffness: 150 }) },
        { rotateY: `${rotateY}deg` },
        { translateX: withTiming(translateX, { duration: 300 }) },
      ],
      opacity: withTiming(opacity, { duration: 300 }),
      // Platform-specific shadow properties
      shadowOpacity: isIOS ? withTiming(shadowOpacity, { duration: 300 }) : undefined,
      elevation: !isIOS ? withTiming(elevation, { duration: 300 }) : undefined,
    };
  }, [animationValue, isCarousel, isIOS]);

  // Simple entrance animation for non-carousel items
  const entranceStyle = useAnimatedStyle(() => {
    if (isCarousel) return {};
    
    return {
      transform: [
        {
          scale: withSpring(1, {
            damping: 15,
            stiffness: 100,
          }),
        },
        {
          translateY: withSpring(0, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(1, { duration: 400 }),
    };
  }, [isCarousel]);

  const combinedStyle = isCarousel ? animatedStyle : entranceStyle;

  return (
    <Animated.View style={[combinedStyle, { marginHorizontal: 4 }]}>
      <FoodItemCard {...props} />
    </Animated.View>
  );
};

export default AnimatedFoodItemCard;