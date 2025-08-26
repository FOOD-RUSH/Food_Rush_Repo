import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

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
  title,
  subtitle,
}) => {
  const { t } = useTranslation('translation');
  title = title || t('discount_only');
  subtitle = subtitle || t('valid_for_today');

  // Enhanced color variants generator with better contrast
  const getColorVariants = (baseColor: string) => {
    const hex = baseColor.replace('#', '').padStart(6, '0');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate luminance to determine if color is light or dark
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isDark = luminance < 0.5;

    // More aggressive color variations for better visibility
    const lightAmount = isDark ? 80 : 50;
    const darkAmount = isDark ? 50 : 80;

    return {
      base: baseColor,
      light: `rgba(${Math.min(255, r + lightAmount)}, ${Math.min(255, g + lightAmount)}, ${Math.min(255, b + lightAmount)}, 1)`,
      medium: `rgba(${r}, ${g}, ${b}, 0.85)`,
      dark: `rgba(${Math.max(0, r - darkAmount)}, ${Math.max(0, g - darkAmount)}, ${Math.max(0, b - darkAmount)}, 1)`,
      ultraLight: `rgba(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)}, 0.7)`,
      shadow: `rgba(${r}, ${g}, ${b}, 0.4)`,
      accent1: `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, 0.6)`,
      accent2: `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.5)`,
    };
  };

  const colorVariants = getColorVariants(color);

  return (
    <View className="mx-4 my-3">
      <View className="relative h-[180px] overflow-hidden shadow-xl">
        {/* Main card with rounded corners */}
        <View className="absolute inset-0 rounded-3xl overflow-hidden">
          {/* Enhanced primary gradient background */}
          <LinearGradient
            colors={[
              colorVariants.light,
              colorVariants.base,
              colorVariants.medium,
              colorVariants.dark,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />

          {/* Enhanced trapezium shape 1 - Top left with better visibility */}
          <View
            className="absolute -top-8 -left-12"
            style={{
              width: 120,
              height: 80,
              transform: [{ rotate: '25deg' }, { skewX: '15deg' }],
            }}
          >
            <LinearGradient
              colors={[
                colorVariants.accent1,
                colorVariants.ultraLight,
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 rounded-2xl"
              style={{ opacity: 0.8 }}
            />
          </View>

          {/* Enhanced trapezium shape 2 - Top right */}
          <View
            className="absolute -top-6 -right-8"
            style={{
              width: 100,
              height: 60,
              transform: [{ rotate: '-20deg' }, { skewY: '10deg' }],
            }}
          >
            <LinearGradient
              colors={[
                colorVariants.accent2,
                colorVariants.medium,
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 rounded-xl"
              style={{ opacity: 0.7 }}
            />
          </View>

          {/* Enhanced trapezium shape 3 - Bottom left */}
          <View
            className="absolute -bottom-10 -left-6"
            style={{
              width: 140,
              height: 70,
              transform: [{ rotate: '15deg' }, { skewX: '-20deg' }],
            }}
          >
            <LinearGradient
              colors={[
                colorVariants.dark,
                colorVariants.accent2,
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 rounded-2xl"
              style={{ opacity: 0.6 }}
            />
          </View>

          {/* Enhanced trapezium shape 4 - Bottom right */}
          <View
            className="absolute -bottom-8 -right-10"
            style={{
              width: 110,
              height: 90,
              transform: [{ rotate: '-30deg' }, { skewY: '-15deg' }],
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                colorVariants.accent1,
                colorVariants.light,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 rounded-xl"
              style={{ opacity: 0.5 }}
            />
          </View>

          {/* Enhanced central trapezium accent */}
          <View
            className="absolute top-8 right-4"
            style={{
              width: 80,
              height: 120,
              transform: [{ rotate: '10deg' }, { skewX: '8deg' }],
            }}
          >
            <LinearGradient
              colors={[
                colorVariants.ultraLight,
                colorVariants.accent1,
                colorVariants.medium,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 rounded-2xl"
              style={{ opacity: 0.4 }}
            />
          </View>

          {/* Enhanced depth overlay gradient */}
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.05)',
              'transparent',
              'rgba(0,0,0,0.1)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute inset-0"
          />
        </View>

        {/* Content container */}
        <View className="flex-1 flex-row items-center justify-between px-6 py-5 relative z-10">
          {/* Left side - Text content */}
          <View className="flex-1 mr-4">
            <View className="mb-2">
              <Text
                className="text-6xl font-black text-white"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.6)',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 6,
                  letterSpacing: -2,
                }}
              >
                {percentage}%
              </Text>
            </View>

            <View className="space-y-1">
              <Text
                className="text-sm font-bold text-white tracking-wide"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {title}
              </Text>
              <Text
                className="text-xs font-semibold text-white opacity-95"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.4)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {subtitle}
              </Text>
              {days > 1 && (
                <Text
                  className="text-xs text-white mt-1 opacity-90 font-medium"
                  style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {t('valid_for_days', { days })}
                </Text>
              )}
            </View>
          </View>

          {/* Right side - Image with enhanced visibility and positioning */}
          <View className="relative" style={{ zIndex: 20 }}>
            {/* Enhanced glow effect with better contrast */}
            <View
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: colorVariants.shadow,
                transform: [{ scale: 1.2 }],
                shadowColor: colorVariants.base,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
                elevation: 15,
              }}
            />

            {/* Additional background glow for image visibility */}
            <View
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: [{ scale: 1.1 }],
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 10,
              }}
            />

            {/* Image container with enhanced gradient border */}
            <View className="relative">
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.9)',
                  'rgba(255,255,255,0.7)',
                  'rgba(255,255,255,0.5)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl"
                style={{ padding: 3 }}
              >
                <View className="rounded-2xl overflow-hidden">
                  {/* White background to ensure image visibility */}
                  <View
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Image
                    source={image}
                    style={{
                      width: 105,
                      height: 125,
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Additional highlight overlay for image visibility */}
            <View
              className="absolute top-1 left-1 right-1"
              style={{
                height: 30,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          </View>
        </View>

        {/* Enhanced professional accent elements */}
        <View className="absolute top-4 right-4" style={{ zIndex: 15 }}>
          <View className="flex-row space-x-2">
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 3,
                  elevation: 3,
                }}
              />
            ))}
          </View>
        </View>

        {/* Enhanced corner accent */}
        <View className="absolute bottom-4 left-4 justify-center align-middle">
          <View
            className="w-8 h-1 rounded-full"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        </View>

        {/* Additional decorative element for enhanced visual appeal */}
        <View className="absolute top-2 left-2">
          <View
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: colorVariants.accent1,
              opacity: 0.6,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default PromotionCard;
