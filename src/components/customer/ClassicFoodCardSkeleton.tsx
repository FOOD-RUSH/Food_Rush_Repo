import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import SkeletonLoader from '@/src/components/common/SkeletonLoader';

const ClassicFoodCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: 190,
        borderRadius: 16,
        backgroundColor: colors.surface,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: colors.surface,
      }}
    >
      <View style={{ padding: 12 }}>
        {/* Image with heart icon overlay skeleton */}
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <SkeletonLoader
            width={150}
            height={150}
            borderRadius={75}
            style={{ alignSelf: 'center' }}
          />

          {/* Heart icon skeleton */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 6,
            }}
          >
            <SkeletonLoader width={20} height={20} borderRadius={10} />
          </View>

          {/* Status badge skeleton */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: colors.primary,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <SkeletonLoader width={40} height={14} borderRadius={3} />
          </View>
        </View>

        {/* Food info skeleton */}
        <View style={{ marginBottom: 8, alignSelf: 'center' }}>
          <SkeletonLoader
            width={120}
            height={20}
            borderRadius={6}
            style={{ marginBottom: 4, alignSelf: 'center' }}
          />
          <SkeletonLoader
            width={100}
            height={16}
            borderRadius={6}
            style={{ alignSelf: 'center' }}
          />
        </View>

        {/* Rating and distance skeleton */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SkeletonLoader width={16} height={16} borderRadius={8} />
            <SkeletonLoader width={20} height={14} borderRadius={7} style={{ marginLeft: 4 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SkeletonLoader width={16} height={16} borderRadius={8} />
            <SkeletonLoader width={30} height={14} borderRadius={7} style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Price and delivery info skeleton */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SkeletonLoader width={60} height={18} borderRadius={9} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SkeletonLoader width={18} height={18} borderRadius={9} />
            <SkeletonLoader width={50} height={14} borderRadius={7} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ClassicFoodCardSkeleton;
