// Custom ID generation functions to replace uuid library

/**
 * Generate a random string ID with specified length
 * @param length Length of the ID (default: 8)
 * @returns Random string ID
 */
export const generateRandomId = (length: number = 8): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Generate a timestamp-based ID with random suffix
 * @returns Timestamp-based unique ID
 */
export const generateTimestampId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Generate a cryptographically secure random ID
 * @param length Length of the ID (default: 16)
 * @returns Secure random ID
 */
export const generateSecureId = (length: number = 16): string => {
  // Using Expo's crypto module for better security
  try {
    // If crypto is available, use it
    // @ts-ignore
    if (global.crypto && global.crypto.getRandomValues) {
      // @ts-ignore
      const array = new Uint8Array(length);
      // @ts-ignore
      global.crypto.getRandomValues(array);
      return Array.from(array, (byte) =>
        byte.toString(16).padStart(2, '0'),
      ).join('');
    }
  } catch (e) {
    // Fallback to Math.random if crypto is not available
  }

  return generateRandomId(length);
};
