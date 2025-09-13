import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FAB, Searchbar, Card, Badge, Switch } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { useGetMenuItems, useToggleMenuItemAvailability } from '@/src/hooks/restaurant/useMenuApi';
import { RestaurantMenuStackScreenProps } from '@/src/navigation/types';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  rating?: number;
  description?: string;
}

interface FilterButton {
  label: string;
  icon: string;
  color: string;
  gradient: string[];
}

const MenuListScreen = () => {
  const navigation = useNavigation<RestaurantMenuStackScreenProps<'MenuList'>['navigation']>();
  const { t } = useTranslation();
  const user = useAuthUser();
  const restaurantId = user?.restaurantId;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // API hooks
  const { data: menuItems = [], isLoading, error, refetch } = useGetMenuItems(restaurantId || '', {
    page: 1,
    limit: 50
  });

  const toggleAvailabilityMutation = useToggleMenuItemAvailability();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef<Animated.Value[]>([]).current;

  // Initialize animations when menuItems change
  useEffect(() => {
    const items = menuItems as MenuItem[];
    if (items && items.length > 0) {
      itemAnimations.length = 0; // Clear existing animations
      items.forEach(() => {
        itemAnimations.push(new Animated.Value(0));
      });
    }
  }, [menuItems]);

  useEffect(() => {
    // Start entrance animations
    const entranceSequence = Animated.sequence([
      // Header animation
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Main content animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Menu items stagger animation
      Animated.stagger(100,
        itemAnimations.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
      // FAB animation
      Animated.spring(fabAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    entranceSequence.start();
  }, [itemAnimations]);

  const handleBack = () => {
    // Exit animation before navigating back
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  const handleItemPress = (item: MenuItem) => {
    navigation.navigate('EditMenuItem', { itemId: item.id });
  };

  const handleAddFood = () => {
    navigation.navigate('AddMenuItem');
  };

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
  };

  const toggleAvailability = async (itemId: string) => {
    if (!restaurantId) return;

    try {
      const currentItem = (menuItems as MenuItem[]).find(item => item.id === itemId);
      if (!currentItem) return;

      await toggleAvailabilityMutation.mutateAsync({
        restaurantId,
        itemId,
        isAvailable: !currentItem.isAvailable
      });

      // Refetch to get updated data
      refetch();
    } catch (error) {
      console.error('Error toggling availability:', error);
      Alert.alert('Error', 'Failed to update item availability');
    }
  };

  const MenuItemCard: React.FC<{ item: MenuItem; index: number }> = ({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          opacity: itemAnimations[index],
          transform: [
            {
              translateX: itemAnimations[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [100 * (index % 2 === 0 ? 1 : -1), 0],
              }) || 0
            },
            { scale: scaleAnim }
          ],
          marginBottom: 16,
        }}
      >
        <Card className="mx-6" style={{ elevation: 4, backgroundColor: '#FFFFFF' }}>
          <TouchableOpacity 
            onPress={() => handleItemPress(item)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Card.Content className="p-0">
              <View className="flex-row">
                {/* Image Container */}
                <View className="relative">
                  <Image 
                    source={{ uri: item.image }}
                    style={{ width: 120, height: 120, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
                    resizeMode="cover"
                  />
                  {item.isPopular && (
                    <View className="absolute top-2 left-2 bg-orange-500 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-semibold">Popular</Text>
                    </View>
                  )}
                  <View className={`absolute bottom-2 right-2 px-2 py-1 rounded-full ${
                    item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <Text className="text-white text-xs font-semibold">
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <View className="flex-1 p-4 justify-between">
                  <View>
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-lg font-bold text-gray-800 flex-1 pr-2">
                        {item.name}
                      </Text>
                      <Text className="text-xl font-bold text-blue-600">${item.price}</Text>
                    </View>
                    
                    <Text className="text-sm text-gray-500 mb-2">{item.category}</Text>
                    
                    {item.description && (
                      <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                    
                    <View className="flex-row items-center mb-3">
                      <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                      <Text className="text-sm text-gray-600 ml-1">{item.rating}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-600 mr-3">Available:</Text>
                      <Switch
                        value={item.isAvailable}
                        onValueChange={() => toggleAvailability(item.id)}
                        thumbColor={item.isAvailable ? '#3B82F6' : '#E5E7EB'}
                        trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                      />
                    </View>
                    
                    <TouchableOpacity
                      className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center"
                      onPress={() => handleItemPress(item)}
                    >
                      <MaterialCommunityIcons name="pencil" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  };

  const renderMenuItem = ({ item, index }: { item: MenuItem; index: number }) => (
    <MenuItemCard item={item} index={index} />
  );

  // Filter items based on search query and active filter
  const getFilteredItems = () => {
    const items = menuItems as MenuItem[];
    let filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (activeFilter) {
      case 'available':
        return filtered.filter(item => item.isAvailable);
      case 'popular':
        return filtered.filter(item => item.isPopular);
      case 'sold out':
        return filtered.filter(item => !item.isAvailable);
      default:
        return filtered;
    }
  };

  const filteredItems = getFilteredItems();

  const filterButtons: FilterButton[] = [
    {
      label: 'All',
      icon: 'food-fork-drink',
      color: '#3B82F6',
      gradient: ['#3B82F6', '#1D4ED8']
    },
    {
      label: 'Available',
      icon: 'check-circle',
      color: '#10B981',
      gradient: ['#10B981', '#047857']
    },
    {
      label: 'Popular',
      icon: 'star',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706']
    },
    {
      label: 'Sold Out',
      icon: 'close-circle',
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626']
    }
  ];

  // Show error if no restaurant ID
  if (!restaurantId) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-xl font-bold text-gray-800 mb-2">Restaurant not found</Text>
        <Text className="text-gray-500 text-center px-8">Please log in as a restaurant owner to manage your menu.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <CommonView style={{ flex: 1, backgroundColor: 'transparent' }}>
        {/* Custom Header */}
        <Animated.View
          className="px-6 pt-12 pb-4"
          style={{
            transform: [{ translateY: headerSlideAnim }],
          }}
        >
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">Menu Items</Text>
              <Text className="text-gray-500">Manage your restaurant menu</Text>
            </View>
            <View className="bg-blue-50 px-3 py-2 rounded-full">
              <Text className="text-blue-600 font-semibold text-sm">{(menuItems as MenuItem[]).length} items</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Search Bar */}
          <View className="px-6 mb-4">
            <Searchbar
              placeholder="Search menu items..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{
                backgroundColor: '#FFFFFF',
                elevation: 2,
                borderRadius: 12,
              }}
              inputStyle={{ color: '#374151' }}
              placeholderTextColor="#9CA3AF"
              iconColor="#6B7280"
            />
          </View>

          {/* Filter Chips */}
          <View className="px-6 mb-4">
            <View className="flex-row space-x-2">
              {filterButtons.map((button) => (
                <TouchableOpacity
                  key={button.label}
                  onPress={() => handleFilterPress(button.label.toLowerCase())}
                  className={`px-4 py-2 rounded-full flex-row items-center ${
                    activeFilter === button.label.toLowerCase() 
                      ? 'bg-blue-500' 
                      : 'bg-white border border-gray-200'
                  }`}
                  style={{ elevation: activeFilter === button.label.toLowerCase() ? 2 : 0 }}
                >
                  <MaterialCommunityIcons 
                    name={button.icon as any} 
                    size={16} 
                    color={activeFilter === button.label.toLowerCase() ? '#FFFFFF' : button.color}
                  />
                  <Text className={`ml-2 text-sm font-medium ${
                    activeFilter === button.label.toLowerCase() ? 'text-white' : 'text-gray-700'
                  }`}>
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats Bar */}
          {!isLoading && !error && (
            <Card className="mx-6 mb-6" style={{ elevation: 2 }}>
              <Card.Content className="py-4">
                <View className="flex-row justify-around">
                  <View className="items-center">
                    <Text className="text-xl font-bold text-green-600">
                      {(menuItems as MenuItem[]).filter(item => item.isAvailable).length}
                    </Text>
                    <Text className="text-sm text-gray-600">Available</Text>
                  </View>

                  <View className="items-center">
                    <Text className="text-xl font-bold text-orange-600">
                      {(menuItems as MenuItem[]).filter(item => item.isPopular).length}
                    </Text>
                    <Text className="text-sm text-gray-600">Popular</Text>
                  </View>

                  <View className="items-center">
                    <Text className="text-xl font-bold text-red-600">
                      {(menuItems as MenuItem[]).filter(item => !item.isAvailable).length}
                    </Text>
                    <Text className="text-sm text-gray-600">Sold Out</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-600 mt-4">Loading menu items...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View className="items-center justify-center py-20">
              <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
                <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
                Failed to load menu items
              </Text>
              <Text className="text-gray-500 text-center px-8 mb-4">
                {error.message || 'Something went wrong while loading your menu'}
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-blue-500 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Menu List */}
          {!isLoading && !error && (
            <FlatList
              data={filteredItems}
              renderItem={renderMenuItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={() => (
                <Animated.View
                  className="items-center justify-center py-20"
                  style={{ opacity: fadeAnim }}
                >
                  <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                    <MaterialCommunityIcons name="food-off" size={48} color="#9CA3AF" />
                  </View>
                  <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
                    {searchQuery ? 'No items found' : 'No menu items yet'}
                  </Text>
                  <Text className="text-gray-500 text-center px-8">
                    {searchQuery
                      ? `No items match "${searchQuery}"`
                      : 'Start building your menu by adding your first item'
                    }
                  </Text>
                </Animated.View>
              )}
            />
          )}
        </Animated.View>

        {/* FAB */}
        <Animated.View
          className="absolute bottom-6 right-6"
          style={{
            opacity: fabAnim,
            transform: [{
              scale: fabAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              })
            }]
          }}
        >
          <FAB
            icon="plus"
            style={{
              backgroundColor: '#3B82F6',
            }}
            onPress={handleAddFood}
          />
        </Animated.View>
      </CommonView>
    </View>
  );
};

export default MenuListScreen;