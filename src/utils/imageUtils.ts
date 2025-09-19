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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      // Don't request base64 - we'll send the file directly
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    
    return {
      uri: asset.uri,
      type: asset.type || 'image/jpeg',
      name: `menu-item-${Date.now()}.jpg`,
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
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return validTypes.includes(type.toLowerCase());
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
    default:
      return 'jpg';
  }
};