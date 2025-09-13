import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Button, TextInput, Card, Badge, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

interface Category {
  id: string;
  name: string;
  itemCount: number;
  color: string;
  icon: string;
}

const FoodCategoriesScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [categories, setCategories] = React.useState<Category[]>([
    {
      id: '1',
      name: 'Appetizers',
      itemCount: 12,
      color: '#10B981',
      icon: 'food-apple'
    },
    {
      id: '2',
      name: 'Main Course',
      itemCount: 24,
      color: '#F59E0B',
      icon: 'food-drumstick'
    },
    {
      id: '3',
      name: 'Desserts',
      itemCount: 8,
      color: '#EC4899',
      icon: 'cupcake'
    },
    {
      id: '4',
      name: 'Beverages',
      itemCount: 15,
      color: '#8B5CF6',
      icon: 'cup'
    },
    {
      id: '5',
      name: 'Pizza',
      itemCount: 6,
      color: '#EF4444',
      icon: 'pizza'
    }
  ]);
  
  const [newCategory, setNewCategory] = React.useState('');
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

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444'];
      const icons = ['food-fork-drink', 'food-apple', 'pizza', 'hamburger', 'cup', 'ice-cream'];
      
      const newCat: Category = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        itemCount: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)]
      };
      
      setCategories([...categories, newCat]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const CategoryItem = React.memo(({ category, index }: { category: Category; index: number }) => {
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
        key={category.id}
        className="mx-2"
      >
        <Card 
          style={{ 
            elevation: 2, 
            backgroundColor: colors.surface, 
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.outline,
          }}
        >
          <Card.Content className={`${isSmallScreen ? 'p-3' : 'p-4'}`}>
            <View className="flex-row items-center">
              {/* Icon Container */}
              <View 
                className={`${isSmallScreen ? 'w-12 h-12' : 'w-14 h-14'} rounded-xl items-center justify-center mr-3`}
                style={{ backgroundColor: `${category.color}15` }}
              >
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={isSmallScreen ? 20 : 24} 
                  color={category.color} 
                />
              </View>
              
              {/* Category Info */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text 
                    className={`${isSmallScreen ? 'text-base' : isMediumScreen ? 'text-lg' : 'text-xl'} font-bold flex-1`}
                    style={{ color: colors.onSurface }}
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                  <Badge 
                    size={isSmallScreen ? 18 : 20}
                    style={{ backgroundColor: '#007aff20', color: '#007aff' }}
                  >
                    {category.itemCount}
                  </Badge>
                </View>
                <Text 
                  className={`${isSmallScreen ? 'text-xs' : 'text-sm'}`}
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {category.itemCount} {category.itemCount === 1 ? t('item') : t('items')}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row ml-2">
                <TouchableOpacity
                  className={`${isSmallScreen ? 'w-8 h-8' : 'w-10 h-10'} items-center justify-center rounded-full mr-2`}
                  style={{ backgroundColor: colors.surfaceVariant }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    // Handle edit - you can add navigation here
                    console.log('Edit category:', category.id);
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons 
                    name="pencil" 
                    size={isSmallScreen ? 14 : 16} 
                    color={colors.onSurfaceVariant} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className={`${isSmallScreen ? 'w-8 h-8' : 'w-10 h-10'} items-center justify-center rounded-full`}
                  style={{ backgroundColor: '#FF444420' }}
                  onPress={() => handleDeleteCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons 
                    name="delete" 
                    size={isSmallScreen ? 14 : 16} 
                    color="#FF4444" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  });

  // Set display name for debugging
  CategoryItem.displayName = 'CategoryItem';

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
        {t('no_categories_yet')}
      </Text>
      <Text 
        className={`text-center ${isSmallScreen ? 'text-sm' : 'text-base'} leading-5 px-6`}
        style={{ color: colors.onSurfaceVariant }}
      >
        {t('start_organizing_menu_categories')}
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
        <View className={`${isSmallScreen ? 'px-3 pt-2 pb-4' : 'px-4 pt-3 pb-6'}`}>
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
            {categories.length} {categories.length === 1 ? t('category') : t('categories')} • {t('organize_your_menu')}
          </Text>
        </View>

        {/* Add Category Form - Reduced padding */}
        <Card 
          className={`${isSmallScreen ? 'mx-2 mb-3' : 'mx-3 mb-4'}`} 
          style={{ 
            elevation: 2, 
            backgroundColor: colors.surface, 
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.outline,
          }}
        >
          <Card.Content className={`${isSmallScreen ? 'p-3' : 'p-4'}`}>
            <Text 
              className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-3`}
              style={{ color: colors.onSurface }}
            >
              {t('add_new_category')}
            </Text>
            <View className="flex-row items-end space-x-2">
              <View className="flex-1">
                <TextInput
                  mode="outlined"
                  label={t('category_name')}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  outlineColor={colors.outline}
                  activeOutlineColor="#007aff"
                  style={{ backgroundColor: colors.surface }}
                  contentStyle={{ fontSize: isSmallScreen ? 14 : 16 }}
                  textColor={colors.onSurface}
                  left={<TextInput.Icon icon="tag" color={colors.onSurfaceVariant} />}
                  dense={isSmallScreen}
                />
              </View>
              <Button
                mode="contained"
                onPress={handleAddCategory}
                buttonColor="#007aff"
                contentStyle={{ 
                  paddingVertical: isSmallScreen ? 8 : 10, 
                  paddingHorizontal: isSmallScreen ? 12 : 16 
                }}
                labelStyle={{ 
                  fontSize: isSmallScreen ? 13 : 14, 
                  fontWeight: '600',
                  color: 'white',
                }}
                style={{ borderRadius: 8 }}
                disabled={!newCategory.trim()}
              >
                {t('add')}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Categories List - Reduced padding */}
        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <View className={`${isSmallScreen ? 'px-1' : 'px-2'}`}>
            {categories.map((category, index) => (
              <CategoryItem key={category.id} category={category} index={index} />
            ))}
          </View>
        )}

        {/* Statistics Card - Reduced padding */}
        {categories.length > 0 && (
          <Card 
            className={`${isSmallScreen ? 'mx-2 mt-3 mb-4' : 'mx-3 mt-4 mb-6'}`} 
            style={{ 
              elevation: 2, 
              backgroundColor: colors.surface, 
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.outline,
            }}
          >
            <Card.Content className={`${isSmallScreen ? 'p-3' : 'p-4'}`}>
              <Text 
                className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold mb-3`}
                style={{ color: colors.onSurface }}
              >
                {t('quick_stats')}
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text 
                    className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold`}
                    style={{ color: '#007aff' }}
                  >
                    {categories.length}
                  </Text>
                  <Text 
                    className={`${isSmallScreen ? 'text-xs' : 'text-sm'}`}
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {t('categories')}
                  </Text>
                </View>
                
                <View className="items-center">
                  <Text 
                    className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold`}
                    style={{ color: '#00D084' }}
                  >
                    {categories.reduce((total, cat) => total + cat.itemCount, 0)}
                  </Text>
                  <Text 
                    className={`${isSmallScreen ? 'text-xs' : 'text-sm'}`}
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {t('total_items')}
                  </Text>
                </View>
                
                <View className="items-center">
                  <Text 
                    className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold`}
                    style={{ color: '#FF9500' }}
                  >
                    {categories.length > 0 
                      ? Math.round(categories.reduce((total, cat) => total + cat.itemCount, 0) / categories.length)
                      : 0
                    }
                  </Text>
                  <Text 
                    className={`${isSmallScreen ? 'text-xs' : 'text-sm'}`}
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {t('avg_per_category')}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </Animated.View>
    </CommonView>
  );
};

export default FoodCategoriesScreen;