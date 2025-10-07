import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme, Card, FAB, Switch, Chip } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import {
  Typography,
  Heading1,
  Heading4,
  Body,
  Label,
  LabelLarge,
  Caption,
} from '@/src/components/common/Typography';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';
import { useCategories } from '@/src/hooks/useCategories';
import {
  getCategoryEmoji,
  getCategoryColor,
  getCategoryLabel,
} from '@/src/data/categories';
import {
  useMenuItems,
  useDeleteMenuItem,
  useToggleMenuItemAvailability,
} from '@/src/hooks/restaurant/useMenuApi';
import { useCurrentRestaurant } from '@/src/stores/AuthStore';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';
import { useResponsive } from '@/src/hooks/useResponsive';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

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

const MenuItemsList: React.FC<
  RestaurantMenuStackScreenProps<'MenuItemsList'>
> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const currentRestaurant = useCurrentRestaurant();
  const restaurantId = currentRestaurant?.id;
  const tabBarHeight = useFloatingTabBarHeight();
  const { scale, isSmallScreen: responsiveIsSmallScreen } = useResponsive();

  const { categories: apiCategories = [] } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
  });

  // API hooks
  const {
    data: menuItems = [],
    isLoading,
    refetch,
    error: apiError,
  } = useMenuItems(
    restaurantId || '',
    selectedCategory === 'all' ? undefined : selectedCategory,
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
  const menuCategories = Array.from(
    new Set(menuItems.map((item) => item.category)),
  );
  const allCategories = apiCategories
    ? apiCategories.map((cat) => cat.value)
    : [];
  const categories = ['all', ...new Set([...allCategories, ...menuCategories])];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesCategory;
  });

  const handleAddItem = () => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantMenuItemForm', {});
    } catch (error) {
      setError({
        hasError: true,
        message: 'Failed to navigate to add item screen',
      });
    }
  };

  const handleEditItem = (itemId: string) => {
    try {
      Haptics.selectionAsync();
      navigation.navigate('RestaurantEditFoodItem', { menuId: itemId });
    } catch (error) {
      setError({
        hasError: true,
        message: 'Failed to navigate to edit item screen',
      });
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    if (!restaurantId) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const currentItem = menuItems.find((item) => item.id === itemId);
      if (!currentItem) return;

      await toggleAvailabilityMutation.mutateAsync({
        restaurantId,
        itemId,
        isAvailable: !currentItem.isAvailable,
      });
    } catch (error) {
      setError({
        hasError: true,
        message: 'Failed to update item availability',
      });
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
                itemId,
              });
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            } catch (error) {
              setError({ hasError: true, message: 'Failed to delete item' });
            }
          },
        },
      ],
    );
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
        marginBottom: scale(isSmallScreen ? 10 : 12),
        backgroundColor: colors.surface,
        borderRadius: scale(20),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(3) },
        shadowOpacity: 0.12,
        shadowRadius: scale(6),
      }}
      className="mx-1"
    >
      <View className={`flex-row ${isSmallScreen ? 'p-3' : 'p-4'}`}>
        {/* Enhanced Image Container - Takes more space */}
        <View
          className={`${isSmallScreen ? 'w-28 h-28' : 'w-32 h-32'} mr-4`}
          style={{
            width: scale(isSmallScreen ? 112 : 128),
            height: scale(isSmallScreen ? 112 : 128),
          }}
        >
          {item.pictureUrl ? (
            <Image
              source={{ uri: item.pictureUrl }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: scale(16),
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
              <MaterialCommunityIcon
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
              <Caption color="white" weight="bold" align="center">
                {t('sold_out')}
              </Caption>
            </View>
          )}
        </View>

        {/* Content Container - Better organization and spacing */}
        <View className="flex-1 justify-between">
          {/* Top Section: Name and Switch */}
          <View className="flex-row justify-between items-start mb-3">
            <LabelLarge
              color={colors.onSurface}
              weight="bold"
              numberOfLines={2}
              style={{
                flex: 1,
                marginRight: 12,
              }}
            >
              {item.name}
            </LabelLarge>
            <Switch
              value={item.isAvailable}
              onValueChange={() => handleToggleAvailability(item.id)}
              trackColor={{ false: '#E5E7EB', true: '#007aff' }}
              thumbColor={item.isAvailable ? '#ffffff' : '#f4f3f4'}
              disabled={toggleAvailabilityMutation.isPending}
              style={{
                transform: [
                  { scaleX: isSmallScreen ? 0.9 : 1 },
                  { scaleY: isSmallScreen ? 0.9 : 1 },
                ],
              }}
            />
          </View>

          {/* Middle Section: Description only (removed category chip) */}
          <View className="mb-4">
            <Body color={colors.onSurfaceVariant} numberOfLines={3}>
              {item.description}
            </Body>
          </View>

          {/* Bottom Section: Price and Actions */}
          <View className="flex-row justify-between items-center">
            <LabelLarge color="#007aff" weight="extraBold">
              {item.price.toLocaleString()} XAF
            </LabelLarge>

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
                <MaterialCommunityIcon
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
                <MaterialCommunityIcon
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
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#FF444415',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <MaterialCommunityIcon
              name="alert-circle"
              size={48}
              color="#FF4444"
            />
          </View>
          <Heading4
            color={colors.onSurface}
            align="center"
            style={{ marginBottom: 8 }}
          >
            {t('something_went_wrong')}
          </Heading4>
          <Body
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginBottom: 24, paddingHorizontal: 32 }}
          >
            {error.message}
          </Body>
          <TouchableOpacity
            onPress={() => {
              setError({ hasError: false, message: '' });
              onRefresh();
            }}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcon
              name="refresh"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Label color="white" weight="bold">
              {t('try_again')}
            </Label>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <View className="flex-1">
        {/* Header - Enhanced typography and spacing */}
        <View className="pb-2" style={{ paddingTop: 20 }}>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Heading1 color={colors.onBackground} weight="bold">
                {t('menu_items')}
              </Heading1>
              <Body
                color={colors.onSurfaceVariant}
                weight="medium"
                style={{ marginTop: 8 }}
              >
                {filteredItems.length} {t('items')} •{' '}
                {filteredItems.filter((item) => item.isAvailable).length}{' '}
                {t('available')}
              </Body>
            </View>
          </View>
        </View>

        {/* Category Filter - Enhanced spacing and typography */}
        <View className="pt-3 pb-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => {
              const emoji = item === 'all' ? '🍽️' : getCategoryEmoji(item);
              const label = item === 'all' ? t('all') : getCategoryLabel(item);
              const categoryColor =
                item === 'all' ? '#007aff' : getCategoryColor(item);

              return (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedCategory(item);
                  }}
                  className={`${isSmallScreen ? 'px-4 py-3' : 'px-5 py-3'} rounded-full mr-3 flex-row items-center`}
                  style={{
                    backgroundColor:
                      selectedCategory === item
                        ? categoryColor
                        : colors.surfaceVariant,
                    elevation: selectedCategory === item ? 2 : 0,
                  }}
                >
                  <Typography variant="body" style={{ marginRight: 8 }}>
                    {emoji}
                  </Typography>
                  <Label
                    color={
                      selectedCategory === item
                        ? 'white'
                        : colors.onSurfaceVariant
                    }
                    weight="semibold"
                  >
                    {label}
                  </Label>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Menu Items List - Enhanced spacing */}
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: isSmallScreen ? 8 : 12,
            paddingBottom: Math.max(100, tabBarHeight), // Space for FAB and tab bar
          }}
          refreshing={isLoading}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.surfaceVariant,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <MaterialCommunityIcon
                  name="food-off"
                  size={48}
                  color={colors.onSurfaceVariant}
                />
              </View>
              <Heading4
                color={colors.onSurface}
                weight="bold"
                align="center"
                style={{ marginBottom: 8 }}
              >
                {t('no_menu_items_yet')}
              </Heading4>
              <Body
                color={colors.onSurfaceVariant}
                align="center"
                style={{ paddingHorizontal: 32, lineHeight: 22 }}
              >
                {t('start_building_menu')}
              </Body>
              <TouchableOpacity
                onPress={handleAddItem}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 25,
                  marginTop: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcon
                  name="plus"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Label color="white" weight="bold">
                  {t('add_new_item')}
                </Label>
              </TouchableOpacity>
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
            bottom: 50,
            backgroundColor: '#007aff',
            borderRadius: 16,
          }}
          size={isSmallScreen ? 'meduim' : 'medium'}
          onPress={handleAddItem}
        />
      </View>
    </CommonView>
  );
};

export default MenuItemsList;
