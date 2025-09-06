import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './common/LanguageSelector';
interface OnboardingInfo {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

// Constants
const WELCOME_TIMEOUT = 7000;
const ANIMATION_DURATION = 800;
const CARD_ANIMATION_DURATION = 100;

// Types
interface UserType {
  id: 'customer' | 'restaurant';
  image: ImageSourcePropType;
  title: string;
}

interface OnboardingScreenProps {
  OnboardingSlides: OnboardingInfo[];
  onComplete: (userType: 'customer' | 'restaurant') => void;
  onLogin: (selectedUserType: 'customer' | 'restaurant') => void;
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
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16,
                textAlign: 'center',
                color: colors.onSurface,
              }}
            >
              {t('welcome_to_foodrush')}
            </Text>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                lineHeight: 28,
                paddingHorizontal: 16,
                color: colors.onSurface,
              }}
            >
              {t('onboarding_welcome')}
            </Text>
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
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 16,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  {slide.title}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    lineHeight: 24,
                    marginBottom: 32,
                    color: 'white',
                  }}
                >
                  {slide.description}
                </Text>

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
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: 'white',
                      }}
                    >
                      {t('skip')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onNext}
                    style={{
                      backgroundColor: colors.surface,
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
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        marginRight: 8,
                        color: 'white',
                      }}
                    >
                      {isLastSlide ? t('next') : t('next')}
                    </Text>
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

// User Type Selection Screen
const UserTypeSelectionScreen = memo(
  ({
    onSelectUserType,
    onLogin,
    selectedType,
  }: {
    onSelectUserType: (userType: 'customer' | 'restaurant') => void;
    onLogin: () => void;
    selectedType: 'customer' | 'restaurant' | null;
  }) => {
    const { colors } = useTheme();
    const { t } = useTranslation('translation');
    const scaleAnims = useRef<Record<string, Animated.Value>>({
      customer: new Animated.Value(1),
      restaurant: new Animated.Value(1),
    }).current;

    const handleUserTypePress = useCallback(
      (userType: 'customer' | 'restaurant') => {
        // Animate card selection
        Animated.sequence([
          Animated.timing(scaleAnims[userType], {
            toValue: 0.95,
            duration: CARD_ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnims[userType], {
            toValue: 1,
            duration: CARD_ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ]).start();

        onSelectUserType(userType);
      },
      [scaleAnims, onSelectUserType],
    );

    const getButtonStyle = useCallback(
      (isSelected: boolean) => ({
        borderRadius: 30,
        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
        elevation: isSelected ? 4 : 0,
        shadowColor: isSelected ? colors.primary : 'transparent',
        shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
        shadowOpacity: isSelected ? 0.3 : 0,
        shadowRadius: isSelected ? 4 : 0,
      }),
      [colors],
    );

    const getButtonLabelStyle = useCallback(
      (isSelected: boolean) => ({
        fontSize: 18,
        fontWeight: '600' as const,
        color: isSelected ? 'white' : '#9CA3AF',
      }),
      [],
    );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar
          barStyle={
            colors.onSurface === '#1e293b' ? 'dark-content' : 'light-content'
          }
          backgroundColor={colors.background}
        />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                marginBottom: 8,
                color: colors.onBackground,
              }}
            >
              {t('what_are_your_needs')}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors.onBackground,
              }}
            >
              {t('choose_your_role')}
            </Text>
          </View>

          {/* User Type Cards */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {userTypes.map((type) => (
              <Animated.View
                key={type.id}
                style={{
                  transform: [
                    {
                      scale: selectedType === type.id ? scaleAnims[type.id] : 1,
                    },
                  ],
                  marginBottom: 24,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor:
                      selectedType === type.id
                        ? colors.primary
                        : colors.outline,
                    backgroundColor: colors.surfaceVariant,
                    padding: 8,
                    height: SCREEN_HEIGHT / 3.5,
                    width: SCREEN_WIDTH - 48,
                    overflow: 'hidden',
                  }}
                  onPress={() => handleUserTypePress(type.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Image
                      source={type.image}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />

                    {/* Selection indicator */}
                    {selectedType === type.id && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: colors.primary,
                          borderRadius: 20,
                          padding: 8,
                        }}
                      >
                        <Ionicons name="checkmark" size={20} color="white" />
                      </View>
                    )}
                  </View>

                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 8,
                      color: colors.onSurface,
                    }}
                  >
                    {/* {t(type.title)} */} {type.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Continue Button */}
          <View style={{ paddingTop: 24 }}>
            <Button
              mode="contained"
              onPress={onLogin}
              disabled={!selectedType}
              contentStyle={{ paddingVertical: 14 }}
              style={getButtonStyle(!!selectedType)}
              labelStyle={getButtonLabelStyle(!!selectedType)}
            >
              {selectedType ? t('continue') : t('select_user_type')}
            </Button>

            {selectedType && (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 14,
                  color: colors.onSurface,
                }}
              >
                {t('you_selected')}
                {selectedType === 'customer' ? t('customer') : t('restaurant')}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  },
);

// Main Onboarding Screen
const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  OnboardingSlides,
  onComplete,
  onLogin,
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedType, setSelectedType] = useState<
    'customer' | 'restaurant' | null
  >(null);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlideIndex < OnboardingSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      setShowUserSelection(true);
    }
  }, [currentSlideIndex, OnboardingSlides.length]);

  const handleSkip = useCallback(() => {
    setShowUserSelection(true);
  }, []);

  const handleUserTypeSelection = useCallback(
    (userType: 'customer' | 'restaurant') => {
      setSelectedType(userType);
    },
    [],
  );

  const handleLogin = useCallback(() => {
    if (selectedType) {
      // Set the selected user type in the auth store
      const { useAuthStore } = require('../stores/customerStores/AuthStore');
      useAuthStore.getState().setSelectedUserType(selectedType);
      onLogin(selectedType);
    }
  }, [selectedType, onLogin]);

  // Render appropriate screen based on state
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

// Set display names for debugging
OnboardingWelcome.displayName = 'OnboardingWelcome';
OnboardingSlide.displayName = 'OnboardingSlide';
UserTypeSelectionScreen.displayName = 'UserTypeSelectionScreen';

export default memo(OnboardingScreen);
