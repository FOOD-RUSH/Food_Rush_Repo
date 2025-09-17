import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import SkeletonLoader from '@/src/components/common/SkeletonLoader';

const FoodItemCardSkeleton: React.FC = () => {
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
        minHeight: 120,
        maxHeight: 180,
      }}
    >
      {/* Card content with horizontal layout */}
      <View
        style={{
          flexDirection: 'row',
          padding: 16,
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left side - Food Image skeleton */}
        <View style={{ position: 'relative', marginRight: 16 }}>
          <SkeletonLoader width={100} height={100} borderRadius={16} />
        </View>

        {/* Heart icon skeleton */}
        <View
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 8,
          }}
        >
          <SkeletonLoader width={18} height={18} borderRadius={9} />
        </View>

        {/* Right side - Food Details skeleton */}
        <View style={{ flex: 1 }}>
          {/* Food Name skeleton */}
          <SkeletonLoader
            width="80%"
            height={20}
            borderRadius={6}
            style={{ marginBottom: 10, padding: 4 }}
          />

          {/* Distance and Rating skeleton */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <SkeletonLoader width={30} height={12} borderRadius={6} />
            <SkeletonLoader
              width={4}
              height={12}
              borderRadius={2}
              style={{ marginHorizontal: 4 }}
            />
            <SkeletonLoader width={12} height={12} borderRadius={6} />
            <SkeletonLoader
              width={50}
              height={12}
              borderRadius={6}
              style={{ marginLeft: 2 }}
            />
          </View>

          {/* Price and Delivery skeleton */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SkeletonLoader width={60} height={16} borderRadius={8} />
              <SkeletonLoader
                width={4}
                height={12}
                borderRadius={2}
                style={{ marginLeft: 5 }}
              />
              <SkeletonLoader
                width={12}
                height={12}
                borderRadius={6}
                style={{ marginLeft: 5 }}
              />
              <SkeletonLoader
                width={40}
                height={12}
                borderRadius={6}
                style={{ marginLeft: 5 }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodItemCardSkeleton;
