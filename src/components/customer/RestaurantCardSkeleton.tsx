import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import SkeletonLoader from '@/src/components/common/SkeletonLoader';

const RestaurantCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        margin: 10,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: colors.surface,
        minWidth: 320,
        maxWidth: 520,
        minHeight: 220,
        maxHeight: 340,
      }}
    >
      {/* Image skeleton */}
      <SkeletonLoader width="100%" height={150} borderRadius={0} />

      {/* Heart icon skeleton */}
      <View
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 8,
        }}
      >
        <SkeletonLoader width={20} height={20} borderRadius={10} />
      </View>

      {/* Bottom badges skeleton */}
      <View
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <SkeletonLoader width={40} height={16} borderRadius={8} />
        </View>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <SkeletonLoader width={12} height={12} borderRadius={6} />
          <SkeletonLoader
            width={20}
            height={12}
            borderRadius={6}
            style={{ marginLeft: 4 }}
          />
        </View>
      </View>

      {/* Content skeleton */}
      <View style={{ padding: 16 }}>
        {/* Restaurant name skeleton */}
        <View style={{ marginBottom: 12 }}>
          <SkeletonLoader width="70%" height={24} borderRadius={6} />
        </View>

        {/* Location and delivery info skeleton */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <SkeletonLoader width={14} height={14} borderRadius={7} />
              <SkeletonLoader
                width={40}
                height={14}
                borderRadius={7}
                style={{ marginLeft: 4 }}
              />
            </View>
            <SkeletonLoader width={60} height={12} borderRadius={6} />
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <SkeletonLoader width={50} height={14} borderRadius={7} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default RestaurantCardSkeleton;
