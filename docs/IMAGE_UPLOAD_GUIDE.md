# Image Upload Implementation Guide

## Overview

This guide explains how image uploads are implemented in the Food Rush app, specifically for menu item images in the restaurant add menu screen. The implementation follows React Native best practices for multipart/form-data uploads.

## Key Requirements

- **Supported formats**: JPG and PNG only
- **Upload method**: multipart/form-data for binary uploads
- **Image object structure**: `{ uri, name, type }` as required by React Native
- **Validation**: Type validation before upload
- **Error handling**: Comprehensive error messages for users

## Implementation Components

### 1. Image Utilities (`src/utils/imageUtils.ts`)

#### `pickImageForUpload()`

- Uses `expo-image-picker` to select images from device gallery
- Configured for square aspect ratio (1:1) suitable for menu items
- Quality set to 0.8 for optimal balance between quality and file size
- Returns properly formatted image object for FormData

#### `determineMimeType()`

- Multi-method MIME type detection:
  1. Uses `asset.type` from expo-image-picker if available
  2. Determines from filename extension
  3. Determines from URI path
  4. Defaults to 'image/jpeg' as fallback

#### `isValidImageType()`

- Validates that image type is 'image/jpeg', 'image/jpg', or 'image/png'
- Case-insensitive validation
- Rejects all other formats (GIF, WebP, etc.)

#### `createImageFormDataObject()`

- Creates properly formatted object for React Native FormData
- Ensures correct structure: `{ uri, name, type }`

### 2. API Service (`src/services/restaurant/menuApi.ts`)

#### FormData Construction

```typescript
const formData = new FormData();

// Text fields
formData.append('name', data.name);
formData.append('description', data.description);
formData.append('price', data.price.toString());
formData.append('category', data.category);
formData.append('isAvailable', data.isAvailable.toString());

// Image file
const imageFile = {
  uri: data.picture.uri, // File URI from image picker
  name: data.picture.name, // Filename with proper extension
  type: data.picture.type, // MIME type: 'image/jpeg' or 'image/png'
};
formData.append('picture', imageFile as any);
```

#### Headers Configuration

```typescript
// Important: Do NOT set Content-Type manually for FormData
// axios will automatically set 'multipart/form-data' with proper boundary
headers: {
  'Accept': 'application/json',
  // Content-Type is automatically set by axios
}
```

### 3. Screen Implementation (`src/screens/restaurant/menu/AddFoodScreen.tsx`)

#### Image Selection Flow

1. User taps image upload area
2. `handleImagePick()` is called
3. Image picker opens with configured options
4. Selected image is validated for type and optionally size
5. Image object is formatted for FormData
6. Form state is updated with image data

#### Validation Process

```typescript
// Type validation
if (!isValidImageType(result.type)) {
  Alert.alert('Invalid Image Type', 'Please select a JPG or PNG image only.');
  return;
}

// Optional size validation
if (!isValidImageSize(result.fileSize, 10)) {
  Alert.alert('Image Too Large', 'Please select an image smaller than 10MB.');
  return;
}
```

## Platform-Specific Considerations

### iOS

- URIs typically start with `ph://` or `assets-library://`
- React Native handles these URIs automatically in FormData
- No special conversion needed

### Android

- URIs typically start with `content://`
- React Native handles these URIs automatically in FormData
- No special conversion needed

### Web (if applicable)

- URIs are typically `blob:` URLs
- FormData works similarly to native platforms

## Error Handling

### Common Error Scenarios

1. **Permission denied**: User hasn't granted media library access
2. **Invalid image type**: User selects unsupported format (GIF, WebP, etc.)
3. **File too large**: Image exceeds size limit (if implemented)
4. **Network errors**: Upload fails due to connectivity issues
5. **Server errors**: Backend rejects the upload

### Error Messages

- User-friendly error messages in multiple languages
- Specific guidance for resolution (e.g., "enable permissions in settings")
- Fallback to generic messages if translation missing

## Testing

### Unit Tests (`src/utils/__tests__/imageUtils.test.ts`)

- Type validation tests
- File extension detection tests
- Size validation tests
- FormData object creation tests

### Manual Testing Checklist

- [ ] Select JPG image - should work
- [ ] Select PNG image - should work
- [ ] Select GIF image - should show error
- [ ] Select very large image - should show size error (if implemented)
- [ ] Deny permissions - should show permission error
- [ ] Upload with poor network - should handle gracefully
- [ ] Upload successful - should show success message

## Debugging

### Logging

The implementation includes comprehensive logging:

```typescript
console.log('✅ Image validated and selected for menu item:', {
  type: result.type,
  name: result.name,
  uri: result.uri.substring(0, 50) + '...',
  isValidType: isValidImageType(result.type),
  formDataReady: true,
});
```

### Common Issues

1. **415 Unsupported Media Type**: Usually means Content-Type was set manually
2. **Server doesn't receive image**: Check FormData field name matches backend expectation
3. **Image appears corrupted**: Ensure proper MIME type detection
4. **Upload timeout**: Increase timeout for large files

## Best Practices

1. **Never set Content-Type manually** for FormData - let axios/fetch handle it
2. **Always validate image type** before upload
3. **Provide clear error messages** to users
4. **Log upload details** for debugging
5. **Handle all error scenarios** gracefully
6. **Use proper image object structure** for React Native compatibility
7. **Consider file size limits** to prevent large uploads
8. **Test on both iOS and Android** as URI formats differ

## Future Enhancements

1. **Image compression**: Reduce file size before upload
2. **Multiple image support**: Allow multiple images per menu item
3. **Image cropping**: Allow users to crop images to specific dimensions
4. **Progress indicators**: Show upload progress for large files
5. **Retry mechanism**: Automatically retry failed uploads
6. **Offline support**: Queue uploads when offline
