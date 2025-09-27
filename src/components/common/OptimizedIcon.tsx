import React from 'react';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

// Define the icon sets we actually use
const ICON_SETS = {
  ionicons: Ionicons,
  material: MaterialIcons,
  materialCommunity: MaterialCommunityIcons,
  antDesign: AntDesign,
  fontAwesome5: FontAwesome5,
  feather: Feather,
} as const;

export type IconSet = keyof typeof ICON_SETS;

// Common icon names for better type safety
export type IoniconsName = keyof typeof Ionicons.glyphMap;
export type MaterialIconsName = keyof typeof MaterialIcons.glyphMap;
export type MaterialCommunityIconsName = keyof typeof MaterialCommunityIcons.glyphMap;
export type AntDesignName = keyof typeof AntDesign.glyphMap;
export type FontAwesome5Name = keyof typeof FontAwesome5.glyphMap;
export type FeatherName = keyof typeof Feather.glyphMap;

interface BaseIconProps {
  size?: number;
  color?: string;
  style?: any;
}

interface IconProps extends BaseIconProps {
  name: string;
  set?: IconSet;
}

/**
 * Optimized Icon component that only loads the icon sets we actually use
 * This helps with tree shaking and reduces bundle size
 */
export const OptimizedIcon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  set = 'ionicons',
  style,
}) => {
  const IconComponent = ICON_SETS[set];

  if (!IconComponent) {
    console.warn(
      `Icon set "${set}" not found. Available sets: ${Object.keys(ICON_SETS).join(', ')}`,
    );
    return null;
  }

  return (
    <IconComponent name={name as any} size={size} color={color} style={style} />
  );
};

// Typed convenience components for commonly used icon sets
export const IoniconsIcon: React.FC<BaseIconProps & { name: IoniconsName }> = (props) => (
  <OptimizedIcon {...props} set="ionicons" />
);

export const MaterialIcon: React.FC<BaseIconProps & { name: MaterialIconsName }> = (props) => (
  <OptimizedIcon {...props} set="material" />
);

export const MaterialCommunityIcon: React.FC<BaseIconProps & { name: MaterialCommunityIconsName }> = (
  props,
) => <OptimizedIcon {...props} set="materialCommunity" />;

export const AntDesignIcon: React.FC<BaseIconProps & { name: AntDesignName }> = (props) => (
  <OptimizedIcon {...props} set="antDesign" />
);

export const FontAwesome5Icon: React.FC<BaseIconProps & { name: FontAwesome5Name }> = (props) => (
  <OptimizedIcon {...props} set="fontAwesome5" />
);

export const FeatherIcon: React.FC<BaseIconProps & { name: FeatherName }> = (props) => (
  <OptimizedIcon {...props} set="feather" />
);

// Export the icon sets for backward compatibility
export {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
};

export default OptimizedIcon;