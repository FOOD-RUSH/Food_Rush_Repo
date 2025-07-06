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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from 'react-native-paper';
import { OnboardingSlide as OnboardingInfo } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

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

// Styles object to replace Tailwind classes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: 128,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#007aff',
    borderRadius: 2,
  },
  slideContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 42,
    paddingBottom: 8,
  },
  slideCard: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    marginHorizontal: 24,
    marginRight: 10,
    marginLeft: 10,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: '#DBEAFE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: '#DBEAFE',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  nextButtonArrow: {
    color: '#007aff',
    fontSize: 18,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: 'white',
    width: 32,
  },
  indicatorInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
  },
  userSelectionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginBottom: 8,
  },
  userTypeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTypeCard: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 32,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  userTypeText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loginButton: {
    borderRadius: 25,
    borderColor: '#1E90FF',
    borderWidth: 1,
    marginTop: 24,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Main Content Container */}
        <View style={styles.centerContent}>
          {/* Logo */}
          <View style={{ marginBottom: 48 }}>
            <Image
              source={relayLogo}
              style={{
                width: screenWidth * 0.7,
                height: screenWidth * 0.7,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Animated GIF */}
          <View style={{ marginBottom: 48 }}>
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
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={styles.welcomeText}>Welcome to Food Rush!</Text>
            <Text style={styles.subtitleText}>
              Healthy meals delivered locally{'\n'}within a tap of a button.
            </Text>
          </View>
        </View>

        {/* Bottom Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
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
    <SafeAreaView style={styles.slideContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        style={styles.slideContainer}
        source={slide.image}
        resizeMode="cover"
      >
        {/* Dark Overlay */}
        <View style={styles.overlay}>
          {/* Content positioned at bottom */}
          <View style={styles.slideContent}>
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* Main Content Card */}
              <View style={styles.slideCard}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  {/* Skip Button */}
                  <TouchableOpacity
                    onPress={onSkip}
                    style={styles.skipButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.skipButtonText}>Skip</Text>
                  </TouchableOpacity>

                  {/* Next Button */}
                  <TouchableOpacity
                    onPress={onNext}
                    style={styles.nextButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.nextButtonText}>
                      {isLastSlide ? 'Next' : 'Next'}
                    </Text>
                    <Text style={styles.nextButtonArrow}>→</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Progress Indicator */}
              <View style={styles.indicatorContainer}>
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentIndex
                        ? styles.indicatorActive
                        : styles.indicatorInactive,
                    ]}
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
  onSelectUserType: (userType: 'customer' | 'restaurant') => void;
  onLogin: () => void;
}) => {
  const [selectedType, setSelectedType] = useState<
    'customer' | 'restaurant' | null
  >(null);

  const handleSelectType = useCallback(
    (type: 'customer' | 'restaurant') => {
      setSelectedType(type);
      // Complete onboarding immediately when type is selected
      onSelectUserType(type);
    },
    [onSelectUserType],
  );

  const handleLogin = useCallback(() => {
    onLogin();
  }, [onLogin]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userSelectionContainer}>
        {/* Header */}
        <View>
          <Text style={styles.headerText}>What are your needs?</Text>
        </View>

        {/* User Type Cards */}
        <View style={styles.userTypeContainer}>
          {userTypes.map((type, index) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => handleSelectType(type.id)}
              activeOpacity={0.8}
              style={[
                styles.userTypeCard,
                { marginBottom: index === userTypes.length - 1 ? 0 : 32 },
              ]}
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
                <Card.Content style={styles.cardContent}>
                  <View
                    style={{
                      position: 'relative',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      source={type.image}
                      style={[
                        styles.userImage,
                        {
                          borderWidth: selectedType === type.id ? 2 : 0,
                          borderColor:
                            selectedType === type.id
                              ? '#1E90FF'
                              : 'transparent',
                        },
                      ]}
                      resizeMode="cover"
                    />
                    {selectedType === type.id && (
                      <View style={styles.checkmarkContainer}>
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color="#1E90FF"
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.userTypeText,
                      {
                        color: selectedType === type.id ? '#1E90FF' : '#222',
                      },
                    ]}
                  >
                    {type.id}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View>
          <Button
            mode="outlined"
            onPress={handleLogin}
            textColor="#1E90FF"
            contentStyle={styles.loginButtonContent}
            style={styles.loginButton}
            labelStyle={styles.loginButtonText}
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
  onComplete: (userType: 'customer' | 'restaurant') => void;
  onLogin: () => void;
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
    onLogin();
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
