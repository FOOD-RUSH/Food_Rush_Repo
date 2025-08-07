import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

interface PromotionCardProps {
  color: string;
  image: ImageSourcePropType;
  percentage: number;
  days: number;
  title?: string;
  subtitle?: string;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  color,
  image,
  percentage,
  days,
  title = 'DISCOUNT ONLY',
  subtitle = 'VALID FOR TODAY!',
}) => {
  const { theme } = useTheme();

  // Generate color variants
  const getColorVariants = (baseColor: string) => {
    const hex = baseColor.replace('#', '').padStart(6, '0');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const lighter = `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`;
    const darker = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
    const lightest = `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`;

    return {
      base: baseColor,
      lighter,
      darker,
      lightest,
      withOpacity: `rgba(${r}, ${g}, ${b}, 0.8)`,
    };
  };

  const colorVariants = getColorVariants(theme === 'light' ? color : '#3b82f6');

  return (
    <View className="mx-4 my-2">
      <View className="relative h-[170px] rounded-[45px] overflow-hidden shadow-lg mb-3">
        {/* Main background */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: colorVariants.base }}
        />

        {/* Gradient overlay effect - Top to bottom */}
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: colorVariants.lighter,
            opacity: 0.6,
          }}
        />

        {/* Curved decorative elements using CSS */}
        {/* Top curved section */}
        <View
          className="absolute -top-4 -left-8 w-80 h-20 rounded-full"
          style={{
            backgroundColor: colorVariants.lightest,
            opacity: 0.3,
            transform: [{ rotate: '15deg' }],
          }}
        />

        {/* Bottom curved section */}
        <View
          className="absolute -bottom-4 -right-8 w-80 h-20 rounded-full"
          style={{
            backgroundColor: colorVariants.darker,
            opacity: 0.4,
            transform: [{ rotate: '-15deg' }],
          }}
        />

        {/* Side wave effect */}
        <View
          className="absolute top-0 right-0 w-32 h-full"
          style={{
            backgroundColor: colorVariants.lighter,
            opacity: 0.5,
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
          }}
        />

        {/* Additional curved elements */}
        <View
          className="absolute top-4 left-4 w-40 h-12 rounded-full"
          style={{
            backgroundColor: colorVariants.lightest,
            opacity: 0.2,
            transform: [{ rotate: '25deg' }],
          }}
        />

        <View
          className="absolute bottom-4 right-12 w-32 h-16 rounded-full"
          style={{
            backgroundColor: colorVariants.darker,
            opacity: 0.3,
            transform: [{ rotate: '-25deg' }],
          }}
        />

        {/* Content container */}
        <View className="flex-1 flex-row items-center justify-between px-6 py-4 relative z-10">
          {/* Left side - Text content */}
          <View className="flex-1 mr-4">
            <Text
              className="text-5xl font-black text-white mb-1"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {percentage}%
            </Text>
            <Text
              className="text-sm font-bold text-white mb-1"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            >
              {title}
            </Text>
            <Text
              className="text-sm font-bold text-white"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            >
              {subtitle}
            </Text>
            {days > 1 && (
              <Text
                className="text-xs text-white mt-1 opacity-90"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.2)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                Valid for {days} days
              </Text>
            )}
          </View>

          {/* Right side - Image */}
          <View className="relative">
            {/* Image background glow */}
            <View
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: colorVariants.withOpacity,
                transform: [{ scale: 1.1 }],
                shadowColor: colorVariants.base,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            />

            {/* Main image */}
            <Image
              source={image}
              className="w-[100px] h-[120px] rounded-3xl border-2 border-white pr-0"
              resizeMode="cover"
              style={{
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
          </View>
        </View>

        {/* Decorative dots */}
        <View className="absolute top-3 right-3">
          <View className="flex-row space-x-1">
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PromotionCard;
