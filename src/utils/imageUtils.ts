import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export interface ImagePickerResult {
  uri: string;
  base64?: string;
  type: string;
  name: string;
}

/**
 * Pick an image from the device gallery and convert to base64
 */
export const pickImageWithBase64 = async (): Promise<ImagePickerResult | null> => {
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
      base64: true, // Request base64 encoding
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    
    return {
      uri: asset.uri,
      base64: asset.base64,
      type: asset.type || 'image/jpeg',
      name: `menu-item-${Date.now()}.jpg`,
    };
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

/**
 * Convert image URI to base64 string
 */
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Create a data URL from base64 string
 */
export const createDataURL = (base64: string, mimeType: string = 'image/jpeg'): string => {
  return `data:${mimeType};base64,${base64}`;
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
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      return '.jpg';
  }
};