import {
  documentDirectory,
  cacheDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  copyAsync,
  deleteAsync,
} from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const IMAGE_STORAGE_KEY = '@food_rush_images';

export interface StoredImage {
  id: string;
  localUri: string;
  originalUri: string;
  timestamp: number;
}

/**
 * Save an image from ImagePicker result to local file system
 * @param imageUri - The URI from ImagePicker result
 * @param imageId - Unique identifier for the image
 * @returns Promise<string> - Local file path
 */
export const saveImageLocally = async (
  imageUri: string,
  imageId: string,
): Promise<string> => {
  try {
    // Create directory if it doesn't exist
    const directory = `${documentDirectory || ''}images/`;
    const dirInfo = await getInfoAsync(directory);

    if (!dirInfo.exists) {
      await makeDirectoryAsync(directory, { intermediates: true });
    }

    // Generate local file path
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const localUri = `${directory}${imageId}.${fileExtension}`;

    // Copy image to local storage
    await copyAsync({
      from: imageUri,
      to: localUri,
    });

    // Store metadata in AsyncStorage
    const storedImages = await getStoredImages();
    const imageData: StoredImage = {
      id: imageId,
      localUri,
      originalUri: imageUri,
      timestamp: Date.now(),
    };

    storedImages[imageId] = imageData;
    await AsyncStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(storedImages));

    return localUri;
  } catch (error) {
    console.error('Error saving image locally:', error);
    throw error;
  }
};

/**
 * Get stored image metadata from AsyncStorage
 * @returns Promise<Record<string, StoredImage>>
 */
export const getStoredImages = async (): Promise<
  Record<string, StoredImage>
> => {
  try {
    const stored = await AsyncStorage.getItem(IMAGE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting stored images:', error);
    return {};
  }
};

/**
 * Get a specific stored image by ID
 * @param imageId - The image ID
 * @returns Promise<StoredImage | null>
 */
export const getStoredImage = async (
  imageId: string,
): Promise<StoredImage | null> => {
  try {
    const storedImages = await getStoredImages();
    return storedImages[imageId] || null;
  } catch (error) {
    console.error('Error getting stored image:', error);
    return null;
  }
};

/**
 * Delete a stored image
 * @param imageId - The image ID to delete
 */
export const deleteStoredImage = async (imageId: string): Promise<void> => {
  try {
    const storedImages = await getStoredImages();

    if (storedImages[imageId]) {
      // Delete file from file system
      await deleteAsync(storedImages[imageId].localUri, { idempotent: true });

      // Remove from storage
      delete storedImages[imageId];
      await AsyncStorage.setItem(
        IMAGE_STORAGE_KEY,
        JSON.stringify(storedImages),
      );
    }
  } catch (error) {
    console.error('Error deleting stored image:', error);
    throw error;
  }
};

/**
 * Clean up old images (older than specified days)
 * @param daysOld - Number of days to keep images
 */
export const cleanupOldImages = async (daysOld: number = 30): Promise<void> => {
  try {
    const storedImages = await getStoredImages();
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

    const imagesToDelete: string[] = [];

    for (const [id, image] of Object.entries(storedImages)) {
      if (image.timestamp < cutoffTime) {
        imagesToDelete.push(id);
      }
    }

    for (const imageId of imagesToDelete) {
      await deleteStoredImage(imageId);
    }

    console.log(`Cleaned up ${imagesToDelete.length} old images`);
  } catch (error) {
    console.error('Error cleaning up old images:', error);
  }
};

/**
 * Generate a unique image ID
 * @returns string
 */
export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if a URI is a local file
 * @param uri - The URI to check
 * @returns boolean
 */
export const isLocalUri = (uri: string): boolean => {
  const docDir = documentDirectory || '';
  const cacheDir = cacheDirectory || '';
  return (
    uri.startsWith(docDir) ||
    uri.startsWith(cacheDir) ||
    (Platform.OS === 'android' && uri.startsWith('file://'))
  );
};
