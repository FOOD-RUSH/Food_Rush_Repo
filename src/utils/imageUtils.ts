import * as ImagePicker from 'expo-image-picker';

export interface ImagePickerResult {
  uri: string;
  type: string;
  name: string;
}

/**
 * Pick an image from the device gallery
 * Returns the file URI that can be used directly with FormData
 */
export const pickImageForUpload = async (): Promise<ImagePickerResult | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images || 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
      // Don't request base64 - we'll send the file directly
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    
    // Determine the actual file type from the URI or use a default
    let mimeType = asset.type || 'image/jpeg';
    let fileExtension = 'jpg';
    
    // Try to determine type from URI if not provided
    if (!asset.type && asset.uri) {
      const uriLower = asset.uri.toLowerCase();
      if (uriLower.includes('.png')) {
        mimeType = 'image/png';
        fileExtension = 'png';
      } else if (uriLower.includes('.jpg') || uriLower.includes('.jpeg')) {
        mimeType = 'image/jpeg';
        fileExtension = 'jpg';
      }
    } else if (asset.type) {
      // Use the provided type
      fileExtension = getFileExtension(asset.type);
    }
    
    // Generate filename with correct extension
    const fileName = `menu-item-${Date.now()}.${fileExtension}`;
    
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
 * Validate image file type
 */
export const isValidImageType = (type: string): boolean => {
  if (!type) return false;
  
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp' // Also support WebP
  ];
  return validTypes.includes(type.toLowerCase());
};

/**
 * Validate image file by URI extension as fallback
 */
export const isValidImageUri = (uri: string): boolean => {
  if (!uri) return false;
  
  const uriLower = uri.toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  return validExtensions.some(ext => uriLower.includes(ext));
};

/**
 * Get file extension from mime type
 */
export const getFileExtension = (mimeType: string): string => {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
};

/**
 * Enhanced image picker with better type detection
 */
export const pickImageWithValidation = async (): Promise<ImagePickerResult | null> => {
  try {
    const result = await pickImageForUpload();
    
    if (!result) {
      return null;
    }
    
    // Double validation - check both type and URI
    const isValidType = isValidImageType(result.type);
    const isValidUri = isValidImageUri(result.uri);
    
    if (!isValidType && !isValidUri) {
      throw new Error('Invalid image format. Please select a JPG, PNG, or WebP image.');
    }
    
    return result;
  } catch (error) {
    console.error('Error in pickImageWithValidation:', error);
    throw error;
  }
};