import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const SearchResultSkeleton: React.FC = () => {
  const { colors } = useTheme();

  const SkeletonBox = ({
    width,
    height,
    style,
  }: {
    width: number | string;
    height: number;
    style?: any;
  }) => (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: colors.surfaceVariant,
          borderRadius: 8,
        },
        style,
      ]}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Image skeleton */}
      <SkeletonBox width={80} height={80} style={styles.image} />

      <View style={styles.content}>
        {/* Title skeleton */}
        <SkeletonBox width="70%" height={16} style={styles.title} />

        {/* Restaurant name skeleton */}
        <SkeletonBox width="50%" height={12} style={styles.restaurant} />

        {/* Rating and distance skeleton */}
        <View style={styles.metadata}>
          <SkeletonBox width={60} height={12} />
          <SkeletonBox width={40} height={12} />
        </View>

        {/* Price skeleton */}
        <SkeletonBox width="30%" height={14} style={styles.price} />
      </View>
    </View>
  );
};

const SearchResultsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <SearchResultSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 4,
  },
  restaurant: {
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export { SearchResultSkeleton, SearchResultsSkeleton };
export default SearchResultsSkeleton;
