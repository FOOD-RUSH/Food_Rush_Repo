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
import { Button, Card } from 'react-native-paper';
import { OnboardingSlide as OnboardingInfo } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// User Type Interface
interface UserType {
  id: 'customer' | 'restaurant';
  image: any;
}

const userTypes: UserType[] = [
  {
    id: 'customer',
    image: require('@/assets/images/userImage.png'),
  },
  {
    id: 'restaurant',
    image: require('@/assets/images/RestaurantImage.png'),
  },
];

// Welcome Screen Component (Page 1)
const OnboardingWelcome = ({ onComplete }: { onComplete: () => void }) => {
  const relayLogo = require('@/assets/images/Foodrushlogo.png');
  const gif = require('@/assets/images/Delivery.gif');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate entrance
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

    // Auto-transition after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onComplete, slideAnim]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Animated.View
        className="flex-1 justify-center items-center px-8"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Main Content Container */}
        <View className="flex-1 justify-center items-center">
          {/* Animated GIF/Illustration */}
          <View className="mb-12">
            <Image
              source={relayLogo}
              style={{
                width: screenWidth * 0.7,
                height: screenWidth * 0.7,
              }}
              resizeMode="contain"
            />
          </View>
          <View className="mb-12">
            <Image
              source={gif}
              style={{
                width: screenWidth * 0.6,
                height: screenWidth * 0.4,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Welcome to Food Rush!
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 px-4">
              Healthy meals delivered locally{'\n'}within a tap of a button.
            </Text>
          </View>
        </View>

        {/* Bottom Progress Indicator */}
        <View className="absolute bottom-12 w-full items-center">
          <View className="w-32 h-1 bg-gray-200 rounded-full">
            <Animated.View
              className="h-1 bg-blue-600 rounded-full"
              style={{
                width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
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
  const isLastSlide = currentIndex === totalSlides - 1;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, fadeAnim]);

  return (
    <SafeAreaView className="flex-1">
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
        {/* Dark Overlay */}
        <View className="flex-1 bg-black/40">
          {/* Content positioned at bottom */}
          <View className="flex-1 justify-end mb-8 pb-2">
            <Animated.View className="mx-6" style={{ opacity: fadeAnim }}>
              {/* Main Content Card */}
              <View className="bg-blue-600 rounded-2xl p-6 mb-4">
                <Text className="text-2xl font-bold text-white mb-3 text-center">
                  {slide.title}
                </Text>
                <Text className="text-base text-blue-100 text-center leading-6 mb-6">
                  {slide.description}
                </Text>

                {/* Action Buttons */}
                <View className="flex-row justify-between items-center">
                  {/* Skip Button */}
                  <TouchableOpacity
                    onPress={onSkip}
                    className="py-3 px-6"
                    activeOpacity={0.7}
                  >
                    <Text className="text-blue-200 text-base font-medium">
                      skip
                    </Text>
                  </TouchableOpacity>

                  {/* Next Button */}
                  <TouchableOpacity
                    onPress={onNext}
                    className="bg-white py-3 px-8 rounded-full flex-row items-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-blue-600 text-base font-semibold mr-2">
                      {isLastSlide ? 'Next' : 'Next'}
                    </Text>
                    <Text className="text-blue-600 text-lg">→</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Progress Indicator */}
              <View className="flex-row justify-center space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 rounded-full ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/30 w-2'
                    }`}
                  />
                ))}
              </View>
            </Animated.View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// User Type Selection Screen Component
const UserTypeSelectionScreen = ({
  onSelectUserType,
  onLogin,
}: {
  onSelectUserType?: (userType: 'customer' | 'restaurant') => void;
  onLogin?: () => void;
}) => {
  const [selectedType, setSelectedType] = useState<
    'customer' | 'restaurant' | null
  >(null);

  const handleSelectType = useCallback(
    (type: 'customer' | 'restaurant') => {
      setSelectedType(type);
      // Optionally update userType string here if you want to sync with parent or context
      onSelectUserType?.(type);
    },
    [onSelectUserType],
  );

  const handleLogin = useCallback(() => {
    onLogin?.();
    console.log('Navigate to login');
  }, [onLogin]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-black text-left mb-2">
            What are your needs?
          </Text>
        </View>

        {/* User Type Cards - vertically flexed */}
        <View className="flex-1 justify-center items-center">
          {userTypes.map((type, index) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => handleSelectType(type.id)}
              activeOpacity={0.8}
              style={{
                marginBottom: index === userTypes.length - 1 ? 0 : 32,
                width: '80%',
                alignItems: 'center',
              }}
            >
              <Card
                style={{
                  borderRadius: 16,
                  borderWidth: selectedType === type.id ? 2 : 1,
                  borderColor: selectedType === type.id ? '#1E90FF' : '#e5e7eb',
                  backgroundColor:
                    selectedType === type.id ? '#e6f0fa' : '#fff',
                  width: '100%',
                  alignItems: 'center',
                  elevation: selectedType === type.id ? 4 : 1,
                }}
              >
                <Card.Content style={{ alignItems: 'center', padding: 20 }}>
                  <View
                    style={{
                      position: 'relative',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      source={type.image}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        borderWidth: selectedType === type.id ? 2 : 0,
                        borderColor:
                          selectedType === type.id ? '#1E90FF' : 'transparent',
                      }}
                      resizeMode="cover"
                    />
                    {selectedType === type.id && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'white',
                          borderRadius: 12,
                          padding: 2,
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color="#1E90FF"
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      marginTop: 16,
                      fontSize: 18,
                      fontWeight: '600',
                      color: selectedType === type.id ? '#1E90FF' : '#222',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type.id}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="mt-6">
          <Button
            mode="outlined"
            onPress={handleLogin}
            textColor="#1E90FF"
            contentStyle={{ paddingVertical: 8 }}
            style={{
              borderRadius: 25,
              borderColor: '#1E90FF',
              borderWidth: 1,
            }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
          >
            Login
          </Button>
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
  onComplete: (userType?: 'customer' | 'restaurant') => void;
  onLogin?: (userType?: 'customer' | 'restaurant') => void;
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showUserSelection, setShowUserSelection] = useState(false);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (currentSlideIndex < OnboardingSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Last slide completed, show user selection
      setShowUserSelection(true);
    }
  };

  const handleSkip = () => {
    // Skip to user selection
    setShowUserSelection(true);
  };

  const handleUserTypeSelection = (userType: 'customer' | 'restaurant') => {
    // Complete onboarding with selected user type
    onComplete(userType);
  };

  const handleLogin = () => {
    onLogin?.();
  };

  // Show welcome screen first
  if (showWelcome) {
    return <OnboardingWelcome onComplete={handleWelcomeComplete} />;
  }

  // Show user selection after onboarding slides
  if (showUserSelection) {
    return (
      <UserTypeSelectionScreen
        onSelectUserType={handleUserTypeSelection}
        onLogin={handleLogin}
      />
    );
  }

  // Show onboarding slides
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
