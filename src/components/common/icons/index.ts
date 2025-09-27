// Centralized icon exports for optimized imports
export {
  OptimizedIcon as Icon,
  IoniconsIcon,
  MaterialIcon,
  MaterialCommunityIcon,
  AntDesignIcon,
  FontAwesome5Icon,
  FeatherIcon,
  // Type exports
  type IconSet,
  type IoniconsName,
  type MaterialIconsName,
  type MaterialCommunityIconsName,
  type AntDesignName,
  type FontAwesome5Name,
  type FeatherName,
  // Original exports for backward compatibility
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
} from '../OptimizedIcon';

// Re-export the original @expo/vector-icons for cases where direct access is needed
export * from '@expo/vector-icons';