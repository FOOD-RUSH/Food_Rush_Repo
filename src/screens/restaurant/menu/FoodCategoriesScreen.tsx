import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Card, Badge, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { useRestaurantCategoryOptions } from '@/src/hooks/restaurant/useCategoriesApi';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

const FoodCategoriesScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data: categories, isLoading, error } = useRestaurantCategoryOptions();
  
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Removed add/delete category functionality - backend only returns categories

  const CategoryItem = React.memo(({ category, index }: { category: { value: string; label: string }; index: number }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, [index, scaleAnim]);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          marginBottom: isSmallScreen ? 8 : 12,
        }}
        key={category.value}
        className="mb-3"
      >
        <Card 
          style={{ 
            elevation: 2, 
            backgroundColor: 'transparent', 
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.outline + '40',
          }}
        >
          <Card.Content className={`${isSmallScreen ? 'p-3' : 'p-4'}`}>
            <View className="flex-row items-center">
              {/* Icon Container */}
              <View 
                className={`${isSmallScreen ? 'w-12 h-12' : 'w-14 h-14'} rounded-xl items-center justify-center mr-3`}
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <MaterialCommunityIcons 
                  name="food-fork-drink" 
                  size={isSmallScreen ? 20 : 24} 
                  color={colors.primary} 
                />
              </View>
              
              {/* Category Info */}
              <View className="flex-1">
                <Text 
                  className={`${isSmallScreen ? 'text-base' : isMediumScreen ? 'text-lg' : 'text-xl'} font-bold`}
                  style={{ color: colors.onSurface }}
                  numberOfLines={1}
                >
                  {category.label}
                </Text>
                <Text 
                  className={`${isSmallScreen ? 'text-xs' : 'text-sm'} mt-1`}
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('category_from_backend')}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  });

  // Set display name for debugging
  CategoryItem.displayName = 'CategoryItem';

  const LoadingState = () => (
    <View className={`items-center justify-center ${isSmallScreen ? 'py-12' : 'py-16'}`}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text 
        className={`${isSmallScreen ? 'text-sm' : 'text-base'} mt-4`}
        style={{ color: colors.onSurfaceVariant }}
      >
        {t('loading_categories')}
      </Text>
    </View>
  );

  const ErrorState = () => (
    <View className={`items-center justify-center ${isSmallScreen ? 'py-12' : 'py-16'}`}>
      <MaterialCommunityIcons 
        name="alert-circle-outline" 
        size={isSmallScreen ? 32 : 40} 
        color={colors.error} 
      />
      <Text 
        className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold text-center mb-2 mt-4`}
        style={{ color: colors.onSurface }}
      >
        {t('failed_to_load_categories')}
      </Text>
    </View>
  );

  const EmptyState = () => (
    <Animated.View 
      className={`items-center justify-center ${isSmallScreen ? 'py-12' : 'py-16'}`}
      style={{ opacity: fadeAnim }}
    >
      <View 
        className={`${isSmallScreen ? 'w-16 h-16' : 'w-20 h-20'} rounded-full items-center justify-center mb-4`}
        style={{ backgroundColor: '#007aff20' }}
      >
        <MaterialCommunityIcons 
          name="format-list-bulleted" 
          size={isSmallScreen ? 32 : 40} 
          color="#007aff" 
        />
      </View>
      <Text 
        className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold text-center mb-2`}
        style={{ color: colors.onSurface }}
      >
        {t('no_categories_available')}
      </Text>
      <Text 
        className={`text-center ${isSmallScreen ? 'text-sm' : 'text-base'} leading-5 px-6`}
        style={{ color: colors.onSurfaceVariant }}
      >
        {t('categories_managed_by_system')}
      </Text>
    </Animated.View>
  );

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <Animated.View 
        className="flex-1"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header Section - Clean and simple */}
        <View className="pt-2 pb-4">
          <Text 
            className={`${isSmallScreen ? 'text-2xl' : isMediumScreen ? 'text-3xl' : 'text-4xl'} font-bold`} 
            style={{ color: colors.onBackground }}
          >
            {t('categories')}
          </Text>
          <Text 
            className={`${isSmallScreen ? 'text-sm' : 'text-base'} mt-2 font-medium`} 
            style={{ color: colors.onSurfaceVariant }}
          >
            {!isLoading && categories ? 
              `${categories.length} ${categories.length === 1 ? t('category') : t('categories')} • ${t('from_backend')}` :
              t('loading_categories')
            }
          </Text>
        </View>

        {/* Categories List - Reduced padding */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : !categories || categories.length === 0 ? (
          <EmptyState />
        ) : (
          <View>
            {categories.map((category, index) => (
              <CategoryItem key={category.value} category={category} index={index} />
            ))}
          </View>
        )}

        {/* Removed statistics section - categories are now read-only from backend */}
      </Animated.View>
    </CommonView>
  );
};

export default FoodCategoriesScreen;
