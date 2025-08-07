import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { OnboardingSlide as OnboardingInfo } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface UserType {
  id: 'customer' | 'restaurant';
  image: any;
  title: string;
}

const userTypes: UserType[] = [
  {
    id: 'customer',
    image: images.customerImg,
    title: 'Looking For Some Good Food',
  },
  {
    id: 'restaurant',
    image:images.restaurantImg,
    title: 'Create A Restaurant',
  },
];

// Welcome Screen Component (Page 1)
import { useTheme } from '@/src/hooks/useTheme';

const OnboardingWelcome = ({ onComplete }: { onComplete: () => void }) => {
  const { theme } = useTheme();
  const foodRushLogo = require('@/assets/images/Foodrushlogo.png');
  const gif = require('@/assets/images/Delivery.gif');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onComplete, slideAnim]);

  return (
    <SafeAreaView className={`flex-1 ${theme === 'light' ? 'bg-white' : 'bg-background'}`}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={theme === 'light' ? 'white' : '#0f172a'} />
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="flex-1 px-3"
      >
          <View className="flex-1 flex-col justify-between items-center mb-8">
            <Image
              source={images.ApplogoWhite}
              className="w-1/4 h-1/4"
              resizeMode="contain"
            />

            <Image
              source={gif}
              className="w-11/12 h-2/5"
              resizeMode="contain"
            />

            <View className="items-center mb-10">
              <Text className={`text-3xl font-bold mb-4 text-center ${theme === 'light' ? 'text-gray-900' : 'text-text'}`}>
                Welcome to Food Rush!
              </Text>
              <Text className={`text-lg text-center leading-7 px-4 ${theme === 'light' ? 'text-gray-600' : 'text-text-secondary'}`}>
                Healthy meals delivered locally{'\n'}within a tap of a button.
              </Text>
            </View>
          </View>
      </Animated.View>
    </SafeAreaView>
  );
};

// Onboarding Slide Component
const OnboardingSlide = ({
  slide,
  onNext,
  onSkip,
  currentIndex,
  totalSlides,
}: {
  slide: OnboardingInfo;
  onNext: () => void;
  onSkip: () => void;
  currentIndex: number;
  totalSlides: number;
}) => {
  const { theme } = useTheme();
  const isLastSlide = currentIndex === totalSlides - 1;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const foodRushLogo = require('@/assets/images/Foodrushlogo.png');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, fadeAnim]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        className="flex-1"
        source={slide.image}
        resizeMode="cover"
      >
        <View className="flex-1">
          <View className="flex-1 justify-between pb-16">
            <View className="pt-12 pl-6">
              <Image
                source={foodRushLogo}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
            <Animated.View style={{ opacity: fadeAnim }}>
              <View className={`rounded-3xl p-6 mx-9 mb-5 shadow-lg backdrop-blur-sm ${theme === 'light' ? 'bg-blue-600/95' : 'bg-secondary/95'}`}>
                <Text className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-white' : 'text-text'}`}>
                  {slide.title}
                </Text>
                <Text className={`text-base text-center leading-6 mb-8 ${theme === 'light' ? 'text-white/90' : 'text-text-secondary'}`}>
                  {slide.description}
                </Text>
                <View className="flex-row justify-between items-center mb-6">
                  <TouchableOpacity
                    onPress={onSkip}
                    className="py-3 px-4"
                    activeOpacity={0.7}
                  >
                    <Text className={`text-base font-medium ${theme === 'light' ? 'text-white/80' : 'text-text-secondary'}`}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onNext}
                    className={`py-3 px-6 rounded-full flex-row items-center min-w-[90px] justify-center shadow-md ${theme === 'light' ? 'bg-white' : 'bg-primary'}`}
                    activeOpacity={0.8}
                  >
                    <Text className={`text-base font-semibold mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-white'}`}>
                      {isLastSlide ? 'Next' : 'Next'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={theme === 'light' ? '#4285F4' : 'white'} />
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <View
                      key={index}
                      className={`h-2 rounded-full mx-1 transition-all duration-300 ${
                        index === currentIndex
                          ? `w-6 ${theme === 'light' ? 'bg-white' : 'bg-primary'}`
                          : `w-2 ${theme === 'light' ? 'bg-white/40' : 'bg-primary/40'}`
                      }`}
                    />
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

// User Type Selection Screen Component
const UserTypeSelectionScreen = ({
  onSelectUserType,
  onLogin,
  selectedType,
}: {
  onSelectUserType: (userType: 'customer' | 'restaurant') => void;
  onLogin: () => void;
  selectedType: 'customer' | 'restaurant' | null;
}) => {
  const { theme } = useTheme();
  const scaleAnims = useRef<Record<string, Animated.Value>>({
    customer: new Animated.Value(1),
    restaurant: new Animated.Value(1),
  }).current;

  const handleUserTypePress = (userType: 'customer' | 'restaurant') => {
    // Animate only the selected card
    Animated.sequence([
      Animated.timing(scaleAnims[userType], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[userType], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSelectUserType(userType);
  };

  // Create button style based on selectedType to avoid reading animated value during render
  const getButtonStyle = useCallback((isSelected: boolean) => {
    return {
      borderRadius: 30,
      backgroundColor: isSelected ? (theme === 'light' ? '#4285F4' : '#3b82f6') : (theme === 'light' ? '#E5E7EB' : '#334155'),
      elevation: isSelected ? 4 : 0,
      shadowColor: isSelected ? (theme === 'light' ? '#4285F4' : '#3b82f6') : 'transparent',
      shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
      shadowOpacity: isSelected ? 0.3 : 0,
      shadowRadius: isSelected ? 4 : 0,
    };
  }, [theme]);

  const getButtonLabelStyle = useCallback((isSelected: boolean) => {
    return {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isSelected ? 'white' : (theme === 'light' ? '#9CA3AF' : '#94a3b8'),
    };
  }, [theme]);

  return (
    <SafeAreaView className={`flex-1 ${theme === 'light' ? 'bg-gray-50' : 'bg-background'}`}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={theme === 'light' ? '#F8F9FA' : '#0f172a'} />
      <View className={`flex-1 px-6 pt-8 pb-10 ${theme === 'light' ? 'bg-gray-50' : 'bg-background'}`}>
        {/* Header */}
        <View className="mb-8">
          <Text className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-text'}`}>
            What are your needs?
          </Text>
          <Text className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-text-secondary'}`}>
            Choose your role to get started
          </Text>
        </View>

        {/* User Type Cards */}
        <View className="flex-1 justify-center">
          {userTypes.map((type, index) => (
            <Animated.View
              key={type.id}
              style={{
                transform: [
                  { scale: selectedType === type.id ? scaleAnims[type.id] : 1 },
                ],
              }}
              className="mb-6"
            >
              <TouchableOpacity
                activeOpacity={0.8}
                className={`rounded-2xl border-2 shadow-lg overflow-hidden transition-all duration-300 p-2 ${
                  selectedType === type.id
                    ? (theme === 'light' ? 'border-blue-500 shadow-blue-200' : 'border-primary shadow-primary/50')
                    : (theme === 'light' ? 'border-gray-200 shadow-gray-100' : 'border-secondary shadow-secondary/20')
                } ${theme === 'light' ? 'bg-gray-200' : 'bg-secondary'}`}
                style={{ height: screenHeight/3.7,  width: screenWidth - 48 }}
                onPress={() => handleUserTypePress(type.id)}
              >
                <View className="flex-1 ">
                  <Image
                    source={type.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* Overlay gradient for better text visibility */}
                  <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Selection indicator */}
                  {selectedType === type.id && (
                    <View className={`absolute top-4 right-4 rounded-full p-2 shadow-lg ${theme === 'light' ? 'bg-blue-500' : 'bg-primary'}`}>
                      <Ionicons name="checkmark" size={20} color="white" />
                    </View>
                  )}

                    
                  
                </View>
                <Text className={`text-xl font-bold drop-shadow-lg text-center mt-2 ${theme === 'light' ? 'text-gray-900' : 'text-text'}`}>
                      {type.title}
                    </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Login Button */}
        <View className="pt-6">
          <Button
            mode="contained"
            onPress={onLogin}
            disabled={!selectedType}
            contentStyle={{ paddingVertical: 14 }}
            style={getButtonStyle(!!selectedType)}
            labelStyle={getButtonLabelStyle(!!selectedType)}
          >
            {selectedType ? 'Continue' : 'Select a user type'}
          </Button>

          {selectedType && (
            <Text className={`text-center mt-3 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-text-secondary'}`}>
              You selected:{' '}
              {selectedType === 'customer' ? 'Customer' : 'Restaurant'}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Main Onboarding Screen Component
const OnboardingScreen = ({
  OnboardingSlides,
  onComplete,
  onLogin,
}: {
  OnboardingSlides: OnboardingInfo[];
  onComplete: (userType: 'customer' | 'restaurant') => void;
  onLogin: (selectedUserType: 'customer' | 'restaurant') => void;
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedType, setSelectedType] = useState<
    'customer' | 'restaurant' | null
  >(null);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (currentSlideIndex < OnboardingSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      setShowUserSelection(true);
    }
  };

  const handleSkip = () => {
    setShowUserSelection(true);
  };

  // Only update selectedType, do not complete onboarding yet
  const handleUserTypeSelection = (userType: 'customer' | 'restaurant') => {
    setSelectedType(userType);
    console.log('User type selected:', userType);
  };

  // Only complete onboarding when Login is pressed and a type is selected
  const handleLogin = () => {
    if (selectedType) {
      console.log('Completing onboarding for:', selectedType);
      onComplete(selectedType);
    }
  };

  if (showWelcome) {
    return <OnboardingWelcome onComplete={handleWelcomeComplete} />;
  }

  if (showUserSelection) {
    return (
      <UserTypeSelectionScreen
        onSelectUserType={handleUserTypeSelection}
        onLogin={handleLogin}
        selectedType={selectedType}
      />
    );
  }

  return (
    <OnboardingSlide
      slide={OnboardingSlides[currentSlideIndex]}
      onNext={handleNext}
      onSkip={handleSkip}
      currentIndex={currentSlideIndex}
      totalSlides={OnboardingSlides.length}
    />
  );
};

export default OnboardingScreen;
