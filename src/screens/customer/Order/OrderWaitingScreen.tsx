import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { IoniconsIcon } from '@/src/components/common/icons';
import CommonView from '@/src/components/common/CommonView';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useOrderFlow } from '@/src/hooks/customer/useOrderFlow';
import { useOrderById } from '@/src/hooks/customer/useOrdersApi';
import Toast from 'react-native-toast-message';
import {
  Typography,
  Heading4,
  Heading5,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';

// Animated pulse component for waiting indicator
const PulseAnimation: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
  );
};

// Countdown timer component
const CountdownTimer: React.FC<{
  initialMinutes: number;
  onTimeout: () => void;
}> = ({ initialMinutes, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const { t } = useTranslation('translation');

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Text className="text-lg font-semibold text-center">
      {minutes}:{seconds.toString().padStart(2, '0')} {t('min_left')}
    </Text>
  );
};

const OrderWaitingScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'OrderTracking'>) => {
  const { orderId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Order flow hooks
  const {
    cancelOrder,
    isCancellingOrder,
    flowState,
    isConfirmed,
    isCancelled,
  } = useOrderFlow();

  // Order data
  const { data: order, refetch } = useOrderById(orderId);

  // Handle timeout (15 minutes)
  const handleTimeout = useCallback(() => {
    Alert.alert(t('restaurant_timeout'), t('restaurant_timeout_message'), [
      {
        text: t('ok'),
        onPress: () => navigation.goBack(),
      },
    ]);
  }, [navigation, t]);

  // Handle order cancellation
  const handleCancelOrder = useCallback(() => {
    Alert.alert(t('cancel_order'), t('cancel_order_confirmation'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes_cancel'),
        style: 'destructive',
        onPress: () => {
          cancelOrder();
          Toast.show({
            type: 'success',
            text1: t('order_cancelled'),
            text2: t('order_cancelled_successfully'),
          });
          navigation.goBack();
        },
      },
    ]);
  }, [cancelOrder, navigation, t]);

  // Navigate to payment when restaurant confirms
  useEffect(() => {
    if (isConfirmed && order) {
      navigation.navigate('PaymentProcessing', {
        orderId: order.id,
        amount: order.total,
        paymentMethod: 'mobile_money',
        provider: 'mtn',
      });
    }
  }, [isConfirmed, order, navigation]);

  // Handle cancellation
  useEffect(() => {
    if (isCancelled) {
      Alert.alert(t('order_cancelled'), t('order_was_cancelled'), [
        {
          text: t('ok'),
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [isCancelled, navigation, t]);

  return (
    <CommonView>
      <View className="flex-1 justify-center items-center px-6">
        {/* Animated waiting icon */}
        <PulseAnimation>
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-8"
            style={{ backgroundColor: colors.primaryContainer }}
          >
            <IoniconsIcon
              name="restaurant-outline"
              size={48}
              color={colors.primary}
            />
          </View>
        </PulseAnimation>

        {/* Main heading */}
        <Heading4
          color={colors.onSurface}
          weight="bold"
          align="center"
          style={{ marginBottom: 16 }}
        >
          {t('waiting_for_restaurant')}
        </Heading4>

        {/* Description */}
        <Body
          color={colors.onSurfaceVariant}
          align="center"
          style={{ marginBottom: 32, lineHeight: 24 }}
        >
          {t('restaurant_confirmation_time')}
        </Body>

        {/* Countdown timer */}
        <View
          className="p-4 rounded-xl mb-8"
          style={{ backgroundColor: colors.surfaceVariant }}
        >
          <CountdownTimer initialMinutes={15} onTimeout={handleTimeout} />
        </View>

        {/* Order summary */}
        {order && (
          <View
            className="w-full p-4 rounded-xl mb-8"
            style={{ backgroundColor: colors.surface }}
          >
            <Heading5
              color={colors.onSurface}
              weight="semibold"
              style={{ marginBottom: 12 }}
            >
              {t('order_summary')}
            </Heading5>

            <View className="flex-row justify-between mb-2">
              <Body color={colors.onSurfaceVariant}>{t('order_id')}</Body>
              <Body color={colors.onSurface}>#{order.id.substring(0, 8)}</Body>
            </View>

            <View className="flex-row justify-between mb-2">
              <Body color={colors.onSurfaceVariant}>{t('total')}</Body>
              <Body color={colors.onSurface} weight="semibold">
                {order.total.toLocaleString()} XAF
              </Body>
            </View>

            <View className="flex-row justify-between">
              <Body color={colors.onSurfaceVariant}>{t('items')}</Body>
              <Body color={colors.onSurface}>
                {order.items?.length || 0} {t('items')}
              </Body>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View className="w-full space-y-3">
          {/* Cancel order button */}
          <TouchableOpacity
            className="w-full py-4 rounded-xl"
            style={{ backgroundColor: colors.error }}
            onPress={handleCancelOrder}
            disabled={isCancellingOrder}
          >
            <View className="flex-row items-center justify-center">
              <IoniconsIcon
                name="close-circle-outline"
                size={20}
                color="white"
              />
              <Label color="white" weight="medium" style={{ marginLeft: 8 }}>
                {isCancellingOrder ? t('cancelling_order') : t('cancel_order')}
              </Label>
            </View>
          </TouchableOpacity>

          {/* Contact support button */}
          <TouchableOpacity
            className="w-full py-4 rounded-xl"
            style={{ backgroundColor: colors.surfaceVariant }}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: t('info'),
                text2: t('contact_support_functionality_not_implemented'),
              });
            }}
          >
            <View className="flex-row items-center justify-center">
              <IoniconsIcon
                name="chatbubble-ellipses-outline"
                size={20}
                color={colors.primary}
              />
              <Label
                color={colors.primary}
                weight="medium"
                style={{ marginLeft: 8 }}
              >
                {t('contact_support')}
              </Label>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom info */}
        <View className="mt-8">
          <Caption color={colors.onSurfaceVariant} align="center">
            {t('no_payment_until_confirmation')}
          </Caption>
        </View>
      </View>
    </CommonView>
  );
};

export default OrderWaitingScreen;
