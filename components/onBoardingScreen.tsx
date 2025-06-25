import React, { useState, useEffect, useRef } from 'react';
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
import { OnboardingSlide as OnboardingInfo } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

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

    // Auto-transition after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Animated.View
        className="flex-1 justify-between items-center px-6 flex-col "
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Logo */}
        <View className="mb-8">
          <Image
            source={relayLogo}
            style={{
              width: screenWidth * 0.3,
              height: screenWidth * 0.3,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Animated GIF */}
        <View className="mb-12 bg-gray-50 rounded-3xl p-8 shadow-sm">
          <Image
            source={gif}
            style={{
              width: screenWidth * 0.4,
              height: screenWidth * 0.4,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <View className="items-center">
          <Text className="text-4xl font-bold text-blue-600 mb-4 text-center">
            Welcome to Food Rush
          </Text>
          <Text className="text-lg text-gray-600 text-center leading-6 px-4">
            Healthy meals delivered locally{'\n'}by the tap of a button
          </Text>
        </View>

        {/* Loading indicator */}
        <View className="absolute bottom-20 flex-row space-x-2">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className="w-2 h-2 bg-blue-400 rounded-full"
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              }}
            />
          ))}
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
  const relayLogo = require('@/assets/images/Foodrushlogo.png');
  const isLastSlide = currentIndex === totalSlides - 1;

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
        {/* Overlay for better text readability */}
        <View className="flex-1 bg-black/30">
          {/* Header with Logo */}
          <View className="p-4 pt-8">
            <Image
              source={relayLogo}
              style={{
                width: 80,
                height: 80,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Content Container */}
          <View className="flex-1 justify-end pb-12 bg-primaryColor ml-4 mr-4  rounded-lg">
            {/* Main Content Card */}
            <View className="mx-6 mb-8 bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {slide.title}
              </Text>
              <Text className="text-base text-gray-600 text-center leading-6 mb-3">
                {slide.description}
              </Text>

              {/* Progress Indicator */}
              <View className="flex-row justify-center mb-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 mx-1 rounded-full ${
                      index === currentIndex
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between items-center">
                {/* Skip Button */}
                <TouchableOpacity
                  onPress={onSkip}
                  className="py-3 px-6"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-500 text-base font-medium">
                    Skip
                  </Text>
                </TouchableOpacity>

                {/* Next/Get Started Button */}
                <TouchableOpacity
                  onPress={onNext}
                  className="bg-blue-600 py-3 px-8 rounded-full shadow-lg"
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-base font-semibold">
                    {isLastSlide ? 'Get Started' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Main Onboarding Screen Component
const OnboardingScreen = ({
  OnboardingSlides,
  onComplete,
}: {
  OnboardingSlides: OnboardingInfo[];
  onComplete: () => void;
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (currentSlideIndex < OnboardingSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (showWelcome) {
    return <OnboardingWelcome onComplete={handleWelcomeComplete} />;
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
