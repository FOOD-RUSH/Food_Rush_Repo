import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Alert, Dimensions, StatusBar, ColorValue, ViewStyle, Modal, FlatList, TouchableHighlight, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CommonView from '@/src/components/common/CommonView';
import { MenuItem } from '@/src/types/MenuItem';
import { StyleSheet } from 'react-native';
import { RestaurantMenuStackParamList } from '@/src/navigation/types';

const { width, height } = Dimensions.get('window');

type MenuOption = {
  title: string;
  icon: string;
  screen?: keyof RestaurantMenuStackParamList;
  description: string;
  gradient: [ColorValue, ColorValue];
  iconColor: string;
  isImplemented: boolean;
  category: 'main' | 'items' | 'categories' | 'settings';
};

const MenuScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RestaurantMenuStackParamList>>();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const statsAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'EditMenuItem' | null>(null);
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);

  // Example menuItems array for modal selection
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      price: 24.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      price: 12.50,
      category: 'Salads',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      price: 8.99,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
      isAvailable: false,
    },
  ];

  useEffect(() => {
    // Start entrance animations
    const entranceAnimation = Animated.sequence([
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const cardStaggerAnimation = Animated.stagger(150, 
      cardAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        })
      )
    );

    const statsStaggerAnimation = Animated.stagger(300,
      statsAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        })
      )
    );

    Animated.sequence([
      entranceAnimation,
      Animated.parallel([
        cardStaggerAnimation,
        statsStaggerAnimation,
      ])
    ]).start(() => {
      setIsLoaded(true);
      startPulseAnimation();
    });

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const menuOptions: MenuOption[] = [
    // Main Menu Management
    {
      title: 'Menu Overview',
      icon: 'food',
      screen: 'MenuScreen',
      description: 'View complete menu overview',
      gradient: ['#667eea', '#764ba2'],
      iconColor: '#ffffff',
      isImplemented: true,
      category: 'main',
    },
    
    // Menu Items Management
    {
      title: 'Add Menu Item',
      icon: 'plus-circle',
      screen: 'AddMenuItem',
      description: 'Create new delicious menu items',
      gradient: ['#4facfe', '#00f2fe'],
      iconColor: '#ffffff',
      isImplemented: false, // Not implemented yet
      category: 'items',
    },
    {
      title: 'Edit Menu Item',
      icon: 'pencil',
      screen: 'EditMenuItem',
      description: 'Edit existing food items',
      gradient: ['#fa709a', '#fee140'],
      iconColor: '#ffffff',
      isImplemented: false, // Not implemented yet
      category: 'items',
    },
    
    // Categories Management
    {
      title: 'Categories',
      icon: 'tag-multiple',
      screen: 'Categories',
      description: 'Organize menu into categories',
      gradient: ['#f093fb', '#f5576c'],
      iconColor: '#ffffff',
      isImplemented: false, // Not implemented yet
      category: 'categories',
    },
    {
      title: 'Add Category',
      icon: 'tag-plus',
      screen: 'AddCategory',
      description: 'Create new menu categories',
      gradient: ['#43e97b', '#38f9d7'],
      iconColor: '#ffffff',
      isImplemented: false, // Not implemented yet
      category: 'categories',
    },
    {
      title: 'Edit Category',
      icon: 'tag-edit',
      screen: 'EditCategory',
      description: 'Modify existing categories',
      gradient: ['#ff9a9e', '#fecfef'],
      iconColor: '#ffffff',
      isImplemented: false, // Not implemented yet
      category: 'categories',
    },
    
    // Settings
    {
      title: 'Menu Settings',
      icon: 'cog',
      screen: 'MenuSettings',
      description: 'Configure menu preferences',
      gradient: ['#a8edea', '#fed6e3'],
      iconColor: '#555555',
      isImplemented: false, // Not implemented yet
      category: 'settings',
    },
  ];

  const handleNavigation = (option: MenuOption) => {
    const buttonScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (!option.isImplemented) {
      Alert.alert(
        'Coming Soon',
        `${option.title} feature is not implemented yet. This feature is coming soon!`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (option.screen === 'EditMenuItem') {
      setModalType('EditMenuItem');
      setModalVisible(true);
      return;
    }

    try {
      if (option.screen && option.screen !== 'MenuScreen') {
        // @ts-ignore - Navigation typing issue workaround
        navigation.navigate(option.screen);
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

  const handleFoodSelect = (food: MenuItem) => {
    setModalVisible(false);
    setSelectedFood(food);
    setTimeout(() => {
      if (modalType === 'EditMenuItem') {
        // @ts-ignore - Navigation typing issue workaround
        navigation.navigate('EditMenuItem', { itemId: food.id });
      }
      setModalType(null);
    }, 300);
  };

  const renderFoodModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Food Item to Edit</Text>
          <FlatList
            data={menuItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableHighlight
                underlayColor="#eee"
                onPress={() => handleFoodSelect(item)}
                style={styles.foodItem}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={{ uri: item.image }} style={styles.foodImage} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodCategory}>{item.category}</Text>
                    <Text style={styles.foodPrice}>${item.price}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleQuickAction = (action: 'add' | 'categories') => {
    if (action === 'add') {
      Alert.alert('Coming Soon', 'Add menu item feature is coming soon!');
    } else {
      Alert.alert('Coming Soon', 'Categories management feature is coming soon!');
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const groupedOptions = {
    main: menuOptions.filter(option => option.category === 'main'),
    items: menuOptions.filter(option => option.category === 'items'),
    categories: menuOptions.filter(option => option.category === 'categories'),
    settings: menuOptions.filter(option => option.category === 'settings'),
  };

  const renderSection = (title: string, options: MenuOption[], startIndex: number) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#ffffff', 
        marginBottom: 16,
        paddingLeft: 4,
      }}>
        {title}
      </Text>
      <View style={{ gap: 12 }}>
        {options.map((option, index) => (
          <Animated.View
            key={option.title}
            style={{
              opacity: cardAnimations[startIndex + index] || fadeAnim,
              transform: [{
                translateX: (cardAnimations[startIndex + index] || fadeAnim).interpolate({
                  inputRange: [0, 1],
                  outputRange: [100 * (index % 2 === 0 ? 1 : -1), 0],
                })
              }, {
                scale: (cardAnimations[startIndex + index] || fadeAnim).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                })
              }]
            }}
          >
            <TouchableOpacity
              onPress={() => handleNavigation(option)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={option.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                  opacity: option.isImplemented ? 1 : 0.7,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <MaterialCommunityIcons 
                      name={option.icon as any} 
                      size={24} 
                      color={option.iconColor} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: '#ffffff',
                        marginBottom: 2,
                      }}>
                        {option.title}
                      </Text>
                      {!option.isImplemented && (
                        <View style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          borderRadius: 8,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          marginLeft: 8,
                        }}>
                          <Text style={{
                            fontSize: 10,
                            color: '#ffffff',
                            fontWeight: '600',
                          }}>
                            SOON
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ 
                      fontSize: 12, 
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 16,
                    }}>
                      {option.description}
                    </Text>
                  </View>
                  <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={20} 
                    color="rgba(255, 255, 255, 0.8)" 
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460'] as [ColorValue, ColorValue, ColorValue]}
        style={{ flex: 1 }}
      >
        {/* @ts-ignore - CommonView with style prop workaround */}
        <CommonView style={{ backgroundColor: 'transparent' }}>
          {/* Decorative Background Elements */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: [{ rotate: rotateInterpolate }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              transform: [{ rotate: rotateInterpolate }],
            }}
          />

          {/* Header Section */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: headerSlideAnim }],
              marginBottom: 32,
              paddingTop: 20,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <LinearGradient
                  colors={['#ff6b6b', '#feca57'] as [ColorValue, ColorValue]}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <MaterialCommunityIcons name="chef-hat" size={40} color="#ffffff" />
                </LinearGradient>
              </Animated.View>
            </View>
            
            <Text style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Menu Management
            </Text>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: 16,
              textAlign: 'center',
              paddingHorizontal: 20,
            }}>
              Manage your restaurant menu with style
            </Text>
          </Animated.View>

          {/* Scrollable Content */}
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Menu Items Section */}
            {renderSection('Menu Items', groupedOptions.items, 1)}
            
            {/* Categories Section */}
            {renderSection('Categories', groupedOptions.categories, 3)}
            
            {/* Settings Section */}
            {renderSection('Settings', groupedOptions.settings, 6)}

            {/* Quick Actions Section */}
            <Animated.View 
              style={{ 
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0],
                  })
                }],
                marginBottom: 24,
              }}
            >
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '700', 
                color: '#ffffff', 
                marginBottom: 16,
                paddingLeft: 4,
              }}>
                Quick Actions
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleQuickAction('add')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#11998e', '#38ef7d'] as [ColorValue, ColorValue]}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 15,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      shadowColor: '#11998e',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>
                      Add Item
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleQuickAction('categories')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2'] as [ColorValue, ColorValue]}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 15,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      shadowColor: '#667eea',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>
                      Categories
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Statistics Section */}
            <Animated.View style={{ 
              opacity: fadeAnim,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              marginBottom: 20,
            }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '700', 
                color: '#ffffff', 
                marginBottom: 16,
                textAlign: 'center',
              }}>
                Menu Statistics
              </Text>
              
              <View style={{ flexDirection: 'row' }}>
                {[
                  { label: 'Menu Items', value: '45', color: '#4facfe', icon: 'food' as const },
                  { label: 'Categories', value: '8', color: '#43e97b', icon: 'tag-multiple' as const },
                  { label: 'Popular', value: '12', color: '#fa709a', icon: 'star' as const },
                ].map((stat, index) => (
                  <Animated.View 
                    key={stat.label}
                    style={{ 
                      flex: 1, 
                      alignItems: 'center',
                      opacity: statsAnimations[index],
                      transform: [{
                        translateY: statsAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        })
                      }]
                    }}
                  >
                    <View style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: stat.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}>
                      <MaterialCommunityIcons name={stat.icon} size={24} color="#ffffff" />
                    </View>
                    <Text style={{ 
                      fontSize: 24, 
                      fontWeight: 'bold', 
                      color: '#ffffff',
                      marginBottom: 4,
                    }}>
                      {stat.value}
                    </Text>
                    <Text style={{ 
                      fontSize: 12, 
                      color: 'rgba(255, 255, 255, 0.8)',
                      textAlign: 'center',
                    }}>
                      {stat.label}
                    </Text>
                    
                    {index < 2 && (
                      <View style={{ 
                        position: 'absolute',
                        right: -10,
                        top: '50%',
                        width: 1, 
                        height: 60,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                        transform: [{ translateY: -30 }]
                      }} />
                    )}
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          </Animated.ScrollView>
        </CommonView>
      </LinearGradient>
      {renderFoodModal()}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a2e',
  },
  foodItem: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  foodCategory: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  foodPrice: {
    fontSize: 14,
    color: '#4facfe',
    fontWeight: '600',
    marginTop: 2,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MenuScreen;