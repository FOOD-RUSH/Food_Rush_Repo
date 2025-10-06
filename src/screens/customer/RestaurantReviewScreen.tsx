import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RootStackScreenProps } from '@/src/navigation/types';
import { useCreateRestaurantReview } from '@/src/hooks/customer/useCustomerApi';
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';
import Toast from 'react-native-toast-message';

type RestaurantReviewScreenProps = RootStackScreenProps<'RestaurantReview'>;

const RestaurantReviewScreen: React.FC<RestaurantReviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Get restaurant data from route params with safe defaults
  const params = route.params || {};
  const restaurantId = params.restaurantId;
  const restaurantName = params.restaurantName || 'Restaurant';

  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');

  // Use the create review mutation
  const createReviewMutation = useCreateRestaurantReview();

  const handleStarPress = (starRating: number) => {
    setScore(starRating);
  };

  const handleSubmit = async () => {
    if (score === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!restaurantId) {
      Alert.alert('Error', 'Restaurant ID is missing');
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
        text1: 'Success',
        text2: 'Review submitted successfully',
      });

      navigation.goBack();
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            style={styles.starButton}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.starText,
                { color: star <= score ? '#FFD700' : colors.onSurfaceVariant },
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.backButtonText, { color: colors.onSurface }]}>
              ←
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Restaurant Image */}
          <View style={styles.imageContainer}>
            <View
              style={[
                styles.imageWrapper,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <Image
                source={require('@/assets/images/R-Logo.png')}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Main Question */}
          <View style={styles.questionContainer}>
            <Text
              style={[
                styles.mainQuestion,
                { color: colors.onSurface },
              ]}
            >
              How was your delivery order?
            </Text>

            <Text
              style={[
                styles.subQuestion,
                { color: colors.onSurfaceVariant },
              ]}
            >
              Enjoyed the food? Rate the restaurant.
            </Text>

            <Text
              style={[
                styles.feedbackText,
                { color: colors.onSurfaceVariant },
              ]}
            >
              Your feedback matters.
            </Text>
          </View>

          {/* Star Rating */}
          {renderStars()}

          {/* Rating Display */}
          {score > 0 && (
            <View style={styles.ratingDisplay}>
              <Text
                style={[
                  styles.ratingText,
                  { color: colors.primary },
                ]}
              >
                {score} {score === 1 ? 'star' : 'stars'}
              </Text>
            </View>
          )}

          {/* Review Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Add an optional description..."
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  borderColor: colors.outline,
                },
              ]}
              placeholderTextColor={colors.onSurfaceVariant}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleCancel}
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.outline },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.onSurface }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={score === 0 || createReviewMutation.isPending}
              style={[
                styles.button,
                styles.submitButton,
                {
                  backgroundColor:
                    score === 0 ? colors.surfaceVariant : colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: score === 0 ? colors.onSurfaceVariant : colors.onPrimary,
                  },
                ]}
              >
                {createReviewMutation.isPending ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subQuestion: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  starButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  starText: {
    fontSize: 40,
  },
  ratingDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 32,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    // backgroundColor will be set dynamically
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RestaurantReviewScreen;