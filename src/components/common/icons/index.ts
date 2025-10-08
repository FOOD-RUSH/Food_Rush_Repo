// Direct icon exports from @expo/vector-icons
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

// Type definitions for icon names
export type IoniconsName = keyof typeof Ionicons.glyphMap;
export type MaterialIconsName = keyof typeof MaterialIcons.glyphMap;
export type MaterialCommunityIconsName = keyof typeof MaterialCommunityIcons.glyphMap;
export type AntDesignName = keyof typeof AntDesign.glyphMap;
export type FontAwesome5Name = keyof typeof FontAwesome5.glyphMap;
export type FeatherName = keyof typeof Feather.glyphMap;

// Convenience components for typed icon usage
export const IoniconsIcon = Ionicons;
export const MaterialIcon = MaterialIcons;
export const MaterialCommunityIcon = MaterialCommunityIcons;
export const AntDesignIcon = AntDesign;
export const FontAwesome5Icon = FontAwesome5;
export const FeatherIcon = Feather;

// Export the icon components
export {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
};

// Default export for backward compatibility
export default Ionicons;
