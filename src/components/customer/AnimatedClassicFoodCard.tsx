import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import ClassicFoodCard from './ClassicFoodCard';

interface ClassicFoodCardProps {
  id: string;
  restaurantId?: string;
  foodName?: string;
  foodPrice?: number | string;
  restaurantName?: string;
  distance?: number;
  rating?: number;
  status?: string;
  imageUrl?: string;
  deliveryStatus?: string;
  deliveryFee?: number;
  isAvailable?: boolean;
}

interface AnimatedClassicFoodCardProps extends ClassicFoodCardProps {
  animationValue?: SharedValue<number>;
  index?: number;
  isCarousel?: boolean;
}

const AnimatedClassicFoodCard: React.FC<AnimatedClassicFoodCardProps> = ({
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
      [0.9, 1, 0.9],
    );

    // Opacity animation
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.7, 1, 0.7],
    );

    // Rotation animation for more dynamic effect
    const rotateZ = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [-3, 0, 3],
    );

    // Translation for parallax effect
    const translateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [10, 0, 10],
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
        { rotateZ: `${rotateZ}deg` },
        { translateY: withTiming(translateY, { duration: 300 }) },
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
      <ClassicFoodCard {...props} />
    </Animated.View>
  );
};

export default AnimatedClassicFoodCard;