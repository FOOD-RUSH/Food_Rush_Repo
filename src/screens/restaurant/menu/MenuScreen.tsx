import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge, TextInput, Chip, useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantMenuStackParamList } from '@/src/navigation/types';

type MenuOption = {
  title: string;
  icon: string;
  screen?: keyof RestaurantMenuStackParamList;
  description: string;
  isImplemented: boolean;
  category: 'items' | 'categories' | 'settings';
  count?: number;
};

const MenuScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RestaurantMenuStackParamList>>();
  const { t } = useTranslation();

  const menuOptions: MenuOption[] = [
    { title: t('menu_items'), icon: 'food', screen: 'MenuList', description: t('view_manage_menu_items'), isImplemented: true, category: 'items' },
    { title: t('add_new_item'), icon: 'plus-circle', screen: 'AddMenuItem', description: t('add_new_dish'), isImplemented: true, category: 'items' },
    { title: t('manage_categories'), icon: 'tag-multiple', screen: 'Categories', description: t('manage_menu_categories'), isImplemented: true, category: 'categories' },
    { title: t('add_category'), icon: 'playlist-plus', screen: 'AddCategory', description: t('create_new_category'), isImplemented: true, category: 'categories' },
    { title: t('menu_settings'), icon: 'cog', screen: 'MenuSettings', description: t('configure_menu_preferences'), isImplemented: true, category: 'settings' },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'items' | 'categories' | 'settings'>('all');
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuStats] = useState({ menuItems: 47, categories: 8, active: 42 });

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.timing(filterAnim, { toValue: 1, duration: 600, delay: 400, useNativeDriver: true }).start();
  }, [fadeAnim, filterAnim]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.02 : 1,
      friction: 5,
      useNativeDriver: true
    }).start();
  }, [isFocused, scaleAnim]);

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleNavigation = (option: MenuOption) => {
    Haptics.selectionAsync();
    
    if (!option.isImplemented) {
      Alert.alert(
        'Coming Soon',
        `${option.title} feature is not implemented yet. This feature is coming soon!`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    try {
      if (option.screen && option.screen !== 'MenuScreen') {
        // Fix the navigation typing issue by using type assertion
        (navigation as any).navigate(option.screen);
      }
    } catch (error) {
      Alert.alert(
        'Navigation Error',
        `Screen "${option.screen}" is not available yet. This feature is coming soon!`,
        [{ text: 'OK', style: 'default' }]
      );
      console.log('Navigation error:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'items': return '#3B82F6';
      case 'categories': return '#6B7280';
      case 'settings': return '#4B5563';
      default: return '#3B82F6';
    }
  };

  const filteredOptions = menuOptions.filter(option =>
    (option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedFilter === 'all' || option.category === selectedFilter)
  );

  const renderMenuCard = ({ item, index }: { item: MenuOption; index: number }) => {
    const inputRange = [
      -1,
      0,
      120 * index,
      120 * (index + 2),
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.95],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={{ 
          transform: [{ scale }], 
          opacity, 
          marginBottom: 12 
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            paddingVertical: 16,
            paddingHorizontal: 8,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderLeftWidth: 4,
            borderLeftColor: getCategoryColor(item.category),
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
          }}
          onPress={() => handleNavigation(item)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${getCategoryColor(item.category)}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              <MaterialCommunityIcons name={item.icon as any} size={20} color={getCategoryColor(item.category)} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111' }}>{item.title}</Text>
                {!item.isImplemented && (
                  <Badge style={{ backgroundColor: '#F59E0B', marginLeft: 8 }}>
                    SOON
                  </Badge>
                )}
              </View>
              <Text style={{ color: '#6B7280', fontSize: 13 }} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getStatusColor = (filter: string): string => {
    switch (filter) {
      case 'items':
        return '#3B82F6'; // Blue color used for items
      case 'categories':
        return '#6B7280'; // Gray color used for categories
      case 'settings':
        return '#4B5563'; // Darker gray for settings
      case 'all':
        return '#3B82F6'; // Default blue color for 'all' filter
      default:
        return '#3B82F6'; // Fallback to blue
    }
  };
  return (
      <CommonView>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          {/* Header */}
          <Animated.View style={{ opacity: fadeAnim, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111' }}>{t('menu_dashboard')}</Text>
                <Text style={{ color: '#6B7280', marginTop: 2 }}>{t('manage_restaurant_menu')}</Text>
              </View>
              <TouchableOpacity 
                style={{ backgroundColor: '#DBEAFE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
                onPress={() => {
                  Haptics.selectionAsync();
                  // Add navigation to analytics if needed
                }}
              >
                <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Analytics</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Search */}


<TextInput
            placeholder={t('search_menu_options')}
            left={
              <TextInput.Icon
                icon="magnify"
                size={30}
                color={colors.onSurface}
              />
            }
            mode="outlined"
            outlineStyle={{
              borderColor: colors.surface,
              borderWidth: 1,
              borderRadius: 20,
              backgroundColor: colors.surface,
            }}
            style={{
              backgroundColor: colors.surface,
            }}
            className="py-1 px-3 rounded-2xl"
            placeholderTextColor={colors.onBackground}
            pointerEvents="box-only"
            onChangeText={setSearchQuery}

          />



          {/* Filters */}
<Animated.View
style={{opacity: fadeAnim, marginBottom: 8}}
className="mb-4 mt-2"
>
<ScrollView 
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingVertical: 8, }}
>
  {['all', 'items', 'categories', 'settings'].map((filter) => (
     <Chip
                     key={filter}
                     selected={selectedFilter === filter}
                     onPress={() => {
                       Haptics.selectionAsync();
                       setSelectedFilter(filter as 'all' | 'items' | 'categories' | 'settings');
                     }}
                     style={{ 
                       backgroundColor: selectedFilter === filter ? getStatusColor(filter) : '#F3F4F6',
                       marginRight: 8,
                       borderColor: getStatusColor(filter),
                       borderWidth: selectedFilter === filter ? 0 : 1
                     }}
                     textStyle={{ 
                       color: selectedFilter === filter ? 'white' : '#4B5563',
                       fontWeight: '600'
                     }}
                     compact
                   >
                     {filter.charAt(0).toUpperCase() + filter.slice(1)}
                   </Chip>
                 ))}
               </ScrollView>
             </Animated.View>



          {/* Stats */}
          <Animated.View style={{ 
            opacity: fadeAnim,
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            backgroundColor: 'white', 
            padding: 16, 
            borderRadius: 16, 
            marginBottom: 16, 
            shadowColor: '#000', 
            shadowOpacity: 0.05, 
            shadowRadius: 5,
            elevation: 2,
          }}>
            {[
              { label: t('menu_items'), value: menuStats.menuItems, color: '#3B82F6', icon: 'food' },
              { label: t('manage_categories'), value: menuStats.categories, color: '#6B7280', icon: 'tag-multiple' },
              { label: t('active'), value: menuStats.active, color: '#10B981', icon: 'check-circle' },
            ].map(stat => (
              <View key={stat.label} style={{ alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: `${stat.color}15`, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginBottom: 6 
                }}>
                  <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 2 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Menu List */}
          <Animated.FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.title}
            renderItem={renderMenuCard}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }], 
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                <MaterialCommunityIcons name="food-off" size={40} color="#9CA3AF" />
                <Text style={{ color: '#9CA3AF', marginTop: 8 }}>{t('no_menu_options_found')}</Text>
              </View>
            }
          />
        </View>
      </CommonView>
  );
};

export default MenuScreen;