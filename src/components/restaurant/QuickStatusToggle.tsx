import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor 
} from 'react-native-reanimated';

import { useUpdateRestaurantStatus } from '@/src/hooks/restaurant/useRestaurantApi';

type RestaurantStatus = 'online' | 'offline' | 'busy';

interface QuickStatusToggleProps {
  currentStatus: RestaurantStatus;
  onStatusChange?: (status: RestaurantStatus) => void;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const QuickStatusToggle: React.FC<QuickStatusToggleProps> = ({
  currentStatus,
  onStatusChange,
  size = 'medium',
  showLabel = true,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const updateStatusMutation = useUpdateRestaurantStatus();
  
  const animatedValue = useSharedValue(currentStatus === 'online' ? 1 : 0);

  const statusConfig = {
    online: {
      color: '#00D084',
      backgroundColor: '#00D08415',
      icon: 'check-circle',
      label: t('online'),
      nextStatus: 'offline' as RestaurantStatus,
    },
    busy: {
      color: '#FF9500',
      backgroundColor: '#FF950015',
      icon: 'clock-alert',
      label: t('busy'),
      nextStatus: 'online' as RestaurantStatus,
    },
    offline: {
      color: '#FF3B30',
      backgroundColor: '#FF3B3015',
      icon: 'pause-circle',
      label: t('offline'),
      nextStatus: 'online' as RestaurantStatus,
    },
  };

  const currentConfig = statusConfig[currentStatus];
  
  const sizeConfig = {
    small: { iconSize: 16, padding: 8, fontSize: 12 },
    medium: { iconSize: 20, padding: 12, fontSize: 14 },
    large: { iconSize: 24, padding: 16, fontSize: 16 },
  };

  const { iconSize, padding, fontSize } = sizeConfig[size];

  const handleToggle = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const nextStatus = currentConfig.nextStatus;
      animatedValue.value = withSpring(nextStatus === 'online' ? 1 : 0);
      
      await updateStatusMutation.mutateAsync({ status: nextStatus });
      onStatusChange?.(nextStatus);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      // Revert animation on error
      animatedValue.value = withSpring(currentStatus === 'online' ? 1 : 0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [statusConfig.offline.backgroundColor, statusConfig.online.backgroundColor]
    );
    
    const borderColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [statusConfig.offline.color, statusConfig.online.color]
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: withSpring(updateStatusMutation.isPending ? 0.95 : 1) }],
    };
  });

  return (
    <TouchableOpacity
      onPress={handleToggle}
      disabled={updateStatusMutation.isPending}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: padding,
            paddingVertical: padding * 0.75,
            borderRadius: padding * 1.5,
            borderWidth: 1.5,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            width: iconSize + 8,
            height: iconSize + 8,
            borderRadius: (iconSize + 8) / 2,
            backgroundColor: currentConfig.color + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: showLabel ? 8 : 0,
          }}
        >
          {updateStatusMutation.isPending ? (
            <MaterialCommunityIcons 
              name="loading" 
              size={iconSize} 
              color={currentConfig.color} 
            />
          ) : (
            <MaterialCommunityIcons 
              name={currentConfig.icon as any} 
              size={iconSize} 
              color={currentConfig.color} 
            />
          )}
        </View>
        
        {showLabel && (
          <Text
            style={{
              fontSize,
              fontWeight: '600',
              color: currentConfig.color,
            }}
          >
            {currentConfig.label}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default QuickStatusToggle;