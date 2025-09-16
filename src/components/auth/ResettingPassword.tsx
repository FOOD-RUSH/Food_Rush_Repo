import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { images } from '@/assets/images';
import { AuthStackScreenProps } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

interface ResettingPasswordProps {
  isPending: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  onLoginPress?: () => void;
}

const ResettingPassword: React.FC<ResettingPasswordProps> = ({
  isPending,
  isSuccess = false,
  isError = false,
  onLoginPress,
}) => {
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Animation values
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Success images array
  const successImages = [images.success_1, images.success_2, images.success_3];

  // Animate through success images when success is true
  useEffect(() => {
    if (isSuccess) {
      let imageIndex = 0;
      const animateImages = () => {
        if (imageIndex < successImages.length) {
          // Fade out current image
          opacity.value = withTiming(0, { duration: 300 }, () => {
            // Change image and fade in
            runOnJS(setCurrentImageIndex)(imageIndex);
            opacity.value = withTiming(1, { duration: 300 });
            scale.value = withSequence(
              withTiming(1.1, { duration: 200 }),
              withTiming(1, { duration: 200 }),
            );
          });
          imageIndex++;

          // Schedule next image change
          if (imageIndex < successImages.length) {
            setTimeout(animateImages, 800);
          }
        }
      };

      // Start animation after a short delay
      setTimeout(animateImages, 500);
    }
  }, [isSuccess, opacity, scale, successImages.length]);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const getImageSource = () => {
    if (isSuccess) {
      return successImages[currentImageIndex];
    }
    if (isError) {
      return images.not_found;
    }
    return images.Loading_reset;
  };

  const getTitle = () => {
    if (isSuccess) {
      return t('password_reset_successful');
    }
    if (isError) {
      return t('password_reset_failed');
    }
    return t('resetting_password');
  };

  const getButtonText = () => {
    if (isSuccess) {
      return t('login');
    }
    if (isError) {
      return t('try_again');
    }
    return t('please_wait');
  };

  return (
    <View className="items-center p-6">
      <Animated.View style={animatedImageStyle}>
        <Image source={getImageSource()} className="w-40 h-40 mb-6" />
      </Animated.View>

      <Text
        className="text-2xl font-bold text-center mb-4"
        style={{ color: colors.onBackground }}
      >
        {getTitle()}
      </Text>

      {isSuccess && (
        <Text
          className="text-base text-center mb-6 px-4"
          style={{ color: colors.onSurfaceVariant }}
        >
          {t('password_change_successful_message')}
        </Text>
      )}

      <Button
        mode="contained"
        loading={isPending}
        disabled={isPending}
        onPress={isSuccess ? onLoginPress : undefined}
        buttonColor={isSuccess ? colors.primary : undefined}
      >
        <Text className="text-xl" style={{ color: colors.onPrimary }}>
          {getButtonText()}
        </Text>
      </Button>
    </View>
  );
};

export default ResettingPassword;

export const RestPasswordSuccess: React.FC = () => {
  const { colors } = useTheme();
  const navigation =
    useNavigation<AuthStackScreenProps<'ResetPassword'>['navigation']>();

  const handleNavigationToLogin = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SignIn',
          params: { userType: 'customer' },
        },
      ],
    });
  }, [navigation]);

  return (
    <View className="items-center p-6 ">
      <Image source={images.customerImg} className="w-40 h-40 mb-6" />
      <Text
        className="text-2xl font-bold text-center mb-4"
        style={{ color: colors.onBackground }}
      >
        You have successfully reset your password
      </Text>
      <Button mode="contained" onPress={handleNavigationToLogin}>
        <Text className="text-xl" style={{ color: colors.onBackground }}>
          Navigate to Login
        </Text>
      </Button>
    </View>
  );
};
