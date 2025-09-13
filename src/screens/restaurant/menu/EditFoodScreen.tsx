import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  KeyboardTypeOptions,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import CommonView from '@/src/components/common/CommonView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RestaurantMenuStackParamList } from '@/src/navigation/types';

const { width, height } = Dimensions.get('window');

interface FoodItem {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

type EditFoodScreenProps = NativeStackScreenProps<
  RestaurantMenuStackParamList,
  'EditMenuItem'
>;

export const EditFoodScreen = ({ route }: EditFoodScreenProps) => {
  const navigation = useNavigation();

  // FIXED: Use itemId from route params and create a mock food item
  // In a real app, you would fetch the item data using the itemId
  const { itemId } = route.params;

  // Mock function to get food item by ID (replace with your actual data fetching logic)
  const getFoodItemById = (id: string): FoodItem => {
    // This would typically be a database call or API request
    // For now, return mock data
    return {
      id: id,
      name: 'Sample Food Item',
      price: '12.99',
      description: 'A delicious sample food item',
      category: 'Main Course',
      image: 'https://via.placeholder.com/300x200',
    };
  };

  // Get the food item using the itemId
  const foodItem = getFoodItemById(itemId);

  const [name, setName] = useState(foodItem.name);
  const [price, setPrice] = useState(foodItem.price);
  const [description, setDescription] = useState(foodItem.description);
  const [category, setCategory] = useState(foodItem.category);
  const [image, setImage] = useState(foodItem.image);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.8)).current;
  const imageRotateAnim = useRef(new Animated.Value(0)).current;
  const formAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const buttonSlideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

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
        Animated.spring(imageScaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Form fields stagger animation
      Animated.stagger(
        150,
        formAnimations.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ),
      ),
      // Buttons animation
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
    // Pulse animation for image
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handleImagePick = async () => {
    // Image change animation
    Animated.sequence([
      Animated.timing(imageRotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      imageRotateAnim.setValue(0);
    });

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
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

    // Create updated food item
    const updatedFoodItem: FoodItem = {
      id: itemId,
      name,
      price,
      description,
      category,
      image,
    };

    console.log('Saving changes for item:', itemId, updatedFoodItem);
    // Add your save logic here - typically an API call to update the item
  };

  const handleCancel = () => {
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

  const handleBack = () => {
    handleCancel();
  };

  const rotateInterpolate = imageRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatingInterpolate = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={{ flex: 1 }}
      >
        <CommonView style={{ backgroundColor: 'transparent' }}>
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
              <Text
                style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}
              >
                Edit Item
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>
                Update your menu item details
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
            </TouchableOpacity>
          </Animated.View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Image Section */}
              <Animated.View
                style={{
                  marginBottom: 32,
                  transform: [
                    { scale: imageScaleAnim },
                    { scale: pulseAnim },
                    { rotate: rotateInterpolate },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={handleImagePick}
                  activeOpacity={0.8}
                  style={{
                    position: 'relative',
                    height: 240,
                    borderRadius: 20,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 10,
                  }}
                >
                  <LinearGradient
                    colors={[
                      'rgba(0, 0, 0, 0.3)',
                      'transparent',
                      'rgba(0, 0, 0, 0.5)',
                    ]}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 2,
                    }}
                  />
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0.1)',
                        'rgba(255, 255, 255, 0.05)',
                      ]}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="camera"
                        size={40}
                        color="#ffffff"
                      />
                      <Text style={{ color: '#ffffff', marginTop: 8 }}>
                        No Image
                      </Text>
                    </LinearGradient>
                  )}

                  {/* Camera overlay */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="camera"
                      size={20}
                      color="#007AFF"
                    />
                  </View>

                  {/* Edit overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 12,
                      zIndex: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: 12,
                        textAlign: 'center',
                        fontWeight: '500',
                      }}
                    >
                      Tap to change image
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Form Fields */}
              <View style={{ gap: 20 }}>
                {[
                  {
                    label: 'Food Name',
                    value: name,
                    onChangeText: setName,
                    icon: 'food',
                    placeholder: 'Enter food name',
                  },
                  {
                    label: 'Price',
                    value: price,
                    onChangeText: setPrice,
                    icon: 'currency-usd',
                    keyboardType: 'decimal-pad',
                    placeholder: '0.00',
                  },
                  {
                    label: 'Category',
                    value: category,
                    onChangeText: setCategory,
                    icon: 'tag',
                    placeholder: 'Select category',
                  },
                  {
                    label: 'Description',
                    value: description,
                    onChangeText: setDescription,
                    icon: 'text',
                    multiline: true,
                    numberOfLines: 4,
                    placeholder: 'Describe the dish...',
                  },
                ].map((field, index) => (
                  <Animated.View
                    key={field.label}
                    style={{
                      opacity: formAnimations[index],
                      transform: [
                        {
                          translateX: formAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [120 * (index % 2 === 0 ? 1 : -1), 0],
                          }),
                        },
                        {
                          scale: formAnimations[index].interpolate({
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
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <TextInput
                        mode="outlined"
                        label={field.label}
                        value={field.value}
                        onChangeText={field.onChangeText}
                        placeholder={field.placeholder}
                        keyboardType={field.keyboardType as KeyboardTypeOptions}
                        multiline={field.multiline}
                        numberOfLines={field.numberOfLines}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        theme={{
                          colors: {
                            primary: '#4facfe',
                            text: '#ffffff',
                            placeholder: 'rgba(255, 255, 255, 0.6)',
                            background: 'transparent',
                            outline: 'rgba(255, 255, 255, 0.3)',
                          },
                        }}
                        textColor="#ffffff"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        outlineStyle={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          borderRadius: 15,
                        }}
                        left={
                          <TextInput.Icon
                            icon={field.icon}
                            color="rgba(255, 255, 255, 0.7)"
                          />
                        }
                      />
                    </View>
                  </Animated.View>
                ))}
              </View>

              {/* Action Buttons */}
              <Animated.View
                style={{
                  marginTop: 40,
                  transform: [{ translateY: buttonSlideAnim }],
                }}
              >
                <View
                  style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0.1)',
                        'rgba(255, 255, 255, 0.05)',
                      ]}
                      style={{
                        paddingVertical: 18,
                        borderRadius: 15,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Text
                        style={{
                          color: '#ffffff',
                          fontWeight: '600',
                          fontSize: 16,
                        }}
                      >
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
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <MaterialCommunityIcons
                          name="content-save"
                          size={20}
                          color="#ffffff"
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{
                            color: '#ffffff',
                            fontWeight: '700',
                            fontSize: 16,
                          }}
                        >
                          Save Changes
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                    <LinearGradient
                      colors={[
                        'rgba(52, 199, 89, 0.2)',
                        'rgba(52, 199, 89, 0.1)',
                      ]}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(52, 199, 89, 0.3)',
                      }}
                    >
                      <Text
                        style={{
                          color: '#34c759',
                          fontWeight: '600',
                          fontSize: 14,
                        }}
                      >
                        Mark Available
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 149, 0, 0.2)',
                        'rgba(255, 149, 0, 0.1)',
                      ]}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 149, 0, 0.3)',
                      }}
                    >
                      <Text
                        style={{
                          color: '#ff9500',
                          fontWeight: '600',
                          fontSize: 14,
                        }}
                      >
                        Mark Popular
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </CommonView>
      </LinearGradient>
    </>
  );
};
