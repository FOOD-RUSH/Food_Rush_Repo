import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Alert, Dimensions, StatusBar, ColorValue, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CommonView from '@/src/components/common/CommonView';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  FoodCategories: undefined;
  AddFood: undefined;
  MenuList: undefined;
  FoodDetails: { foodItem: any };
  EditFood: { foodItem: any };
};

type MenuOption = {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  screen: keyof RootStackParamList;
  description: string;
  gradient: [ColorValue, ColorValue];
  iconColor: string;
};

const MenuScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    new Animated.Value(0)
  ]).current;
  const statsAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    const cardStaggerAnimation = Animated.stagger(200, 
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
    {
      title: 'Menu Items',
      icon: 'food',
      screen: 'MenuList',
      description: 'Browse and manage all menu items',
      gradient: ['#667eea', '#764ba2'],
      iconColor: '#ffffff',
    },
    {
      title: 'Categories',
      icon: 'food-fork-drink',
      screen: 'FoodCategories',
      description: 'Organize and manage categories',
      gradient: ['#f093fb', '#f5576c'],
      iconColor: '#ffffff',
    },
    {
      title: 'Add New Item',
      icon: 'plus-circle',
      screen: 'AddFood',
      description: 'Create new delicious menu items',
      gradient: ['#4facfe', '#00f2fe'],
      iconColor: '#ffffff',
    },
  ];

  const handleNavigation = (screen: keyof RootStackParamList) => {
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

    try {
      // Type-safe navigation using type assertion
      switch (screen) {
        case 'FoodCategories':
          navigation.navigate('FoodCategories');
          break;
        case 'AddFood':
          navigation.navigate('AddFood');
          break;
        case 'MenuList':
          navigation.navigate('MenuList');
          break;
        case 'FoodDetails':
          navigation.navigate('FoodDetails', { foodItem: {} });
          break;
        case 'EditFood':
          navigation.navigate('EditFood', { foodItem: {} });
          break;
        default:
          const exhaustiveCheck: never = screen;
          return exhaustiveCheck;
      }
    } catch (error) {
      Alert.alert(
        'Navigation Error', 
        `Screen "${screen}" is not available yet. This feature is coming soon!`,
        [{ text: 'OK', style: 'default' }]
      );
      console.log('Navigation error:', error);
    }
  };

  const handleQuickAction = (action: 'add' | 'categories') => {
    const screen = action === 'add' ? 'AddFood' : 'FoodCategories';
    handleNavigation(screen);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

          {/* Menu Options Cards */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            }}
          >
            <View style={{ gap: 20, marginBottom: 32 }}>
              {menuOptions.map((option, index) => (
                <Animated.View
                  key={option.screen}
                  style={{
                    opacity: cardAnimations[index],
                    transform: [{
                      translateX: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [150 * (index % 2 === 0 ? 1 : -1), 0],
                      })
                    }, {
                      scale: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }]
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleNavigation(option.screen)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={option.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        padding: 24,
                        borderRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 15,
                        elevation: 10,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                          width: 60,
                          height: 60,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: 30,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 20,
                        }}>
                          <MaterialCommunityIcons 
                            name={option.icon} 
                            size={30} 
                            color={option.iconColor} 
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ 
                            fontSize: 20, 
                            fontWeight: '700', 
                            color: '#ffffff',
                            marginBottom: 4,
                          }}>
                            {option.title}
                          </Text>
                          <Text style={{ 
                            fontSize: 14, 
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 20,
                          }}>
                            {option.description}
                          </Text>
                        </View>
                        <MaterialCommunityIcons 
                          name="chevron-right" 
                          size={28} 
                          color="rgba(255, 255, 255, 0.8)" 
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

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
              fontSize: 20, 
              fontWeight: '700', 
              color: '#ffffff', 
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Quick Actions
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
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
          }}>
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
        </CommonView>
      </LinearGradient>
    </>
  );
};

export default MenuScreen;