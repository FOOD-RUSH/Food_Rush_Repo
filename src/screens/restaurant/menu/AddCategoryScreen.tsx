import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  StatusBar, 
  Dimensions,
  TextInput,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import CommonView from '@/src/components/common/CommonView';

const { width, height } = Dimensions.get('window');

interface CategoryIcon {
  name: string;
  icon: string;
  color: string;
}

const AddCategoryScreen = () => {
  const navigation = useNavigation();
  
  // Form state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<CategoryIcon | null>(null);
  const [isActive, setIsActive] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const formAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const iconAnimations = useRef(Array(12).fill(0).map(() => new Animated.Value(0))).current;
  const buttonSlideAnim = useRef(new Animated.Value(100)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  // Available category icons
  const categoryIcons: CategoryIcon[] = [
    { name: 'Appetizers', icon: 'food-fork-drink', color: '#ff6b6b' },
    { name: 'Main Course', icon: 'food-steak', color: '#4ecdc4' },
    { name: 'Desserts', icon: 'cupcake', color: '#45b7d1' },
    { name: 'Beverages', icon: 'cup', color: '#96ceb4' },
    { name: 'Salads', icon: 'leaf', color: '#feca57' },
    { name: 'Soups', icon: 'bowl-mix', color: '#ff9ff3' },
    { name: 'Pizza', icon: 'pizza', color: '#54a0ff' },
    { name: 'Burgers', icon: 'hamburger', color: '#5f27cd' },
    { name: 'Seafood', icon: 'fish', color: '#00d2d3' },
    { name: 'Vegetarian', icon: 'carrot', color: '#ff9f43' },
    { name: 'Pasta', icon: 'pasta', color: '#ee5a24' },
    { name: 'Breakfast', icon: 'food-croissant', color: '#0abde3' },
  ];

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
      // Form fields stagger animation
      Animated.stagger(150, 
        formAnimations.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
      // Icons stagger animation
      Animated.stagger(50, 
        iconAnimations.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
      // Button animation
      Animated.spring(buttonSlideAnim, {
        toValue: 0,
        tension: 50,
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
      ])
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

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!selectedIcon) {
      Alert.alert('Error', 'Please select an icon for the category');
      return;
    }

    // Save animation
    const saveScale = new Animated.Value(1);
    
    Animated.sequence([
      Animated.timing(saveScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Here you would typically save to your backend/database
    Alert.alert(
      'Success', 
      `Category "${categoryName}" has been created successfully!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleIconSelect = (icon: CategoryIcon) => {
    setSelectedIcon(icon);
    
    // Icon selection animation
    const iconScale = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const floatingInterpolate = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={{ flex: 1 }}
      >
        <CommonView style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Decorative floating elements */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 80,
              right: 20,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: [{ translateY: floatingInterpolate }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 200,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
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
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>
                Add Category
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>
                Create a new menu category
              </Text>
            </View>
          </Animated.View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Category Name Field */}
            <Animated.View
              style={{
                opacity: formAnimations[0],
                transform: [{
                  translateX: formAnimations[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  })
                }],
                marginBottom: 20,
              }}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: 8 
              }}>
                Category Name *
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 15,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}>
                <TextInput
                  value={categoryName}
                  onChangeText={setCategoryName}
                  placeholder="Enter category name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                  }}
                />
              </View>
            </Animated.View>

            {/* Category Description Field */}
            <Animated.View
              style={{
                opacity: formAnimations[1],
                transform: [{
                  translateX: formAnimations[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  })
                }],
                marginBottom: 20,
              }}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: 8 
              }}>
                Description (Optional)
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 15,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 16,
                paddingVertical: 12,
                minHeight: 80,
              }}>
                <TextInput
                  value={categoryDescription}
                  onChangeText={setCategoryDescription}
                  placeholder="Describe this category..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  multiline
                  textAlignVertical="top"
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                  }}
                />
              </View>
            </Animated.View>

            {/* Icon Selection */}
            <Animated.View
              style={{
                opacity: formAnimations[2],
                transform: [{
                  scale: formAnimations[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  })
                }],
                marginBottom: 20,
              }}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: 16 
              }}>
                Choose Icon *
              </Text>
              
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
              }}>
                {categoryIcons.map((icon, index) => (
                  <Animated.View
                    key={icon.name}
                    style={{
                      opacity: iconAnimations[index],
                      transform: [{
                        scale: iconAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        })
                      }]
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleIconSelect(icon)}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: selectedIcon?.name === icon.name ? 
                          icon.color : 'rgba(255, 255, 255, 0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: selectedIcon?.name === icon.name ? 2 : 1,
                        borderColor: selectedIcon?.name === icon.name ? 
                          '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <MaterialCommunityIcons 
                        name={icon.icon as any} 
                        size={24} 
                        color={selectedIcon?.name === icon.name ? '#ffffff' : icon.color}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
              
              {selectedIcon && (
                <View style={{
                  marginTop: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}>
                  <Text style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: 14,
                    textAlign: 'center' 
                  }}>
                    Selected: {selectedIcon.name}
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Active Status Toggle */}
            <Animated.View
              style={{
                opacity: formAnimations[3],
                transform: [{
                  translateY: formAnimations[3].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }],
                marginBottom: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsActive(!isActive)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 15,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#ffffff' 
                  }}>
                    Active Category
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    color: 'rgba(255, 255, 255, 0.7)' 
                  }}>
                    Category will be visible to customers
                  </Text>
                </View>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: isActive ? '#34c759' : 'rgba(255, 255, 255, 0.3)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {isActive && (
                    <MaterialCommunityIcons name="check" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View
              style={{
                transform: [{ translateY: buttonSlideAnim }],
              }}
            >
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={handleBack}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                    style={{
                      paddingVertical: 18,
                      borderRadius: 15,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Text style={{ 
                      color: '#ffffff', 
                      fontWeight: '600', 
                      fontSize: 16 
                    }}>
                      Cancel
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#11998e', '#38ef7d']}
                    style={{
                      paddingVertical: 18,
                      borderRadius: 15,
                      alignItems: 'center',
                      shadowColor: '#11998e',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons name="plus" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={{ 
                        color: '#ffffff', 
                        fontWeight: '700', 
                        fontSize: 16 
                      }}>
                        Create Category
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </CommonView>
      </LinearGradient>
    </>
  );
};

export default AddCategoryScreen;