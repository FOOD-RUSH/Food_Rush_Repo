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
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

    const handleUserTypePress = useCallback(
      (userType: 'customer' | 'restaurant') => {
        onSelectUserType(userType);
      },
      [onSelectUserType],
    );

    const getCardStyle = useCallback(
      (isSelected: boolean) => ({
        borderRadius: 20,
        backgroundColor: colors.surfaceVariant,
        borderWidth: 3,
        borderColor: isSelected ? colors.primary : 'transparent',
        padding: 4,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: isSelected ? 8 : 2,
        shadowColor: isSelected ? colors.primary : '#000',
        shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
        shadowOpacity: isSelected ? 0.3 : 0.1,
        shadowRadius: isSelected ? 8 : 4,
      }),
      [colors],
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

    // Responsive dimensions
    const cardHeight = Math.min(SCREEN_HEIGHT * 0.28, 220);
    const cardWidth = SCREEN_WIDTH - 48;
    const imageHeight = cardHeight - 60; // Account for text and padding

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
            paddingTop: 40,
            paddingBottom: 32,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                marginBottom: 12,
                color: colors.onBackground,
                textAlign: 'center',
              }}
            >
              {t('what_are_your_needs')}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors.onBackground,
                textAlign: 'center',
                opacity: 0.8,
              }}
            >
              {t('choose_your_role')}
            </Text>
          </View>

          {/* User Type Cards */}
          <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 20 }}>
            {userTypes.map((type, index) => (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.8}
                style={[
                  getCardStyle(selectedType === type.id),
                  {
                    height: cardHeight,
                    width: cardWidth,
                    alignSelf: 'center',
                  },
                ]}
                onPress={() => handleUserTypePress(type.id)}
              >
                {/* Image Container */}
                <View 
                  style={{
                    height: imageHeight,
                    width: '100%',
                    borderRadius: 16,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Image
                    source={type.image}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />

                  {/* Selection indicator */}
                  {selectedType === type.id && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: colors.primary,
                        borderRadius: 20,
                        padding: 8,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                      }}
                    >
                      <Ionicons name="checkmark" size={20} color="white" />
                    </View>
                  )}

                  {/* Gradient overlay for better text readability */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  />
                </View>

                {/* Title */}
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: selectedType === type.id ? colors.primary : colors.onSurface,
                    }}
                  >
                    {t(type.title)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <View style={{ paddingTop: 32 }}>
            <Button
              mode="contained"
              onPress={onLogin}
              disabled={!selectedType}
              contentStyle={{ paddingVertical: 16 }}
              style={getButtonStyle(!!selectedType)}
              labelStyle={getButtonLabelStyle(!!selectedType)}
            >
              {selectedType ? t('continue') : t('select_user_type')}
            </Button>

            {selectedType && (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 16,
                  fontSize: 16,
                  color: colors.primary,
                  fontWeight: '500',
                }}
              >
                {t('you_selected')} {selectedType === 'customer' ? t('customer') : t('restaurant')}
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
