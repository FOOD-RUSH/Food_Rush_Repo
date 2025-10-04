import {
  IoniconsIcon,
  MaterialCommunityIcon,
} from '@/src/components/common/icons';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OrderDeliveryConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber?: string;
  restaurantName?: string;
}

const OrderDeliveryConfirmationModal: React.FC<
  OrderDeliveryConfirmationModalProps
> = ({
  visible,
  onClose,
  onConfirm,
  orderNumber = '#12345',
  restaurantName = 'Restaurant',
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showCelebration, setShowCelebration] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const deliveryBoyAnim = useRef(new Animated.Value(0)).current;
  const foodBoxAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Sparkle positions for celebration
  const sparklePositions = [
    { x: 50, y: 100 },
    { x: 150, y: 80 },
    { x: 250, y: 120 },
    { x: 300, y: 90 },
    { x: 100, y: 150 },
    { x: 200, y: 160 },
    { x: 320, y: 140 },
    { x: 80, y: 200 },
  ];

  useEffect(() => {
    if (visible) {
      // Reset animations
      slideAnim.setValue(SCREEN_HEIGHT);
      scaleAnim.setValue(0);
      deliveryBoyAnim.setValue(0);
      foodBoxAnim.setValue(0);
      sparkleAnim.setValue(0);
      setShowCelebration(false);
      setIsConfirming(false);

      // Start entrance animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start delivery animation
        startDeliveryAnimation();
      });
    }
  }, [visible]);

  const startDeliveryAnimation = () => {
    // Delivery boy walking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(deliveryBoyAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(deliveryBoyAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Food box floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(foodBoxAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(foodBoxAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Sparkle animation
    Animated.loop(
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Start celebration animation
    setShowCelebration(true);

    Animated.parallel([
      Animated.timing(celebrationScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback for celebration
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 300);

    // Auto close after celebration
    setTimeout(() => {
      onConfirm();
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      // Reset celebration state
      setShowCelebration(false);
      setIsConfirming(false);
      celebrationScale.setValue(0);
      confettiAnim.setValue(0);
    });
  };

  const deliveryBoyTranslateY = deliveryBoyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const foodBoxTranslateY = foodBoxAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const sparkleRotation = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const confettiTranslateY = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, SCREEN_HEIGHT],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />

      {/* Backdrop */}
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Main Modal */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            width: SCREEN_WIDTH - 40,
            maxHeight: SCREEN_HEIGHT * 0.8,
            backgroundColor: colors.surface,
            borderRadius: 24,
            overflow: 'hidden',
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          }}
        >
          {/* Header Gradient */}
          <LinearGradient
            colors={[colors.primary + '20', colors.primaryContainer + '40']}
            style={{
              paddingTop: 20,
              paddingBottom: 30,
              alignItems: 'center',
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.surface + '80',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <IoniconsIcon name="close" size={20} color={colors.onSurface} />
            </TouchableOpacity>

            {/* Animated Delivery Scene */}
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              {/* Background Circle */}
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.primary + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                {/* Delivery Boy */}
                <Animated.View
                  style={{
                    transform: [{ translateY: deliveryBoyTranslateY }],
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcon
                    name="bike"
                    size={40}
                    color={colors.primary}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: -15,
                      left: 15,
                    }}
                  >
                    <IoniconsIcon
                      name="person"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                </Animated.View>

                {/* Food Box */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                    transform: [{ translateY: foodBoxTranslateY }],
                  }}
                >
                  <MaterialCommunityIcon
                    name="food-takeout-box"
                    size={24}
                    color={colors.primary}
                  />
                </Animated.View>

                {/* Sparkles */}
                {sparklePositions.slice(0, 4).map((pos, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      position: 'absolute',
                      left: pos.x * 0.4,
                      top: pos.y * 0.4,
                      transform: [{ rotate: sparkleRotation }],
                    }}
                  >
                    <IoniconsIcon
                      name="sparkles"
                      size={12}
                      color={colors.primary + '60'}
                    />
                  </Animated.View>
                ))}
              </View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.onSurface,
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {t('delivery_arrived', 'Delivery Arrived! 🎉')}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                }}
              >
                {t('order_number', 'Order')} {orderNumber}
              </Text>
            </Animated.View>
          </LinearGradient>

          {/* Content */}
          <View style={{ padding: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.onSurface,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              {t(
                'confirm_delivery_question',
                'Did you receive your order from the delivery driver?',
              )}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.onSurfaceVariant,
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 20,
              }}
            >
              {t(
                'confirm_delivery_subtitle',
                'Please confirm that you have received your food order from',
              )}{' '}
              {restaurantName}
            </Text>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {/* Confirm Button */}
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={isConfirming}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  elevation: 4,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  opacity: isConfirming ? 0.7 : 1,
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <IoniconsIcon
                    name="checkmark-circle"
                    size={24}
                    color="white"
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {isConfirming
                      ? t('confirming', 'Confirming...')
                      : t('yes_received', 'Yes, I received it!')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Not Yet Button */}
              <TouchableOpacity
                onPress={handleClose}
                disabled={isConfirming}
                style={{
                  backgroundColor: colors.surfaceVariant,
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  opacity: isConfirming ? 0.5 : 1,
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <IoniconsIcon
                    name="time-outline"
                    size={24}
                    color={colors.onSurfaceVariant}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: colors.onSurfaceVariant,
                    }}
                  >
                    {t('not_yet', 'Not yet')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Celebration Overlay */}
        {showCelebration && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Confetti */}
            {Array.from({ length: 20 }).map((_, index) => (
              <Animated.View
                key={index}
                style={{
                  position: 'absolute',
                  left: Math.random() * SCREEN_WIDTH,
                  transform: [{ translateY: confettiTranslateY }],
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: [
                      '#FF6B6B',
                      '#4ECDC4',
                      '#45B7D1',
                      '#96CEB4',
                      '#FFEAA7',
                    ][index % 5],
                    borderRadius: 4,
                  }}
                />
              </Animated.View>
            ))}

            {/* Celebration Message */}
            <Animated.View
              style={{
                transform: [{ scale: celebrationScale }],
                backgroundColor: colors.surface,
                paddingHorizontal: 32,
                paddingVertical: 24,
                borderRadius: 20,
                alignItems: 'center',
                elevation: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              }}
            >
              <Text style={{ fontSize: 48, marginBottom: 8 }}>🎉</Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.primary,
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {t('congratulations', 'Congratulations!')}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                }}
              >
                {t('enjoy_meal', 'Thank you for confirming! Happy eating! 🍽️')}
              </Text>
            </Animated.View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default OrderDeliveryConfirmationModal;
