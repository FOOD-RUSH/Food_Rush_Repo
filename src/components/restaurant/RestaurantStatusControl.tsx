import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor 
} from 'react-native-reanimated';

import { useUpdateRestaurantStatus } from '@/src/hooks/restaurant/useRestaurantApi';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

type RestaurantStatus = 'online' | 'offline' | 'busy';

interface StatusOption {
  status: RestaurantStatus;
  label: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

interface RestaurantStatusControlProps {
  currentStatus?: RestaurantStatus;
  onStatusChange?: (status: RestaurantStatus) => void;
  showAsCard?: boolean;
  compact?: boolean;
}

const RestaurantStatusControl: React.FC<RestaurantStatusControlProps> = ({
  currentStatus = 'offline',
  onStatusChange,
  showAsCard = true,
  compact = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<RestaurantStatus>(currentStatus);
  const updateStatusMutation = useUpdateRestaurantStatus();

  const statusOptions: StatusOption[] = [
    {
      status: 'online',
      label: t('online'),
      description: t('accepting_orders_normally'),
      icon: 'check-circle',
      color: '#00D084',
      backgroundColor: '#00D08415',
    },
    {
      status: 'busy',
      label: t('busy'),
      description: t('accepting_orders_longer_wait'),
      icon: 'clock-alert',
      color: '#FF9500',
      backgroundColor: '#FF950015',
    },
    {
      status: 'offline',
      label: t('offline'),
      description: t('not_accepting_orders'),
      icon: 'pause-circle',
      color: '#FF3B30',
      backgroundColor: '#FF3B3015',
    },
  ];

  const animatedValue = useSharedValue(0);

  const handleStatusSelect = async (status: RestaurantStatus) => {
    if (status === selectedStatus) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Animate selection
      animatedValue.value = withSpring(1, { damping: 15 });
      setTimeout(() => {
        animatedValue.value = withSpring(0, { damping: 15 });
      }, 200);

      setSelectedStatus(status);
      
      // Update status via API
      await updateStatusMutation.mutateAsync({ status });
      
      // Call callback if provided
      onStatusChange?.(status);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert selection on error
      setSelectedStatus(currentStatus);
    }
  };

  const confirmStatusChange = (status: RestaurantStatus) => {
    if (status === 'offline') {
      Alert.alert(
        t('go_offline'),
        t('confirm_go_offline_message'),
        [
          { text: t('cancel'), style: 'cancel' },
          { 
            text: t('go_offline'), 
            style: 'destructive',
            onPress: () => handleStatusSelect(status)
          },
        ]
      );
    } else {
      handleStatusSelect(status);
    }
  };

  const renderStatusOption = (option: StatusOption) => {
    const isSelected = selectedStatus === option.status;
    const isLoading = updateStatusMutation.isPending && selectedStatus === option.status;

    const animatedStyle = useAnimatedStyle(() => {
      const scale = isSelected ? withSpring(1.02) : withSpring(1);
      const opacity = isLoading ? withTiming(0.7) : withTiming(1);
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View key={option.status} style={animatedStyle}>
        <TouchableOpacity
          onPress={() => confirmStatusChange(option.status)}
          disabled={isLoading || updateStatusMutation.isPending}
          activeOpacity={0.8}
          style={{
            borderRadius: 16,
            padding: compact ? 12 : 16,
            marginBottom: compact ? 8 : 12,
            borderWidth: 2,
            borderColor: isSelected ? option.color : colors.outline,
            backgroundColor: isSelected ? option.backgroundColor : colors.surface,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: compact ? 40 : 48,
                height: compact ? 40 : 48,
                borderRadius: compact ? 20 : 24,
                backgroundColor: option.backgroundColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              {isLoading ? (
                <MaterialCommunityIcons 
                  name="loading" 
                  size={compact ? 20 : 24} 
                  color={option.color} 
                />
              ) : (
                <MaterialCommunityIcons 
                  name={option.icon as any} 
                  size={compact ? 20 : 24} 
                  color={option.color} 
                />
              )}
            </View>
            
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: compact ? 16 : 18,
                  fontWeight: isSelected ? '700' : '600',
                  color: isSelected ? option.color : colors.onSurface,
                  marginBottom: compact ? 2 : 4,
                }}
              >
                {option.label}
              </Text>
              {!compact && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.onSurfaceVariant,
                    lineHeight: 18,
                  }}
                >
                  {option.description}
                </Text>
              )}
            </View>

            {isSelected && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={option.color}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const currentOption = statusOptions.find(option => option.status === selectedStatus);

  if (compact) {
    return (
      <View>
        {statusOptions.map(renderStatusOption)}
      </View>
    );
  }

  const content = (
    <View style={{ padding: isSmallScreen ? 16 : 20 }}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: isSmallScreen ? 20 : 22,
            fontWeight: 'bold',
            color: colors.onSurface,
            marginBottom: 8,
          }}
        >
          {t('restaurant_status')}
        </Text>
        
        {/* Current Status Indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: currentOption?.color || '#6B7280',
              marginRight: 8,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: currentOption?.color || colors.onSurfaceVariant,
            }}
          >
            {currentOption?.label || t('unknown')}
          </Text>
        </View>
        
        <Text
          style={{
            fontSize: 14,
            color: colors.onSurfaceVariant,
            marginTop: 4,
          }}
        >
          {t('tap_to_change_status')}
        </Text>
      </View>

      {/* Status Options */}
      <View>
        {statusOptions.map(renderStatusOption)}
      </View>

      {/* Quick Actions */}
      <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
        <Button
          mode="outlined"
          onPress={() => confirmStatusChange('online')}
          disabled={selectedStatus === 'online' || updateStatusMutation.isPending}
          style={{ flex: 1 }}
          contentStyle={{ paddingVertical: 4 }}
        >
          {t('go_online')}
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => confirmStatusChange('offline')}
          disabled={selectedStatus === 'offline' || updateStatusMutation.isPending}
          style={{ flex: 1 }}
          contentStyle={{ paddingVertical: 4 }}
          buttonColor={selectedStatus === 'offline' ? '#FF3B3015' : undefined}
        >
          {t('go_offline')}
        </Button>
      </View>
    </View>
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

export default RestaurantStatusControl;