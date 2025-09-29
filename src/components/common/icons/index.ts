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
} from '../OptimizedIcon';

// Original exports for backward compatibility (without duplicates)
export {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';