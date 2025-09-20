import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ImageSourcePropType,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './common/LanguageSelector';
import { Heading1, Heading4, Body, BodyLarge, Label } from './common/Typography';

interface OnboardingInfo {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

// Constants
const WELCOME_TIMEOUT = 7000;
const ANIMATION_DURATION = 800;

// Types
interface UserType {
  id: 'customer' | 'restaurant';
  image: ImageSourcePropType;
  title: string;
}

interface OnboardingScreenProps {
  OnboardingSlides: OnboardingInfo[];
  onComplete: () => void;
  onLogin: (selectedUserType: 'customer' | 'restaurant') => void;
  navigation?: any;
}

// User types configuration
const userTypes: UserType[] = [
  {
    id: 'customer',
    image: images.customerImg,
    title: 'looking_for_food',
  },
  {
    id: 'restaurant',
    image: images.restaurantImg,
    title: 'create_a_restaurant',
  },
];

// Welcome Screen Component
const OnboardingWelcome = memo(({ onComplete }: { onComplete: () => void }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance timer
    const timer = setTimeout(onComplete, WELCOME_TIMEOUT);
    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim, onComplete]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={
          colors.onSurface === '#1e293b' ? 'dark-content' : 'light-content'
        }
        backgroundColor={colors.background}
      />

      <Animated.View
        style={{
          flex: 1,
          paddingHorizontal: 12,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          {/* Logo */}
          <Image
            source={images.ApplogoWhite}
            style={{ width: SCREEN_WIDTH * 0.25, height: SCREEN_HEIGHT * 0.25 }}
            resizeMode="contain"
          />

          {/* Animation */}
          <Image
            source={require('@/assets/images/Delivery.gif')}
            style={{ width: SCREEN_WIDTH * 0.92, height: SCREEN_HEIGHT * 0.4 }}
            resizeMode="contain"
          />

          {/* Welcome text */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Heading1
              align="center"
              color={colors.onSurface}
              style={{ marginBottom: 16 }}
            >
              {t('welcome_to_foodrush')}
            </Heading1>
            <BodyLarge
              align="center"
              color={colors.onSurface}
              style={{
                lineHeight: 28,
                paddingHorizontal: 16,
              }}
            >
              {t('onboarding_welcome')}
            </BodyLarge>
            <LanguageSelector showLabel={false} />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
});

// Onboarding Slide Component
const OnboardingSlide = memo(
  ({
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
    const { colors } = useTheme();
    const { t } = useTranslation('translation');
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
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <ImageBackground
          style={{ flex: 1 }}
          source={slide.image}
          resizeMode="cover"
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingBottom: 64,
            }}
          >
            {/* Logo */}
            <View style={{ paddingTop: 48, paddingLeft: 24 }}>
              <Image
                source={require('@/assets/images/Foodrushlogo.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>

            {/* Content */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <View
                style={{
                  borderRadius: 24,
                  padding: 24,
                  marginHorizontal: 36,
                  marginBottom: 20,
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {/* Title and description */}
                <Heading4
                  align="center"
                  color="white"
                  style={{ marginBottom: 16 }}
                >
                  {slide.title}
                </Heading4>

                <Body
                  align="center"
                  color="white"
                  style={{
                    lineHeight: 24,
                    marginBottom: 32,
                  }}
                >
                  {slide.description}
                </Body>

                {/* Navigation buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}
                >
                  <TouchableOpacity
                    onPress={onSkip}
                    style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                    activeOpacity={0.7}
                  >
                    <Label
                      weight="medium"
                      color="white"
                    >
                      {t('skip')}
                    </Label>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onNext}
                    style={{
                      backgroundColor: colors.primary,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 25,
                      flexDirection: 'row',
                      alignItems: 'center',
                      minWidth: 90,
                      justifyContent: 'center',
                    }}
                    activeOpacity={0.8}
                  >
                    <Label
                      weight="semibold"
                      color="white"
                      style={{ marginRight: 8 }}
                    >
                      {isLastSlide ? t('next') : t('next')}
                    </Label>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Pagination indicators */}
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <View
                      key={index}
                      style={{
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        backgroundColor:
                          index === currentIndex
                            ? 'white'
                            : 'rgba(255,255,255,0.4)',
                        width: index === currentIndex ? 24 : 8,
                      }}
                    />
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>
        </ImageBackground>
      </>
    );
  },
);

// Main Onboarding Screen
const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  OnboardingSlides,
  onComplete,
  onLogin,
  navigation,
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlideIndex < OnboardingSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Onboarding slides complete, navigate to user type selection
      onComplete();
      if (navigation) {
        navigation.replace('UserTypeSelection');
      }
    }
  }, [currentSlideIndex, OnboardingSlides.length, onComplete, navigation]);

  const handleSkip = useCallback(() => {
    // Skip to user type selection
    onComplete();
    if (navigation) {
      navigation.replace('UserTypeSelection');
    }
  }, [onComplete, navigation]);

  // Render appropriate screen based on state
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

// Set display names for debugging
OnboardingWelcome.displayName = 'OnboardingWelcome';
OnboardingSlide.displayName = 'OnboardingSlide';

export default memo(OnboardingScreen);
