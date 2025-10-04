import { MaterialIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { images } from '@/assets/images';

export interface ProfessionalErrorDisplayProps {
  type?:
    | 'no_menu'
    | 'no_items'
    | 'network_error'
    | 'not_found'
    | 'general_error';
  title?: string;
  message?: string;
  onRefresh?: () => void;
  onRetry?: () => void;
  refreshButtonText?: string;
  showRefreshButton?: boolean;
  imageSource?: any;
  containerStyle?: any;
}

const ProfessionalErrorDisplay: React.FC<ProfessionalErrorDisplayProps> = ({
  type = 'general_error',
  title,
  message,
  onRefresh,
  onRetry,
  refreshButtonText,
  showRefreshButton = true,
  imageSource,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Default configurations for different error types
  const getErrorConfig = () => {
    switch (type) {
      case 'no_menu':
        return {
          image: imageSource || images.noMenu,
          title: title || t('no_menu_available'),
          message: message || t('no_menu_items_found_for_this_restaurant'),
          buttonText: refreshButtonText || t('refresh_menu'),
          icon: 'restaurant-menu',
        };
      case 'no_items':
        return {
          image: imageSource || images.noMenu,
          title: title || t('no_items_found'),
          message: message || t('no_items_match_your_current_selection'),
          buttonText: refreshButtonText || t('try_again'),
          icon: 'search-off',
        };
      case 'network_error':
        return {
          image: imageSource || images.not_found,
          title: title || t('connection_error'),
          message: message || t('please_check_your_internet_connection'),
          buttonText: refreshButtonText || t('retry'),
          icon: 'wifi-off',
        };
      case 'not_found':
        return {
          image: imageSource || images.not_found,
          title: title || t('not_found'),
          message:
            message || t('the_content_you_are_looking_for_was_not_found'),
          buttonText: refreshButtonText || t('go_back'),
          icon: 'search-off',
        };
      default:
        return {
          image: imageSource || images.not_found,
          title: title || t('something_went_wrong'),
          message: message || t('an_unexpected_error_occurred'),
          buttonText: refreshButtonText || t('try_again'),
          icon: 'error-outline',
        };
    }
  };

  const config = getErrorConfig();
  const handleAction = onRefresh || onRetry;

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          backgroundColor: colors.background,
        },
        containerStyle,
      ]}
    >
      {/* Error Image */}
      <Image
        source={config.image}
        style={{
          width: 200,
          height: 200,
          resizeMode: 'contain',
          marginBottom: 24,
        }}
      />

      {/* Error Icon (optional overlay) */}
      <View
        style={{
          backgroundColor: colors.errorContainer,
          borderRadius: 30,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <MaterialIcon
          name={config.icon as any}
          size={24}
          color={colors.onErrorContainer}
        />
      </View>

      {/* Error Title */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: colors.onSurface,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {config.title}
      </Text>

      {/* Error Message */}
      <Text
        style={{
          fontSize: 16,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 32,
          paddingHorizontal: 16,
        }}
      >
        {config.message}
      </Text>

      {/* Action Buttons */}
      {showRefreshButton && handleAction && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
            onPress={handleAction}
            activeOpacity={0.8}
          >
            <MaterialIcon name="refresh" size={20} color={colors.onPrimary} />
            <Text
              style={{
                color: colors.onPrimary,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {config.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfessionalErrorDisplay;
