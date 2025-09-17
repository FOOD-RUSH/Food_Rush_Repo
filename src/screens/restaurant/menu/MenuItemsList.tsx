import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useTheme, Card, FAB, Switch, Chip, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';
import { useRestaurantCategoryOptions } from '@/src/hooks/restaurant/useCategoriesApi';
import { useGetMenuItems, useDeleteMenuItem, useToggleMenuItemAvailability } from '@/src/hooks/restaurant/useMenuApi';
import { useUser } from '@/src/stores/customerStores/AuthStore';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  pictureUrl?: string;
  createdAt?: string;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

const MenuItemsList: React.FC<RestaurantMenuStackScreenProps<'MenuItemsList'>> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useUser();
  const restaurantId = user?.restaurantId;
  
  const { data: apiCategories, isLoading: isCategoriesLoading } = useRestaurantCategoryOptions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });

  // API hooks
  const { 
    data: menuItems = [], 
    isLoading, 
    refetch,
    error: apiError 
  } = useGetMenuItems(
    restaurantId || '', 
    selectedCategory === 'all' ? undefined : selectedCategory
  );
  
  const deleteMenuItemMutation = useDeleteMenuItem();
  const toggleAvailabilityMutation = useToggleMenuItemAvailability();

  // Set error state based on API error
  React.useEffect(() => {
    if (apiError) {
      setError({ hasError: true, message: 'Failed to load menu items' });
    } else {
      setError({ hasError: false, message: '' });
    }
  }, [apiError]);

  // Combine API categories with 'all' option and existing menu item categories
  const menuCategories = Array.from(new Set(menuItems.map(item => item.category)));
  const allCategories = apiCategories ? apiCategories.map(cat => cat.label) : [];
  const categories = ['all', ...new Set([...allCategories, ...menuCategories])];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantMenuItemForm', {});
    } catch (error) {
      setError({ hasError: true, message: 'Failed to navigate to add item screen' });
    }
  };

  const handleEditItem = (itemId: string) => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantMenuItemForm', { itemId });
    } catch (error) {
      setError({ hasError: true, message: 'Failed to navigate to edit item screen' });
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    if (!restaurantId) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const currentItem = menuItems.find(item => item.id === itemId);
      if (!currentItem) return;
      
      await toggleAvailabilityMutation.mutateAsync({
        restaurantId,
        itemId,
        isAvailable: !currentItem.isAvailable
      });
    } catch (error) {
      setError({ hasError: true, message: 'Failed to update item availability' });
    }
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    if (!restaurantId) return;
    
    Alert.alert(
      t('delete_item'),
      `${t('are_you_sure_delete')} "${itemName}"?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMenuItemMutation.mutateAsync({
                restaurantId,
                itemId
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              setError({ hasError: true, message: 'Failed to delete item' });
            }
          },
        },
      ]
    );
  };

  const handleManageCategories = () => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantCategoriesManager');
    } catch (error) {
      setError({ hasError: true, message: 'Failed to navigate to categories screen' });
    }
  };

  const onRefresh = async () => {
    try {
      setError({ hasError: false, message: '' });
      await refetch();
    } catch (error) {
      setError({ hasError: true, message: 'Failed to refresh menu items' });
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <Card 
      style={{ 
        marginBottom: isSmallScreen ? 10 : 12, 
        backgroundColor: colors.surface,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      }}
      className="mx-1"
    >
      <View className={`flex-row ${isSmallScreen ? 'p-3' : 'p-4'}`}>
        {/* Enhanced Image Container - Takes more space */}
        <View className={`${isSmallScreen ? 'w-28 h-28' : 'w-32 h-32'} mr-4`}>
          {item.pictureUrl ? (
            <Image
              source={{ uri: item.pictureUrl }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                backgroundColor: colors.surfaceVariant,
              }}
              resizeMode="cover"
            />
          ) : (
            <View 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                backgroundColor: colors.surfaceVariant,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons 
                name="food" 
                size={isSmallScreen ? 36 : 40} 
                color={colors.onSurfaceVariant} 
              />
            </View>
          )}
          
          {/* Availability overlay */}
          {!item.isAvailable && (
            <View 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.75)',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text 
                style={{ 
                  color: 'white', 
                  fontSize: isSmallScreen ? 11 : 12, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {t('sold_out')}
              </Text>
            </View>
          )}
        </View>

        {/* Content Container - Better organization and spacing */}
        <View className="flex-1 justify-between">
          {/* Top Section: Name and Switch */}
          <View className="flex-row justify-between items-start mb-3">
            <Text 
              style={{ 
                fontSize: isSmallScreen ? 17 : isMediumScreen ? 18 : 19, 
                fontWeight: '700', 
                color: colors.onSurface,
                flex: 1,
                marginRight: 12,
                lineHeight: isSmallScreen ? 20 : 22,
              }} 
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Switch
              value={item.isAvailable}
              onValueChange={() => handleToggleAvailability(item.id)}
              trackColor={{ false: '#E5E7EB', true: '#007aff' }}
              thumbColor={item.isAvailable ? '#ffffff' : '#f4f3f4'}
              disabled={toggleAvailabilityMutation.isPending}
              style={{ 
                transform: [{ scaleX: isSmallScreen ? 0.9 : 1 }, { scaleY: isSmallScreen ? 0.9 : 1 }] 
              }}
            />
          </View>
          
          {/* Middle Section: Description only (removed category chip) */}
          <View className="mb-4">
            <Text 
              style={{ 
                fontSize: isSmallScreen ? 14 : 15, 
                color: colors.onSurfaceVariant, 
                lineHeight: isSmallScreen ? 18 : 20,
                fontWeight: '400',
              }} 
              numberOfLines={3}
            >
              {item.description}
            </Text>
          </View>
          
          {/* Bottom Section: Price and Actions */}
          <View className="flex-row justify-between items-center">
            <Text 
              style={{ 
                fontSize: isSmallScreen ? 18 : isMediumScreen ? 19 : 20, 
                fontWeight: '800', 
                color: '#007aff',
                letterSpacing: 0.5,
              }}
            >
              {item.price.toLocaleString()} XAF
            </Text>
            
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => handleEditItem(item.id)}
                style={{
                  backgroundColor: '#007aff15',
                  padding: isSmallScreen ? 10 : 12,
                  borderRadius: 12,
                  marginRight: 10,
                }}
                className="items-center justify-center"
              >
                <MaterialCommunityIcons 
                  name="pencil" 
                  size={isSmallScreen ? 16 : 18} 
                  color="#007aff" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDeleteItem(item.id, item.name)}
                style={{
                  backgroundColor: '#FF444415',
                  padding: isSmallScreen ? 10 : 12,
                  borderRadius: 12,
                }}
                className="items-center justify-center"
              >
                <MaterialCommunityIcons 
                  name="delete" 
                  size={isSmallScreen ? 16 : 18} 
                  color="#FF4444" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  if (error.hasError) {
    return (
      <CommonView>
        <View className="flex-1 justify-center items-center p-6">
          <MaterialCommunityIcons name="alert-circle" size={56} color="#FF4444" />
          <Text className="text-xl font-bold text-center mt-4" style={{ color: colors.onSurface }}>
            {t('something_went_wrong')}
          </Text>
          <Text className="text-base text-center mt-2" style={{ color: colors.onSurfaceVariant }}>
            {error.message}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError({ hasError: false, message: '' });
              onRefresh();
            }}
            className="bg-blue-500 px-8 py-4 rounded-xl mt-6"
          >
            <Text className="text-white font-bold text-base">{t('try_again')}</Text>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View className="flex-1">
        {/* Header - Enhanced typography and spacing */}
        <View className="pb-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text 
                className={`${isSmallScreen ? 'text-2xl' : isMediumScreen ? 'text-3xl' : 'text-4xl'} font-bold`}
                style={{ color: colors.onBackground, letterSpacing: -0.5 }}
              >
                {t('menu_items')}
              </Text>
              <Text 
                className={`${isSmallScreen ? 'text-sm' : 'text-base'} mt-2 font-medium`}
                style={{ color: colors.onSurfaceVariant }}
              >
                {filteredItems.length} {t('items')} • {filteredItems.filter(item => item.isAvailable).length} {t('available')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleManageCategories}
              className={`${isSmallScreen ? 'p-3' : 'p-4'} rounded-xl`}
              style={{ backgroundColor: '#007aff15' }}
            >
              <MaterialCommunityIcons 
                name="tag-multiple" 
                size={isSmallScreen ? 20 : 22} 
                color="#007aff" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Search Bar - Centralized placeholder and icon */}
        <View className="pt-4 pb-2">
          <View 
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
          >
            <Searchbar
              placeholder={t('search_menu_items')}
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{ 
                backgroundColor: 'transparent',
                elevation: 0,
                height: isSmallScreen ? 48 : 52,
                borderRadius: 16,
              }}
              inputStyle={{ 
                fontSize: isSmallScreen ? 16 : 17,
                textAlign: searchQuery ? 'left' : 'center',
                fontWeight: '500',
                color: colors.onSurface,
              }}
              placeholderTextColor={colors.onSurfaceVariant}
              iconColor={colors.onSurfaceVariant}
              traileringIconColor={colors.onSurfaceVariant}
            />
          </View>
        </View>

        {/* Category Filter - Enhanced spacing and typography */}
        <View className="pt-3 pb-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(item);
                }}
                className={`${isSmallScreen ? 'px-4 py-3' : 'px-5 py-3'} rounded-full mr-3`}
                style={{
                  backgroundColor: selectedCategory === item ? '#007aff' : colors.surfaceVariant,
                  elevation: selectedCategory === item ? 2 : 0,
                }}
              >
                <Text
                  className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold`}
                  style={{
                    color: selectedCategory === item ? 'white' : colors.onSurfaceVariant,
                  }}
                >
                  {item === 'all' ? t('all') : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Menu Items List - Enhanced spacing */}
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ 
            paddingTop: isSmallScreen ? 8 : 12,
            paddingBottom: 100, // Space for FAB
          }}
          refreshing={isLoading}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <MaterialCommunityIcons
                name="food-off"
                size={64}
                color={colors.onSurfaceVariant}
              />
              <Text 
                className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold text-center mt-4`}
                style={{ color: colors.onSurfaceVariant }}
              >
                {searchQuery ? t('no_items_match') : t('no_menu_items_yet')}
              </Text>
              {!searchQuery && (
                <Text 
                  className={`${isSmallScreen ? 'text-sm' : 'text-base'} text-center mt-2 px-8`}
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {t('start_building_menu')}
                </Text>
              )}
            </View>
          }
        />

        {/* Enhanced FAB */}
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            margin: 20,
            right: 0,
            bottom: 0,
            backgroundColor: '#007aff',
            borderRadius: 16,
          }}
          size={isSmallScreen ? 'medium' : 'large'}
          onPress={handleAddItem}
        />
      </View>
    </CommonView>
  );
};

export default MenuItemsList;