import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

import { images } from '@/assets/images';
import { useTranslation } from 'react-i18next';

interface NotFoundSearchProps {
  searchQuery?: string;
  onRetry?: () => void;
  onClearSearch?: () => void;
  onGoBack?: () => void;
  type?: 'no_results' | 'no_data' | 'error';
  showRetryButton?: boolean;
  showClearButton?: boolean;
  showBackButton?: boolean;
}

const NotFoundSearch: React.FC<NotFoundSearchProps> = ({
  searchQuery,
  onRetry,
  onClearSearch,
  onGoBack,
  type = 'no_results',
  showRetryButton = false,
  showClearButton = true,
  showBackButton = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const getContent = () => {
    switch (type) {
      case 'no_results':
        return {
          icon: 'food-off',
          title: t('no_food_found'),
          description: searchQuery
            ? t('no_food_matching_query', { searchQuery })
            : t('no_food_matching_filters'),
        };
      case 'no_data':
        return {
          icon: 'database-off',
          title: t('no_food_available'),
          description: t('no_food_available_description'),
        };
      case 'error':
        return {
          icon: 'alert-circle',
          title: t('something_went_wrong'),
          description: t('error_loading_food'),
        };
      default:
        return {
          icon: 'magnify',
          title: t('start_searching'),
          description: t('start_searching_description'),
        };
    }
  };

  const content = getContent();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.background,
      }}
    >
      {/* Icon or Image */}
      {type === 'no_results' && images.not_found ? (
        <Image
          source={images.not_found}
          style={{
            width: 200,
            height: 200,
            marginBottom: 24,
          }}
          resizeMode="contain"
        />
      ) : (
        <View
          style={{
            backgroundColor: colors.surfaceVariant,
            borderRadius: 50,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <MaterialCommunityIcon             name={content.icon as any}
            size={60}
            color={colors.onSurfaceVariant}
          />
        </View>
      )}

      {/* Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: colors.onSurface,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        {content.title}
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 16,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 32,
          maxWidth: 300,
        }}
      >
        {content.description}
      </Text>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {showRetryButton && onRetry && (
          <Button
            mode="contained"
            onPress={onRetry}
            icon="refresh"
            style={{
              borderRadius: 25,
              paddingHorizontal: 8,
            }}
          >
            {t('try_again')}
          </Button>
        )}

        {showClearButton && onClearSearch && searchQuery && (
          <Button
            mode="outlined"
            onPress={onClearSearch}
            icon="close"
            style={{
              borderRadius: 25,
              paddingHorizontal: 8,
            }}
          >
            {t('clear_search')}
          </Button>
        )}

        {showBackButton && onGoBack && (
          <Button
            mode="text"
            onPress={onGoBack}
            icon="arrow-left"
            style={{
              borderRadius: 25,
              paddingHorizontal: 8,
            }}
          >
            {t('go_back')}
          </Button>
        )}
      </View>

      {/* Additional suggestions for no results */}
      {type === 'no_results' && (
        <View
          style={{
            marginTop: 32,
            padding: 16,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 12,
            width: '100%',
            maxWidth: 300,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.onSurface,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {t('try_these_suggestions')}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.onSurfaceVariant,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            {t('suggestion_check_spelling')}
            {'\n'}
            {t('suggestion_general_terms')}
            {'\n'}
            {t('suggestion_clear_filters')}
            {'\n'}
            {t('suggestion_browse_categories')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NotFoundSearch;
