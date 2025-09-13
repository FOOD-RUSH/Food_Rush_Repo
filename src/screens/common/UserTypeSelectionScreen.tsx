import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/src/stores/customerStores/AppStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive utility functions
const getResponsiveSize = (size: number): number => {
  const baseWidth = 375; // iPhone 6/7/8 width as base
  return Math.max((SCREEN_WIDTH / baseWidth) * size, size * 0.8);
};

const getResponsiveHeight = (height: number): number => {
  const baseHeight = 667; // iPhone 6/7/8 height as base
  return Math.max((SCREEN_HEIGHT / baseHeight) * height, height * 0.7);
};

const COLORS = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  secondary: '#10B981',
  white: '#FFFFFF',
  lightBlue: '#EFF6FF',
  darkBlue: '#1E40AF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  accent: '#F59E0B',
  success: '#059669',
};

interface UserTypeSelectionScreenProps {
  onUserTypeSelect?: (userType: 'customer' | 'restaurant') => void;
}

const UserTypeSelectionScreen: React.FC<UserTypeSelectionScreenProps> = ({ 
  onUserTypeSelect 
}) => {
  const navigation = useNavigation();
  const { setUserType } = useAppStore();

  // State for screen dimensions
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const customerCardAnim = useRef(new Animated.Value(0)).current;
  const restaurantCardAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  // Update screen dimensions on orientation change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // Calculate responsive values
  const responsiveStyles = {
    isLandscape: screenData.width > screenData.height,
    isTablet: screenData.width >= 768,
    isSmallScreen: screenData.height < 700,
    screenWidth: screenData.width,
    screenHeight: screenData.height,
  };

  // Hide navigation header when component mounts
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // Enhanced animation sequence
    Animated.sequence([
      // Logo appears first
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Title fades in
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Content slides up and fades in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Cards appear with stagger
      Animated.stagger(200, [
        Animated.spring(customerCardAnim, {
          toValue: 1,
          tension: 30,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(restaurantCardAnim, {
          toValue: 1,
          tension: 30,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleUserTypeSelect = (userType: 'customer' | 'restaurant') => {
    console.log('🔥 UserTypeSelectionScreen - Setting userType to:', userType);
    
    // Haptic feedback if available
    if (Platform.OS === 'ios') {
      // Add haptic feedback for iOS
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Set userType in store
    setUserType(userType);
    
    // Call the callback if provided
    if (onUserTypeSelect) {
      onUserTypeSelect(userType);
    }
    
    // Navigate to Auth screen with reset to prevent back navigation
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#F0F9FF', '#FFFFFF', '#F0F9FF']}
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' 
              ? (responsiveStyles.isSmallScreen ? 40 : 60)
              : (responsiveStyles.isSmallScreen ? 20 : 40)
          }
        ]}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer,
            responsiveStyles.isLandscape && styles.landscapeContainer,
            // Ensure minimum height for proper scrolling
            { minHeight: responsiveStyles.screenHeight - (Platform.OS === 'ios' ? 60 : 40) }
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
        >
          {/* Enhanced Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              responsiveStyles.isSmallScreen && styles.logoContainerSmall,
              responsiveStyles.isTablet && styles.logoContainerTablet,
              { 
                opacity: fadeAnim, 
                transform: [{ scale: logoScaleAnim }] 
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <LinearGradient 
                colors={[COLORS.primary, COLORS.primaryLight]} 
                style={[
                  styles.logo,
                  responsiveStyles.isSmallScreen && styles.logoSmall,
                  responsiveStyles.isTablet && styles.logoTablet,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name="restaurant" 
                  size={responsiveStyles.isTablet ? 52 : responsiveStyles.isSmallScreen ? 32 : 42} 
                  color={COLORS.white} 
                />
              </LinearGradient>
              <View style={[
                styles.logoBadge,
                responsiveStyles.isSmallScreen && styles.logoBadgeSmall
              ]}>
                <Text style={[
                  styles.badgeText,
                  responsiveStyles.isSmallScreen && styles.badgeTextSmall
                ]}>Premium</Text>
              </View>
            </View>
            
            <Animated.View style={{ opacity: titleAnim }}>
              <Text style={[
                styles.title,
                responsiveStyles.isSmallScreen && styles.titleSmall,
                responsiveStyles.isTablet && styles.titleTablet
              ]}>Welcome to FoodRush</Text>
              <Text style={[
                styles.subtitle,
                responsiveStyles.isSmallScreen && styles.subtitleSmall,
                responsiveStyles.isTablet && styles.subtitleTablet
              ]}>
                Your culinary journey starts here
              </Text>
              <Text style={[
                styles.description,
                responsiveStyles.isSmallScreen && styles.descriptionSmall,
                responsiveStyles.isTablet && styles.descriptionTablet
              ]}>
                Choose how you&apos;d like to continue and join thousands of satisfied users
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Enhanced Cards Container */}
          <Animated.View 
            style={[
              styles.cardsContainer,
              responsiveStyles.isLandscape && styles.cardsContainerLandscape,
              responsiveStyles.isTablet && styles.cardsContainerTablet,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[
              styles.cardsWrapper,
              responsiveStyles.isLandscape && styles.cardsWrapperLandscape,
              responsiveStyles.isTablet && styles.cardsWrapperTablet
            ]}>
              {/* Customer Card */}
              <Animated.View
                style={[
                  styles.card,
                  responsiveStyles.isLandscape && styles.cardLandscape,
                  responsiveStyles.isTablet && styles.cardTablet,
                  {
                    transform: [
                      { 
                        scale: customerCardAnim.interpolate({ 
                          inputRange: [0, 1], 
                          outputRange: [0.8, 1] 
                        }) 
                      },
                      { 
                        translateY: customerCardAnim.interpolate({ 
                          inputRange: [0, 1], 
                          outputRange: [40, 0] 
                        }) 
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity 
                  style={styles.cardTouchable} 
                  onPress={() => handleUserTypeSelect('customer')} 
                  activeOpacity={0.85}
                >
                  <LinearGradient 
                    colors={['#FFFFFF', '#F8FAFC']} 
                    style={[
                      styles.cardGradient,
                      responsiveStyles.isSmallScreen && styles.cardGradientSmall,
                      responsiveStyles.isTablet && styles.cardGradientTablet
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[
                      styles.cardIconContainer, 
                      { backgroundColor: '#EFF6FF' },
                      responsiveStyles.isSmallScreen && styles.cardIconContainerSmall,
                      responsiveStyles.isTablet && styles.cardIconContainerTablet
                    ]}>
                      <Ionicons 
                        name="person" 
                        size={responsiveStyles.isTablet ? 44 : responsiveStyles.isSmallScreen ? 28 : 36} 
                        color={COLORS.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.cardTitle,
                      responsiveStyles.isSmallScreen && styles.cardTitleSmall,
                      responsiveStyles.isTablet && styles.cardTitleTablet
                    ]}>I&apos;m a Customer</Text>
                    <Text style={[
                      styles.cardDescription,
                      responsiveStyles.isSmallScreen && styles.cardDescriptionSmall,
                      responsiveStyles.isTablet && styles.cardDescriptionTablet
                    ]}>
                      Discover amazing restaurants, order delicious food, and enjoy seamless dining experiences
                    </Text>
                    
                    {/* Features List */}
                    <View style={[
                      styles.featuresList,
                      responsiveStyles.isSmallScreen && styles.featuresListSmall
                    ]}>
                      {['Browse restaurants', 'Easy ordering', 'Real-time tracking'].map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Ionicons 
                            name="checkmark-circle" 
                            size={responsiveStyles.isSmallScreen ? 14 : 16} 
                            color={COLORS.success} 
                          />
                          <Text style={[
                            styles.featureText,
                            responsiveStyles.isSmallScreen && styles.featureTextSmall
                          ]}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    <LinearGradient 
                      colors={[COLORS.primary, COLORS.primaryLight]}
                      style={[
                        styles.cardButton,
                        responsiveStyles.isSmallScreen && styles.cardButtonSmall,
                        responsiveStyles.isTablet && styles.cardButtonTablet
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[
                        styles.cardButtonText,
                        responsiveStyles.isSmallScreen && styles.cardButtonTextSmall,
                        responsiveStyles.isTablet && styles.cardButtonTextTablet
                      ]}>Continue as Customer</Text>
                      <Ionicons 
                        name="arrow-forward" 
                        size={responsiveStyles.isTablet ? 22 : responsiveStyles.isSmallScreen ? 16 : 18} 
                        color={COLORS.white} 
                      />
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Restaurant Card */}
              <Animated.View
                style={[
                  styles.card,
                  responsiveStyles.isLandscape && styles.cardLandscape,
                  responsiveStyles.isTablet && styles.cardTablet,
                  {
                    transform: [
                      { 
                        scale: restaurantCardAnim.interpolate({ 
                          inputRange: [0, 1], 
                          outputRange: [0.8, 1] 
                        }) 
                      },
                      { 
                        translateY: restaurantCardAnim.interpolate({ 
                          inputRange: [0, 1], 
                          outputRange: [40, 0] 
                        }) 
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity 
                  style={styles.cardTouchable} 
                  onPress={() => handleUserTypeSelect('restaurant')} 
                  activeOpacity={0.85}
                >
                  <LinearGradient 
                    colors={['#FFFFFF', '#F8FAFC']} 
                    style={[
                      styles.cardGradient,
                      responsiveStyles.isSmallScreen && styles.cardGradientSmall,
                      responsiveStyles.isTablet && styles.cardGradientTablet
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[
                      styles.cardIconContainer, 
                      { backgroundColor: '#F0FDF4' },
                      responsiveStyles.isSmallScreen && styles.cardIconContainerSmall,
                      responsiveStyles.isTablet && styles.cardIconContainerTablet
                    ]}>
                      <Ionicons 
                        name="storefront" 
                        size={responsiveStyles.isTablet ? 44 : responsiveStyles.isSmallScreen ? 28 : 36} 
                        color={COLORS.secondary} 
                      />
                    </View>
                    <Text style={[
                      styles.cardTitle,
                      responsiveStyles.isSmallScreen && styles.cardTitleSmall,
                      responsiveStyles.isTablet && styles.cardTitleTablet
                    ]}>I&apos;m a Restaurant</Text>
                    <Text style={[
                      styles.cardDescription,
                      responsiveStyles.isSmallScreen && styles.cardDescriptionSmall,
                      responsiveStyles.isTablet && styles.cardDescriptionTablet
                    ]}>
                      Manage your restaurant, receive orders, and grow your business with our powerful platform
                    </Text>
                    
                    {/* Features List */}
                    <View style={[
                      styles.featuresList,
                      responsiveStyles.isSmallScreen && styles.featuresListSmall
                    ]}>
                      {['Manage orders', 'Analytics dashboard', 'Menu management'].map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Ionicons 
                            name="checkmark-circle" 
                            size={responsiveStyles.isSmallScreen ? 14 : 16} 
                            color={COLORS.success} 
                          />
                          <Text style={[
                            styles.featureText,
                            responsiveStyles.isSmallScreen && styles.featureTextSmall
                          ]}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    <LinearGradient 
                      colors={[COLORS.secondary, '#059669']}
                      style={[
                        styles.cardButton,
                        responsiveStyles.isSmallScreen && styles.cardButtonSmall,
                        responsiveStyles.isTablet && styles.cardButtonTablet
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[
                        styles.cardButtonText,
                        responsiveStyles.isSmallScreen && styles.cardButtonTextSmall,
                        responsiveStyles.isTablet && styles.cardButtonTextTablet
                      ]}>Continue as Restaurant</Text>
                      <Ionicons 
                        name="arrow-forward" 
                        size={responsiveStyles.isTablet ? 22 : responsiveStyles.isSmallScreen ? 16 : 18} 
                        color={COLORS.white} 
                      />
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Enhanced Footer */}
          <Animated.View style={[
            styles.footer, 
            responsiveStyles.isSmallScreen && styles.footerSmall,
            { opacity: fadeAnim }
          ]}>
            <View style={styles.footerContent}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
              <Text style={[
                styles.footerText,
                responsiveStyles.isSmallScreen && styles.footerTextSmall
              ]}>
                Secure • Trusted by 10k+ users • 99.9% uptime
              </Text>
            </View>
            <Text style={[
              styles.termsText,
              responsiveStyles.isSmallScreen && styles.termsTextSmall
            ]}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  landscapeContainer: {
    paddingHorizontal: 40,
  },
  logoContainer: { 
    alignItems: 'center', 
    paddingHorizontal: getResponsiveSize(24), 
    paddingVertical: getResponsiveHeight(20),
    marginBottom: getResponsiveHeight(10),
  },
  logoContainerSmall: {
    paddingVertical: getResponsiveHeight(10),
    marginBottom: getResponsiveHeight(5),
  },
  logoContainerTablet: {
    paddingVertical: getResponsiveHeight(30),
    marginBottom: getResponsiveHeight(15),
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: getResponsiveHeight(20),
  },
  logo: { 
    width: getResponsiveSize(90), 
    height: getResponsiveSize(90), 
    borderRadius: getResponsiveSize(25), 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoSmall: {
    width: getResponsiveSize(70),
    height: getResponsiveSize(70),
    borderRadius: getResponsiveSize(18),
  },
  logoTablet: {
    width: getResponsiveSize(120),
    height: getResponsiveSize(120),
    borderRadius: getResponsiveSize(32),
  },
  logoBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logoBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  badgeTextSmall: {
    fontSize: 8,
  },
  title: { 
    fontSize: getResponsiveSize(28), 
    fontWeight: 'bold', 
    color: COLORS.darkBlue, 
    textAlign: 'center', 
    marginBottom: getResponsiveHeight(8),
    letterSpacing: 0.5,
  },
  titleSmall: {
    fontSize: getResponsiveSize(24),
    marginBottom: getResponsiveHeight(6),
  },
  titleTablet: {
    fontSize: getResponsiveSize(36),
    marginBottom: getResponsiveHeight(12),
  },
  subtitle: { 
    fontSize: getResponsiveSize(16), 
    color: COLORS.gray, 
    textAlign: 'center', 
    marginBottom: getResponsiveHeight(8),
    fontWeight: '500',
  },
  subtitleSmall: {
    fontSize: getResponsiveSize(14),
    marginBottom: getResponsiveHeight(6),
  },
  subtitleTablet: {
    fontSize: getResponsiveSize(20),
    marginBottom: getResponsiveHeight(12),
  },
  description: { 
    fontSize: getResponsiveSize(14), 
    color: COLORS.gray, 
    textAlign: 'center', 
    paddingHorizontal: getResponsiveSize(20),
    lineHeight: getResponsiveHeight(20),
  },
  descriptionSmall: {
    fontSize: getResponsiveSize(12),
    lineHeight: getResponsiveHeight(16),
    paddingHorizontal: getResponsiveSize(15),
  },
  descriptionTablet: {
    fontSize: getResponsiveSize(18),
    lineHeight: getResponsiveHeight(26),
    paddingHorizontal: getResponsiveSize(40),
  },
  cardsContainer: { 
    flex: 1, 
    paddingHorizontal: getResponsiveSize(20), 
    paddingBottom: getResponsiveHeight(20),
    minHeight: getResponsiveHeight(400), // Ensure minimum height for scrolling
  },
  cardsContainerLandscape: {
    paddingHorizontal: getResponsiveSize(40),
  },
  cardsContainerTablet: {
    paddingHorizontal: getResponsiveSize(60),
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: 'space-around',
  },
  cardsWrapperLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getResponsiveSize(20),
  },
  cardsWrapperTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getResponsiveSize(30),
  },
  card: { 
    marginBottom: getResponsiveHeight(20), 
    borderRadius: getResponsiveSize(20), 
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  cardLandscape: {
    flex: 1,
    marginBottom: 0,
  },
  cardTablet: {
    flex: 1,
    marginBottom: 0,
  },
  cardTouchable: { 
    borderRadius: getResponsiveSize(20), 
    overflow: 'hidden',
  },
  cardGradient: { 
    padding: getResponsiveSize(24), 
    alignItems: 'center',
  },
  cardGradientSmall: {
    padding: getResponsiveSize(18),
  },
  cardGradientTablet: {
    padding: getResponsiveSize(32),
  },
  cardIconContainer: { 
    width: getResponsiveSize(64), 
    height: getResponsiveSize(64), 
    borderRadius: getResponsiveSize(32), 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: getResponsiveHeight(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIconContainerSmall: {
    width: getResponsiveSize(48),
    height: getResponsiveSize(48),
    borderRadius: getResponsiveSize(24),
    marginBottom: getResponsiveHeight(12),
  },
  cardIconContainerTablet: {
    width: getResponsiveSize(80),
    height: getResponsiveSize(80),
    borderRadius: getResponsiveSize(40),
    marginBottom: getResponsiveHeight(20),
  },
  cardTitle: { 
    fontSize: getResponsiveSize(20), 
    fontWeight: 'bold', 
    color: COLORS.darkBlue, 
    marginBottom: getResponsiveHeight(8), 
    textAlign: 'center',
  },
  cardTitleSmall: {
    fontSize: getResponsiveSize(18),
    marginBottom: getResponsiveHeight(6),
  },
  cardTitleTablet: {
    fontSize: getResponsiveSize(24),
    marginBottom: getResponsiveHeight(12),
  },
  cardDescription: { 
    fontSize: getResponsiveSize(14), 
    color: COLORS.gray, 
    textAlign: 'center', 
    lineHeight: getResponsiveHeight(20), 
    marginBottom: getResponsiveHeight(20),
    paddingHorizontal: getResponsiveSize(8),
  },
  cardDescriptionSmall: {
    fontSize: getResponsiveSize(12),
    lineHeight: getResponsiveHeight(16),
    marginBottom: getResponsiveHeight(15),
    paddingHorizontal: getResponsiveSize(4),
  },
  cardDescriptionTablet: {
    fontSize: getResponsiveSize(16),
    lineHeight: getResponsiveHeight(24),
    marginBottom: getResponsiveHeight(24),
    paddingHorizontal: getResponsiveSize(12),
  },
  featuresList: {
    marginBottom: getResponsiveHeight(24),
    gap: getResponsiveHeight(8),
  },
  featuresListSmall: {
    marginBottom: getResponsiveHeight(18),
    gap: getResponsiveHeight(6),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(12),
  },
  featureText: {
    fontSize: getResponsiveSize(13),
    color: COLORS.gray,
    fontWeight: '500',
  },
  featureTextSmall: {
    fontSize: getResponsiveSize(11),
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveHeight(14),
    paddingHorizontal: getResponsiveSize(24),
    borderRadius: getResponsiveSize(30),
    gap: getResponsiveSize(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardButtonSmall: {
    paddingVertical: getResponsiveHeight(10),
    paddingHorizontal: getResponsiveSize(18),
    borderRadius: getResponsiveSize(25),
    gap: getResponsiveSize(6),
  },
  cardButtonTablet: {
    paddingVertical: getResponsiveHeight(18),
    paddingHorizontal: getResponsiveSize(32),
    borderRadius: getResponsiveSize(35),
    gap: getResponsiveSize(12),
  },
  cardButtonText: {
    fontSize: getResponsiveSize(16),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cardButtonTextSmall: {
    fontSize: getResponsiveSize(14),
  },
  cardButtonTextTablet: {
    fontSize: getResponsiveSize(18),
  },
  footer: { 
    paddingHorizontal: getResponsiveSize(20), 
    paddingBottom: getResponsiveHeight(30), 
    alignItems: 'center',
    paddingTop: getResponsiveHeight(10),
  },
  footerSmall: {
    paddingBottom: getResponsiveHeight(20),
    paddingTop: getResponsiveHeight(5),
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8),
    marginBottom: getResponsiveHeight(8),
  },
  footerText: {
    fontSize: getResponsiveSize(12),
    color: COLORS.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerTextSmall: {
    fontSize: getResponsiveSize(10),
  },
  termsText: {
    fontSize: getResponsiveSize(11),
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: getResponsiveHeight(16),
    paddingHorizontal: getResponsiveSize(20),
  },
  termsTextSmall: {
    fontSize: getResponsiveSize(9),
    lineHeight: getResponsiveHeight(14),
    paddingHorizontal: getResponsiveSize(15),
  },
});

export default UserTypeSelectionScreen;