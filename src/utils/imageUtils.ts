import * as ImagePicker from 'expo-image-picker';

export interface SimpleImageResult {
  uri: string;
  type: string;
  name: string;
}

/**
 * Simple image picker for menu items - only JPG or PNG
 * Returns just the image object for backend upload
 */
export const pickImageForUpload = async (): Promise<SimpleImageResult | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Launch image picker with simple configuration
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for menu items
      quality: 0.8,
      allowsMultipleSelection: false,
      exif: false,
      base64: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    
    // Determine file type - only allow JPG or PNG
    let mimeType = 'image/jpeg'; // Default to JPEG
    let fileExtension = 'jpg';
    
    if (asset.uri) {
      const uriLower = asset.uri.toLowerCase();
      if (uriLower.includes('.png')) {
        mimeType = 'image/png';
        fileExtension = 'png';
      }
    }
    
    // Simple filename
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
 * Simple validation for JPG or PNG images
 */
export const isValidImageType = (type: string): boolean => {
  if (!type) return false;
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