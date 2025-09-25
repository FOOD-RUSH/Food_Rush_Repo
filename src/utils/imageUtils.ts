import * as ImagePicker from 'expo-image-picker';

export interface SimpleImageResult {
  uri: string;
  type: string;
  name: string;
}

/**
 * Enhanced image picker for menu items - only JPG or PNG
 * Returns properly formatted image object for multipart/form-data upload
 * Follows React Native FormData requirements: { uri, name, type }
 */
export const pickImageForUpload =
  async (): Promise<SimpleImageResult | null> => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library was denied');
      }

      // Launch image picker with optimized configuration for food images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for menu items
        quality: 0.8, // Good balance between quality and file size
        allowsMultipleSelection: false,
        exif: false, // Remove EXIF data for privacy
        base64: false, // We don't need base64 for FormData uploads
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];

      // Determine MIME type using multiple methods for accuracy
      let mimeType = determineMimeType(asset);
      let fileExtension = getFileExtension(mimeType);

      // Validate that we only accept JPG or PNG
      if (!isValidImageType(mimeType)) {
        throw new Error(
          `Unsupported image type: ${mimeType}. Only JPG and PNG are allowed.`,
        );
      }

      // Generate filename with proper extension
      const fileName = `menu-item-${Date.now()}.${fileExtension}`;

      console.log('Image selected for upload:', {
        uri: asset.uri.substring(0, 50) + '...',
        type: mimeType,
        name: fileName,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      });

      return {
        uri: asset.uri,
        type: mimeType,
        name: fileName,
      };
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  };

/**
 * Determine MIME type from ImagePicker asset using multiple methods
 */
function determineMimeType(asset: ImagePicker.ImagePickerAsset): string {
  // Method 1: Use the type from expo-image-picker if available
  if (asset.type) {
    const normalizedType = asset.type.toLowerCase();
    if (normalizedType === 'image' || normalizedType === 'photo') {
      // Generic type, need to determine from URI or filename
    } else if (normalizedType.startsWith('image/')) {
      return normalizedType;
    }
  }

  // Method 2: Determine from filename if available
  if (asset.fileName) {
    const fileName = asset.fileName.toLowerCase();
    if (fileName.endsWith('.png')) {
      return 'image/png';
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      return 'image/jpeg';
    }
  }

  // Method 3: Determine from URI
  if (asset.uri) {
    const uriLower = asset.uri.toLowerCase();
    if (uriLower.includes('.png') || uriLower.endsWith('png')) {
      return 'image/png';
    } else if (
      uriLower.includes('.jpg') ||
      uriLower.includes('.jpeg') ||
      uriLower.endsWith('jpg') ||
      uriLower.endsWith('jpeg')
    ) {
      return 'image/jpeg';
    }
  }

  // Default to JPEG (most common format)
  return 'image/jpeg';
}

/**
 * Enhanced validation for JPG or PNG images only
 */
export const isValidImageType = (type: string): boolean => {
  if (!type) return false;
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return validTypes.includes(type.toLowerCase());
};

/**
 * Get file extension from MIME type
 */
export const getFileExtension = (mimeType: string): string => {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    default:
      return 'jpg'; // Default fallback
  }
};

/**
 * Validate image file size (optional - can be used for additional validation)
 */
export const isValidImageSize = (
  fileSize?: number,
  maxSizeMB: number = 10,
): boolean => {
  if (!fileSize) return true; // If size is unknown, allow it
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};

/**
 * Create a properly formatted image object for React Native FormData
 * This ensures the object structure matches what React Native expects
 */
export const createImageFormDataObject = (imageResult: SimpleImageResult) => {
  return {
    uri: imageResult.uri,
    name: imageResult.name,
    type: imageResult.type,
  } as const;
};
