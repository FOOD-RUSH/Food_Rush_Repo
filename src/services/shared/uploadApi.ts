import TokenManager from './tokenManager';
import { apiClient } from './apiClient';

export interface UploadImageResponse {
  status_code: number;
  message: string;
  data: { pictureUrl: string };
}

export const uploadApi = {
  uploadImage: async (file: { uri: string; name: string; type: string }): Promise<string> => {
    try {
      // Get auth token
      const token = await TokenManager.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Get base URL
      const baseURL = apiClient.getBaseURL();

      // Create FormData for image upload
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      // Use built-in fetch for binary upload
      const response = await fetch(`${baseURL}/uploads/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Don't set Content-Type - let fetch handle it for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed with status ${response.status}`
        );
      }

      const data: UploadImageResponse = await response.json();
      return data.data.pictureUrl;
    } catch (error: any) {
      console.error('❌ Image upload failed:', error);
      throw error;
    }
  },
};
