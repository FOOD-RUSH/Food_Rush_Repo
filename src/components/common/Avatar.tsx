import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

interface AvatarProps {
  profilePicture?: string | null;
  fullName: string;
  size?: number;
  textSize?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  profilePicture,
  fullName,
  size = 40,
  textSize,
  className = '',
}) => {
  const { colors } = useTheme();
  
  // Get first letter of the name
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Generate a consistent color based on the name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8', // Mint
      '#F7DC6F', // Light Yellow
      '#BB8FCE', // Light Purple
      '#85C1E9', // Light Blue
      '#F8C471', // Orange
      '#82E0AA', // Light Green
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const fontSize = textSize || size * 0.4;

  if (profilePicture) {
    return (
      <Image
        source={{ uri: profilePicture }}
        style={[avatarSize, { backgroundColor: colors.surfaceVariant }]}
        className={className}
      />
    );
  }

  return (
    <View
      style={[
        avatarSize,
        {
          backgroundColor: getAvatarColor(fullName),
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      className={className}
    >
      <Text
        style={{
          fontSize,
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {getInitial(fullName)}
      </Text>
    </View>
  );
};

export default Avatar;