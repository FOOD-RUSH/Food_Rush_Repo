# Profile Update Implementation Guide

## Overview

This guide explains the unified profile update system that works for both customer and restaurant users using the PATCH `/api/v1/auth/profile` endpoint.

## API Endpoint

**Endpoint:** `PATCH /api/v1/auth/profile`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "phoneNumber": "+237612345678",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Response:**

```json
{
  "status_code": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "fullName": "John Doe",
    "phoneNumber": "+237612345678",
    "profilePicture": "https://example.com/profile.jpg",
    "email": "user@example.com",
    "role": "customer"
    // ... other user fields
  }
}
```

## Implementation Files

### 1. API Service (`src/services/shared/profileApi.ts`)

- Unified API service for profile updates
- Uses the PATCH `/auth/profile` endpoint
- Handles both customer and restaurant users

### 2. Unified Hook (`src/hooks/shared/useProfileUpdate.ts`)

- `useUpdateProfile()` - Hook for updating profiles
- `useGetProfile()` - Hook for fetching current profile
- Works with both user types
- Handles auth store updates and cache invalidation

### 3. Updated Screens

#### Customer Profile Edit (`src/screens/customer/Profile/EditProfileScreen.tsx`)

- Image upload functionality with expo-image-picker
- Only includes fields from the API request body
- Removed email and date fields (not in API spec)

#### Restaurant Profile Edit (`src/screens/restaurant/account/ProfileEditScreen.tsx`)

- Image upload functionality with expo-image-picker
- Only includes fields from the API request body
- Removed restaurant-specific fields (handled separately)

## Features

### ✅ Image Upload

Both screens now support profile picture upload:

- Uses `expo-image-picker` for image selection
- Square aspect ratio (1:1) for consistent profile pictures
- Permission handling for camera roll access
- Loading states during image selection
- Preview of selected image

### ✅ Unified API

- Single endpoint for both customer and restaurant users
- Consistent request/response format
- Proper error handling and user feedback

### ✅ Form Validation

- Required field validation
- Phone number format validation
- Image type validation (handled by expo-image-picker)

## Usage Examples

### Using the Hook

```typescript
import { useUpdateProfile } from '@/src/hooks/shared/useProfileUpdate';

const MyComponent = () => {
  const updateProfileMutation = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName: "John Doe",
        phoneNumber: "+237612345678",
        profilePicture: "https://example.com/profile.jpg"
      });
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <Button
      onPress={handleUpdate}
      loading={updateProfileMutation.isPending}
      disabled={updateProfileMutation.isPending}
    >
      Update Profile
    </Button>
  );
};
```

### Image Upload Flow

```typescript
const handleImagePicker = async () => {
  try {
    setIsUploadingImage(true);

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions...');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to pick image');
  } finally {
    setIsUploadingImage(false);
  }
};
```

## Field Specifications

### Required Fields

- `fullName` - User's full name (string)
- `phoneNumber` - Phone number with country code (string, format: +237612345678)

### Optional Fields

- `profilePicture` - Profile picture URL or local URI (string)

### Removed Fields

The following fields were removed as they're not in the API specification:

- `email` - Email updates might require separate verification flow
- `dateOfBirth` - Not in the API spec
- `address` - Customer-specific, might need separate endpoint
- `restaurantName` - Restaurant-specific, handled by restaurant update endpoints
- `bio`, `website` - Not in the core profile API

## Error Handling

### Common Error Scenarios

1. **Network errors** - Connection issues
2. **Validation errors** - Invalid phone number format
3. **Permission errors** - Camera roll access denied
4. **Server errors** - Backend validation failures

### Error Display

```typescript
catch (error: any) {
  const errorMessage = error?.response?.data?.message ||
                      error?.message ||
                      'Failed to update profile';

  Alert.alert('Error', errorMessage);
}
```

## Testing Checklist

### Functional Testing

- [ ] Update full name only
- [ ] Update phone number only
- [ ] Update profile picture only
- [ ] Update all fields together
- [ ] Handle empty/invalid phone numbers
- [ ] Test image picker permissions
- [ ] Test image picker cancellation
- [ ] Test network error scenarios

### UI Testing

- [ ] Loading states during update
- [ ] Loading states during image upload
- [ ] Success feedback
- [ ] Error message display
- [ ] Image preview updates
- [ ] Button disabled states

### Cross-Platform Testing

- [ ] iOS image picker functionality
- [ ] Android image picker functionality
- [ ] Permission handling on both platforms
- [ ] Image display consistency

## Migration Notes

### For Existing Code

- Replace `useUpdateProfile` from customer/restaurant hooks with the unified version
- Update import statements to use `@/src/hooks/shared/useProfileUpdate`
- Remove fields not in the API specification
- Add image upload functionality where needed

### Backward Compatibility

- Legacy hooks are marked as deprecated but still functional
- Existing screens will continue to work during migration
- Gradual migration recommended

## Future Enhancements

1. **Image Upload to Cloud Storage**
   - Currently uses local URIs
   - Could be enhanced to upload to cloud storage first
   - Return cloud URL for profilePicture field

2. **Additional Validation**
   - Phone number format validation
   - Image size/format validation
   - Real-time validation feedback

3. **Offline Support**
   - Queue profile updates when offline
   - Sync when connection restored

4. **Profile Picture Optimization**
   - Image compression before upload
   - Multiple image sizes for different use cases
