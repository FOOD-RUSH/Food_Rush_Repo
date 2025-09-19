import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useTheme, Card, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

import { useToggleRestaurantStatus } from '@/src/hooks/restaurant/useRestaurantApi';
import { useCurrentRestaurant } from '@/src/stores/AuthStore';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface RestaurantAvailabilityToggleProps {
  currentStatus?: 'online' | 'offline';
  onStatusChange?: (isOpen: boolean) => void;
  showAsCard?: boolean;
  compact?: boolean;
}

const RestaurantAvailabilityToggle: React.FC<
  RestaurantAvailabilityToggleProps
> = ({
  currentStatus = 'offline',
  onStatusChange,
  showAsCard = true,
  compact = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentRestaurant = useCurrentRestaurant();
  const restaurantId = currentRestaurant?.id;
  const [isOpen, setIsOpen] = useState<boolean>(currentStatus === 'online');
  const toggleStatusMutation = useToggleRestaurantStatus(
    isOpen,
    restaurantId || '',
  );

  const animatedValue = useSharedValue(isOpen ? 1 : 0);

  const handleToggle = async () => {
    const newStatus = !isOpen;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Animate the change
      animatedValue.value = withSpring(newStatus ? 1 : 0, { damping: 15 });

      setIsOpen(newStatus);

      // Update status via API
      if (restaurantId) {
        await toggleStatusMutation.mutateAsync();
      }

      // Call callback if provided
      onStatusChange?.(newStatus);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      setIsOpen(!newStatus);
      animatedValue.value = withSpring(!newStatus ? 1 : 0, { damping: 15 });
    }
  };

  const confirmToggle = () => {
    if (isOpen) {
      // Going offline - show confirmation
      Alert.alert(
        t('close_restaurant'),
        t('confirm_close_restaurant_message'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('close'),
            style: 'destructive',
            onPress: handleToggle,
          },
        ],
      );
    } else {
      // Going online - no confirmation needed
      handleToggle();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      ['#FF3B3015', '#00D08415'],
    );

    const borderColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      ['#FF3B30', '#00D084'],
    );

    return {
      backgroundColor,
      borderColor,
      borderWidth: 2,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      animatedValue.value,
      [0, 1],
      ['#FF3B30', '#00D084'],
    );

    return {
      color,
    };
  });

  const statusColor = isOpen ? '#00D084' : '#FF3B30';
  const statusIcon = isOpen ? 'store-check' : 'store-off';
  const statusText = isOpen ? t('open') : t('closed');
  const statusDescription = isOpen
    ? t('accepting_orders_normally')
    : t('not_accepting_orders');

  const content = (
    <Animated.View
      style={[
        {
          borderRadius: 16,
          padding: compact ? 16 : 20,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, marginRight: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <MaterialCommunityIcons
              name={statusIcon as any}
              size={compact ? 24 : 28}
              color={statusColor}
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: compact ? 18 : 20,
                fontWeight: 'bold',
                color: colors.onSurface,
              }}
            >
              {t('restaurant_availability')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: statusColor,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: compact ? 16 : 18,
                fontWeight: '600',
                color: statusColor,
              }}
            >
              {statusText}
            </Text>
          </View>

          {!compact && (
            <Text
              style={{
                fontSize: 14,
                color: colors.onSurfaceVariant,
                lineHeight: 18,
              }}
            >
              {statusDescription}
            </Text>
          )}
        </View>

        <View style={{ alignItems: 'center' }}>
          <Switch
            value={isOpen}
            onValueChange={confirmToggle}
            disabled={toggleStatusMutation.isPending}
            thumbColor={isOpen ? '#00D084' : '#FF3B30'}
            trackColor={{
              false: '#FF3B3030',
              true: '#00D08430',
            }}
            style={{
              transform: [{ scale: compact ? 1.1 : 1.2 }],
            }}
          />

          {toggleStatusMutation.isPending && (
            <MaterialCommunityIcons
              name="loading"
              size={16}
              color={colors.onSurfaceVariant}
              style={{ marginTop: 4 }}
            />
          )}
        </View>
      </View>

      {/* Quick Action Buttons */}
      {!compact && (
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
          <TouchableOpacity
            onPress={() => !isOpen && handleToggle()}
            disabled={isOpen || toggleStatusMutation.isPending}
            style={{
              flex: 1,
              backgroundColor: isOpen ? colors.surfaceVariant : '#00D08420',
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
              opacity: isOpen ? 0.5 : 1,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: isOpen ? colors.onSurfaceVariant : '#00D084',
              }}
            >
              {t('open_restaurant')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => isOpen && confirmToggle()}
            disabled={!isOpen || toggleStatusMutation.isPending}
            style={{
              flex: 1,
              backgroundColor: !isOpen ? colors.surfaceVariant : '#FF3B3020',
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
              opacity: !isOpen ? 0.5 : 1,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: !isOpen ? colors.onSurfaceVariant : '#FF3B30',
              }}
            >
              {t('close_restaurant')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  if (showAsCard) {
    return (
      <Card style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
        {content}
      </Card>
    );
  }

  return content;
};

export default RestaurantAvailabilityToggle;
