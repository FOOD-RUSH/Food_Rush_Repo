import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AwaitingApprovalScreenProps extends AuthStackScreenProps<'AwaitingApproval'> {}

const AwaitingApprovalScreen: React.FC<AwaitingApprovalScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('auth');
  const { logoutUser } = useAuthStore();

  const { restaurantId, userId } = route.params || {};

  // Enhanced animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef([...Array(4)].map(() => new Animated.Value(0))).current;

  // Start enhanced animations
  useEffect(() => {
    // Main entrance animation
    const entranceAnimation = Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(slideUpAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Animate cards sequentially
      ...cardAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 200,
          useNativeDriver: true,
        })
      ),
    ]);

    // Continuous animations
    const continuousAnimations = [
      // Floating effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -10,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ),
      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ),
      // Rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ),
      // Shimmer effect
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
    ];

    entranceAnimation.start();
    continuousAnimations.forEach(anim => anim.start());

    return () => {
      [entranceAnimation, ...continuousAnimations].forEach(anim => anim.stop());
    };
  }, []);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              navigation.getParent()?.navigate('Onboarding');
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to logout',
                position: 'top',
              });
            }
          },
        },
      ],
    );
  }, [logoutUser, navigation]);

  const handleRefresh = useCallback(async () => {
    // Add refresh animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    Toast.show({
      type: 'info',
      text1: 'Checking Status',
      text2: 'Refreshing your approval status...',
      position: 'top',
    });

    setTimeout(() => {
      Toast.show({
        type: 'info',
        text1: 'Status Update',
        text2: 'Still under review. We\'ll notify you soon!',
        position: 'top',
      });
    }, 2000);
  }, [scaleAnim]);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <CommonView>
      {/* Animated Background Gradient */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[colors.background, colors.surfaceVariant + '20', colors.primaryContainer + '10']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Floating Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { translateY: floatAnim },
              ],
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.surface + 'E0', colors.surfaceVariant + 'C0']}
              style={styles.headerButtonGradient}
            >
              <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.surface + 'E0', colors.surfaceVariant + 'C0']}
              style={styles.headerButtonGradient}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.onSurface} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.content}>
          {/* Enhanced Main Icon */}
          <Animated.View 
            style={[
              styles.mainIconContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideUpAnim },
                  { scale: scaleAnim },
                  { translateY: floatAnim },
                ],
              }
            ]}
          >
            <View style={styles.iconBackground}>
              <LinearGradient
                colors={[colors.primary + '20', colors.primaryContainer + '40']}
                style={styles.iconBackgroundGradient}
              />
              <Animated.View style={[styles.iconRing, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryContainer]}
                  style={styles.iconGradient}
                >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="time" size={50} color="white" />
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
            </View>

            {/* Floating particles */}
            <Animated.View style={[styles.particle, styles.particle1, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.particle, styles.particle2, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.particle, styles.particle3, { opacity: fadeAnim }]} />
          </Animated.View>

          {/* Enhanced Title Section */}
          <Animated.View
            style={[
              styles.titleSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <Text style={styles.title}>Under Review</Text>
            <View style={styles.titleUnderline}>
              <Animated.View 
                style={[
                  styles.shimmerLine,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  }
                ]} 
              />
            </View>
            <Text style={styles.subtitle}>Your restaurant application is being processed</Text>
          </Animated.View>

          {/* Animated Status Cards */}
          <View style={styles.cardsContainer}>
            {[
              {
                icon: 'checkmark-circle',
                title: 'Application Received',
                desc: 'Your restaurant registration has been successfully submitted',
                color: colors.primary,
              },
              {
                icon: 'document-text',
                title: 'Under Review',
                desc: 'Our team is currently reviewing your application details',
                color: colors.secondary,
              },
              {
                icon: 'mail',
                title: 'Email Notification',
                desc: 'You\'ll receive approval confirmation via email within 1-3 days',
                color: colors.tertiary,
              },
            ].map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.statusCard,
                  {
                    opacity: cardAnimations[index],
                    transform: [
                      {
                        translateY: cardAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                      {
                        scale: cardAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  }
                ]}
              >
                <LinearGradient
                  colors={[colors.surface, colors.surfaceVariant + '60']}
                  style={styles.cardGradient}
                >
                  <View style={[styles.cardIconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>

          {/* Enhanced Progress Indicator */}
          <Animated.View 
            style={[
              styles.progressSection,
              {
                opacity: cardAnimations[2],
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <Text style={styles.progressTitle}>Review Progress</Text>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={[colors.surfaceVariant, colors.outline + '40']}
                style={styles.progressBarBg}
              >
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    {
                      transform: [{ scaleX: pulseAnim }],
                    }
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryContainer]}
                    style={styles.progressGradient}
                  />
                </Animated.View>
              </LinearGradient>
            </View>
            <Text style={styles.progressText}>65% Complete</Text>
          </Animated.View>

          {/* App Info Card */}
          {(restaurantId || userId) && (
            <Animated.View 
              style={[
                styles.infoCard,
                {
                  opacity: cardAnimations[3],
                  transform: [{ translateY: slideUpAnim }],
                }
              ]}
            >
              <LinearGradient
                colors={[colors.primaryContainer + '20', colors.surface]}
                style={styles.infoCardGradient}
              >
                <Text style={styles.infoTitle}>Application Details</Text>
                {restaurantId && (
                  <View style={styles.infoRow}>
                    <Ionicons name="business" size={18} color={colors.primary} />
                    <Text style={styles.infoLabel}>Restaurant ID</Text>
                    <Text style={styles.infoValue}>{restaurantId}</Text>
                  </View>
                )}
                {userId && (
                  <View style={styles.infoRow}>
                    <Ionicons name="person" size={18} color={colors.primary} />
                    <Text style={styles.infoLabel}>User ID</Text>
                    <Text style={styles.infoValue}>{userId}</Text>
                  </View>
                )}
              </LinearGradient>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <Animated.View 
            style={[
              styles.actionSection,
              {
                opacity: cardAnimations[3],
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryContainer]}
                style={styles.refreshGradient}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.refreshText}>Check Status</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.surface, colors.surfaceVariant]}
                style={styles.contactGradient}
              >
                <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
                <Text style={styles.contactText}>Contact Support</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </CommonView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
      zIndex: 10,
    },
    headerButton: {
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    headerButtonGradient: {
      padding: 12,
      borderRadius: 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    mainIconContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    iconBackground: {
      width: 200,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    iconBackgroundGradient: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 100,
    },
    iconRing: {
      width: 120,
      height: 120,
      borderRadius: 60,
      elevation: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    iconGradient: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    particle: {
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary + '60',
    },
    particle1: { top: 30, left: 40 },
    particle2: { top: 60, right: 20 },
    particle3: { bottom: 40, left: 20 },
    titleSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 36,
      fontWeight: '800',
      color: colors.onSurface,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    titleUnderline: {
      width: 120,
      height: 4,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 2,
      marginVertical: 12,
      overflow: 'hidden',
    },
    shimmerLine: {
      width: 60,
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    subtitle: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      fontWeight: '500',
      opacity: 0.8,
    },
    cardsContainer: {
      width: '100%',
      marginBottom: 32,
    },
    statusCard: {
      marginBottom: 16,
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    cardGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    cardIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.onSurface,
      marginBottom: 4,
    },
    cardDesc: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      lineHeight: 20,
      opacity: 0.9,
    },
    progressSection: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 32,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 16,
    },
    progressBarContainer: {
      width: '100%',
      marginBottom: 12,
    },
    progressBarBg: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      width: '65%',
      height: '100%',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressGradient: {
      width: '100%',
      height: '100%',
    },
    progressText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    infoCard: {
      width: '100%',
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 32,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    infoCardGradient: {
      padding: 24,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
      marginLeft: 12,
    },
    infoValue: {
      fontSize: 14,
      color: colors.onSurface,
      fontFamily: 'monospace',
      fontWeight: '500',
    },
    actionSection: {
      width: '100%',
      gap: 16,
    },
    refreshButton: {
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    refreshGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      gap: 12,
    },
    refreshText: {
      fontSize: 16,
      fontWeight: '700',
      color: 'white',
    },
    contactButton: {
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    contactGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.outline + '40',
    },
    contactText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
  });

export default AwaitingApprovalScreen;