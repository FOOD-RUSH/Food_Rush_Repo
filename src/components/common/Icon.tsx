import React from 'react';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  AntDesign, 
  FontAwesome5 
} from '@expo/vector-icons';

// Define the icon sets we actually use
const ICON_SETS = {
  ionicons: Ionicons,
  material: MaterialIcons,
  materialCommunity: MaterialCommunityIcons,
  antDesign: AntDesign,
  fontAwesome5: FontAwesome5,
} as const;

export type IconSet = keyof typeof ICON_SETS;

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  set?: IconSet;
  style?: any;
}

/**
 * Optimized Icon component that only loads the icon sets we actually use
 * This helps with tree shaking and reduces bundle size
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  set = 'ionicons',
  style,
}) => {
  const IconComponent = ICON_SETS[set];
  
  if (!IconComponent) {
    console.warn(`Icon set "${set}" not found. Available sets: ${Object.keys(ICON_SETS).join(', ')}`);
    return null;
  }

  return (
    <IconComponent 
      name={name as any} 
      size={size} 
      color={color} 
      style={style}
    />
  );
};

// Convenience components for commonly used icon sets
export const IoniconsIcon: React.FC<Omit<IconProps, 'set'>> = (props) => (
  <Icon {...props} set="ionicons" />
);

export const MaterialIcon: React.FC<Omit<IconProps, 'set'>> = (props) => (
  <Icon {...props} set="material" />
);

export const MaterialCommunityIcon: React.FC<Omit<IconProps, 'set'>> = (props) => (
  <Icon {...props} set="materialCommunity" />
);

export const AntDesignIcon: React.FC<Omit<IconProps, 'set'>> = (props) => (
  <Icon {...props} set="antDesign" />
);

export const FontAwesome5Icon: React.FC<Omit<IconProps, 'set'>> = (props) => (
  <Icon {...props} set="fontAwesome5" />
);

// Export the icon sets for backward compatibility
export { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  AntDesign, 
  FontAwesome5 
};

export default Icon;