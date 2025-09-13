import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ViewStyle,
  Platform,
} from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import CommonView from '@/src/components/common/CommonView';

const { width, height } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  rating?: number;
}

interface FilterButton {
  label: string;
  icon: string;
  color: string;
  gradient: string[];
}

const MenuListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Grilled Salmon',
      price: 24.99,
      category: 'Main Course',
      image:
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      price: 12.5,
      category: 'Salads',
      image:
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      isAvailable: true,
      rating: 4.5,
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      price: 8.99,
      category: 'Desserts',
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
      isAvailable: false,
      rating: 4.9,
    },
    {
      id: '4',
      name: 'Beef Burger',
      price: 16.75,
      category: 'Main Course',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      isAvailable: true,
      isPopular: true,
      rating: 4.7,
    },
    {
      id: '5',
      name: 'Fresh Juice',
      price: 5.99,
      category: 'Beverages',
      image:
        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop',
      isAvailable: true,
      rating: 4.3,
    },
  ]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(
    menuItems.map(() => new Animated.Value(0)),
  ).current;

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
        Animated.spring(searchBarAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Menu items stagger animation
      Animated.stagger(
        100,
        itemAnimations.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          }),
        ),
      ),
      // FAB animation
      Animated.spring(fabAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    entranceSequence.start(() => {
      startContinuousAnimations();
    });
  }, []);

  const startContinuousAnimations = () => {
    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

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
    // Add item press animation
    console.log('Item pressed:', item.name);
    // Navigate to food details or edit screen
  };

  const handleAddFood = () => {
    // FAB press animation
    const fabScale = new Animated.Value(1);

    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to add menu item screen - you'll need to define this route
    console.log('Navigate to AddFood screen');
  };

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
  };

  const toggleAvailability = (itemId: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  };

  const floatingInterpolate = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const MenuItemRow: React.FC<{ item: MenuItem; index: number }> = ({
    item,
    index,
  }) => {
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
              translateX:
                itemAnimations[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [150 * (index % 2 === 0 ? 1 : -1), 0],
                }) || 0,
            },
            {
              scale:
                itemAnimations[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }) || 1,
            },
            { scale: scaleAnim },
          ],
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => handleItemPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 15,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              {/* Image Container */}
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 15,
                  overflow: 'hidden',
                  marginRight: 16,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                {item.isPopular && (
                  <LinearGradient
                    colors={[
                      'rgba(255, 193, 7, 0.9)',
                      'rgba(255, 152, 0, 0.9)',
                    ]}
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: '600',
                      }}
                    >
                      POPULAR
                    </Text>
                  </LinearGradient>
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: 4,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: 8,
                    }}
                  >
                    {item.category}
                  </Text>

                  {/* Rating */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color="#ffd700"
                    />
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 12,
                        marginLeft: 4,
                      }}
                    >
                      {item.rating}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      color: '#4facfe',
                    }}
                  >
                    ${item.price}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => toggleAvailability(item.id)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: item.isAvailable
                          ? 'rgba(52, 199, 89, 0.2)'
                          : 'rgba(255, 59, 48, 0.2)',
                        borderWidth: 1,
                        borderColor: item.isAvailable
                          ? 'rgba(52, 199, 89, 0.4)'
                          : 'rgba(255, 59, 48, 0.4)',
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: item.isAvailable ? '#34c759' : '#ff3b30',
                          fontSize: 12,
                          fontWeight: '600',
                        }}
                      >
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={16}
                        color="rgba(255, 255, 255, 0.8)"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMenuItem = ({
    item,
    index,
  }: {
    item: MenuItem;
    index: number;
  }) => <MenuItemRow item={item} index={index} />;

  // Filter items based on search query and active filter
  const getFilteredItems = () => {
    let filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    switch (activeFilter) {
      case 'available':
        return filtered.filter((item) => item.isAvailable);
      case 'popular':
        return filtered.filter((item) => item.isPopular);
      case 'sold out':
        return filtered.filter((item) => !item.isAvailable);
      default:
        return filtered;
    }
  };

  const filteredItems = getFilteredItems();

  const filterButtons: FilterButton[] = [
    {
      label: 'All',
      icon: 'food-fork-drink',
      color: '#4facfe',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      label: 'Available',
      icon: 'check-circle',
      color: '#34c759',
      gradient: ['#34c759', '#2ecc71'],
    },
    {
      label: 'Popular',
      icon: 'star',
      color: '#ffd700',
      gradient: ['#ffd700', '#ffa000'],
    },
    {
      label: 'Sold Out',
      icon: 'close-circle',
      color: '#ff3b30',
      gradient: ['#ff3b30', '#dc3545'],
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={['#000002ff', '#090909ff', '#e1e7efff']}
        style={{ flex: 1 }}
      >
        <CommonView style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Decorative floating elements */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 120,
              right: 20,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: [{ translateY: floatingInterpolate }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 200,
              left: 30,
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              transform: [{ translateY: floatingInterpolate }],
            }}
          />

          {/* Custom Header */}
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 20,
              paddingBottom: 20,
              transform: [{ translateY: headerSlideAnim }],
            }}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}
              >
                Menu Items
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>
                Manage your restaurant menu
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <MaterialCommunityIcons name="food" size={16} color="#4facfe" />
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: '600',
                  marginLeft: 4,
                }}
              >
                {menuItems.length}
              </Text>
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
            <Animated.View
              style={{
                marginBottom: 20,
                opacity: searchBarAnim,
                transform: [
                  {
                    scale: searchBarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Searchbar
                  placeholder="Search menu items..."
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={{
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                  }}
                  inputStyle={{ color: '#ffffff' }}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  iconColor="rgba(255, 255, 255, 0.8)"
                  theme={{
                    colors: {
                      primary: '#4facfe',
                      onSurface: '#ffffff',
                    },
                  }}
                />
              </View>
            </Animated.View>

            {/* Stats Bar */}
            <Animated.View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                opacity: fadeAnim,
              }}
            >
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.1)',
                  'rgba(255, 255, 255, 0.05)',
                ]}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  borderRadius: 15,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#4facfe',
                    }}
                  >
                    {menuItems.filter((item) => item.isAvailable).length}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Available
                  </Text>
                </View>

                <View
                  style={{
                    width: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    marginHorizontal: 16,
                  }}
                />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#34c759',
                    }}
                  >
                    {menuItems.filter((item) => item.isPopular).length}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Popular
                  </Text>
                </View>

                <View
                  style={{
                    width: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    marginHorizontal: 16,
                  }}
                />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#ff9500',
                    }}
                  >
                    {menuItems.filter((item) => !item.isAvailable).length}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Sold Out
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Menu List */}
            <FlatList
              data={filteredItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={() => (
                <Animated.View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 60,
                    opacity: fadeAnim,
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="food-off"
                      size={60}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </View>
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 18,
                      fontWeight: '600',
                      marginBottom: 8,
                      textAlign: 'center',
                    }}
                  >
                    {searchQuery ? 'No items found' : 'No menu items yet'}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: 14,
                      textAlign: 'center',
                      paddingHorizontal: 40,
                    }}
                  >
                    {searchQuery
                      ? `No items match "${searchQuery}"`
                      : 'Start building your menu by adding your first item'}
                  </Text>
                </Animated.View>
              )}
            />
          </Animated.View>

          {/* Bottom Filter Buttons */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              paddingBottom: Platform.OS === 'ios' ? 34 : 16,
              paddingTop: 16,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              opacity: fabAnim,
              transform: [
                {
                  translateY: fabAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingHorizontal: 16,
              }}
            >
              {filterButtons.map((button, index) => (
                <TouchableOpacity
                  key={button.label}
                  onPress={() => handleFilterPress(button.label.toLowerCase())}
                >
                  <LinearGradient
                    colors={button.gradient as any}
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 32.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      opacity:
                        activeFilter === button.label.toLowerCase() ? 1 : 0.7,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={button.icon as any}
                      size={22}
                      color="#fff"
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 11,
                        marginTop: 4,
                        fontWeight: '600',
                      }}
                    >
                      {button.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Update FAB position to be above filter buttons */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: Platform.OS === 'ios' ? 120 : 100,
              right: 20,
              opacity: fabAnim,
              transform: [
                {
                  scale: fabAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            }}
          >
            <FAB
              icon="plus"
              style={{
                backgroundColor: '#007AFF',
              }}
              onPress={handleAddFood}
            />
          </Animated.View>
        </CommonView>
      </LinearGradient>
    </>
  );
};

export default MenuListScreen;
