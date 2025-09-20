import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import {
  ResponsiveContainer,
  ResponsiveImage,
  ResponsiveText,
} from '@/src/components/common';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useCreateRestaurantReview } from '@/src/hooks/customer/useCustomerApi';
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';
import Toast from 'react-native-toast-message';

interface RestaurantReviewScreenProps
  extends RootStackScreenProps<'RestaurantReview'> {}

const RestaurantReviewScreen: React.FC<RestaurantReviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isSmallDevice, getResponsiveSpacing } = useResponsive();

  // Get restaurant data from route params
  const { restaurantId, restaurantName, restaurantImage } = route.params || {};

  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');

  // Use the create review mutation
  const createReviewMutation = useCreateRestaurantReview();

  const handleStarPress = (starRating: number) => {
    setScore(starRating);
  };

  const handleSubmit = async () => {
    if (score === 0) {
      Alert.alert(t('error'), t('please_select_rating'));
      return;
    }

    if (!restaurantId) {
      Alert.alert(t('error'), 'Restaurant ID is missing');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        restaurantId,
        reviewData: {
          score,
          review: review.trim(),
        },
      });

      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('review_submitted_successfully'),
      });

      navigation.goBack();
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderStars = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: getResponsiveSpacing(16),
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            style={{
              padding: getResponsiveSpacing(8),
              marginHorizontal: getResponsiveSpacing(4),
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= score ? 'star' : 'star-outline'}
              size={isSmallDevice ? 32 : 40}
              color={star <= score ? '#FFD700' : colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <CommonView>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: getResponsiveSpacing(32),
        }}
      >
        {/* Back Button */}
        <View
          style={{
            paddingHorizontal: getResponsiveSpacing(16),
            paddingTop: getResponsiveSpacing(16),
            paddingBottom: getResponsiveSpacing(8),
          }}
        >
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ResponsiveContainer padding="lg">
          {/* Restaurant Image */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: getResponsiveSpacing(24),
            }}
          >
            <View
              style={{
                width: isSmallDevice ? 120 : 150,
                height: isSmallDevice ? 120 : 150,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <ResponsiveImage
                source={
                  restaurantImage || require('@/assets/images/R-Logo.png')
                }
                size="xl"
                aspectRatio={1}
                style={{
                  borderRadius: 16,
                }}
              />
            </View>
          </View>

          {/* Main Question */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: getResponsiveSpacing(16),
            }}
          >
            <ResponsiveText
              size={isSmallDevice ? 'xl' : '2xl'}
              weight="bold"
              style={{
                textAlign: 'center',
                color: colors.onSurface,
                marginBottom: getResponsiveSpacing(8),
              }}
            >
              {t('how_was_delivery_order')}
            </ResponsiveText>

            <ResponsiveText
              size="base"
              style={{
                textAlign: 'center',
                color: colors.onSurfaceVariant,
                lineHeight: 24,
              }}
            >
              {t('enjoyed_food_rate_restaurant')}
            </ResponsiveText>

            <ResponsiveText
              size="sm"
              style={{
                textAlign: 'center',
                color: colors.onSurfaceVariant,
                marginTop: getResponsiveSpacing(4),
              }}
            >
              {t('your_feedback_matters')}
            </ResponsiveText>
          </View>

          {/* Star Rating */}
          {renderStars()}

          {/* Rating Display */}
          {score > 0 && (
            <View
              style={{
                alignItems: 'center',
                marginBottom: getResponsiveSpacing(24),
              }}
            >
              <ResponsiveText
                size="lg"
                weight="semibold"
                style={{
                  color: colors.primary,
                }}
              >
                {score} {score === 1 ? t('star') : t('stars')}
              </ResponsiveText>
            </View>
          )}

          {/* Review Text Input */}
          <View style={{ marginBottom: getResponsiveSpacing(32) }}>
            <TextInput
              placeholder={t('add_optional_description')}
              value={review}
              onChangeText={setReview}
              mode="outlined"
              multiline
              numberOfLines={4}
              outlineStyle={{
                borderRadius: 12,
                borderColor: colors.surfaceVariant,
              }}
              style={{
                backgroundColor: colors.surfaceVariant,
                minHeight: 100,
              }}
              contentStyle={{
                paddingHorizontal: getResponsiveSpacing(16),
                paddingVertical: 12,
                color: colors.onSurfaceVariant,
              }}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: getResponsiveSpacing(12),
            }}
          >
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={{
                flex: 1,
                borderColor: colors.outline,
                borderRadius: 25,
              }}
              contentStyle={{ paddingVertical: getResponsiveSpacing(12) }}
              labelStyle={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.onSurface,
              }}
            >
              {t('cancel')}
            </Button>

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={score === 0 || createReviewMutation.isPending}
              style={{
                flex: 1,
                borderRadius: 25,
                backgroundColor:
                  score === 0 ? colors.surfaceVariant : colors.primary,
              }}
              contentStyle={{ paddingVertical: getResponsiveSpacing(12) }}
              labelStyle={{
                fontSize: 16,
                fontWeight: '600',
                color:
                  score === 0 ? colors.onSurfaceVariant : colors.onPrimary,
              }}
            >
              {createReviewMutation.isPending ? t('submitting') : t('submit')}
            </Button>
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </CommonView>
  );
};

export default RestaurantReviewScreen;
