# Restaurant Review Creation - Updated Implementation

## Overview

The restaurant review creation functionality has been updated to accept the new parameters format:

```typescript
{
  \"score\": 4,
  \"review\": \"Great build quality and fast delivery!\"
}
```

## API Endpoint

**POST** `/restaurants/{restaurantId}/reviews`

### Request Body
```typescript
{
  score: number;    // Rating from 1-5
  review: string;   // Review text (optional)
}
```

### Response
```typescript
{
  status_code: number;
  message: string;
  data: {
    id: string;
    score: number;
    review: string;
    createdAt: string;
    user: {
      id: string;
      fullName: string;
      profilePicture: string | null;
    };
  };
}
```

## Usage Examples

### 1. Using the Hook Directly

```typescript
import { useCreateRestaurantReview } from '@/src/hooks/customer/useCustomerApi';
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';
import Toast from 'react-native-toast-message';

const MyComponent = () => {
  const createReviewMutation = useCreateRestaurantReview();

  const handleSubmitReview = async (restaurantId: string) => {
    try {
      await createReviewMutation.mutateAsync({
        restaurantId,
        reviewData: {
          score: 4,
          review: \"Great build quality and fast delivery!\"
        }
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Review submitted successfully!'
      });
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
    }
  };

  return (
    <Button 
      onPress={() => handleSubmitReview('restaurant-id')}
      disabled={createReviewMutation.isPending}
    >
      {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
    </Button>
  );
};
```

### 2. Using the API Service Directly

```typescript
import { restaurantApi } from '@/src/services/customer/restaurant.service';

const submitReview = async () => {
  try {
    const response = await restaurantApi.createRestaurantReview('restaurant-id', {
      score: 4,
      review: \"Great build quality and fast delivery!\"
    });
    
    console.log('Review created:', response);
  } catch (error) {
    console.error('Failed to create review:', error);
  }
};
```

### 3. Form Implementation Example

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useCreateRestaurantReview } from '@/src/hooks/customer/useCustomerApi';

const ReviewForm = ({ restaurantId }: { restaurantId: string }) => {
  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');
  
  const createReviewMutation = useCreateRestaurantReview();

  const handleStarPress = (rating: number) => {
    setScore(rating);
  };

  const handleSubmit = async () => {
    if (score === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        restaurantId,
        reviewData: { score, review: review.trim() }
      });
      
      // Reset form
      setScore(0);
      setReview('');
      
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  return (
    <View>
      {/* Star Rating */}
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
            <Text style={{ fontSize: 30, color: star <= score ? '#FFD700' : '#CCC' }}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Review Text */}
      <TextInput
        placeholder=\"Write your review...\"
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={4}
      />

      {/* Submit Button */}
      <Button
        mode=\"contained\"
        onPress={handleSubmit}
        disabled={score === 0 || createReviewMutation.isPending}
      >
        {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </View>
  );
};
```

## Key Features

### 1. **Automatic Cache Invalidation**
When a review is successfully created, the hook automatically:
- Invalidates restaurant reviews cache
- Invalidates restaurant details cache (to update rating)
- Triggers refetch of updated data

### 2. **Error Handling**
- Production-safe error messages
- Dual-language support (English/French)
- User-friendly error notifications

### 3. **Loading States**
- `isPending` state for showing loading indicators
- Disabled form submission during API calls
- Loading text on submit button

### 4. **Type Safety**
- Full TypeScript support
- Validated request/response types
- IDE autocomplete and error checking

## Navigation Integration

The review screen can be navigated to with:

```typescript
navigation.navigate('RestaurantReview', {
  restaurantId: 'restaurant-id',
  restaurantName: 'Restaurant Name',
  restaurantImage: 'image-url'
});
```

## Testing

```typescript
// Mock the hook for testing
jest.mock('@/src/hooks/customer/useCustomerApi', () => ({
  useCreateRestaurantReview: () => ({
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
  }),
}));
```

## Migration Notes

### Breaking Changes
- Changed `rating` parameter to `score`
- Changed `reviewText` parameter to `review`
- Updated API endpoint structure

### Backward Compatibility
The API service maintains backward compatibility by accepting the new parameter structure while the UI components have been updated to use the new naming convention.

## Error Scenarios

The system handles various error scenarios:

1. **Network Errors**: Shows connection error message
2. **Validation Errors**: Shows field-specific error messages
3. **Server Errors**: Shows generic server error message
4. **Authentication Errors**: Redirects to login if needed

All error messages are automatically translated based on the user's language preference."