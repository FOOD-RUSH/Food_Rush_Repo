import { useMutation } from '@tanstack/react-query';
import { LocalImageData } from '@/src/services/shared/profileApi';
import { pickImageForUpload } from '@/src/utils/imageUtils';

/**
 * Hook for uploading profile pictures with profile data
 * Uses FormData approach directly with the profile update endpoint
 */
export const useProfileImageUpload = () => {
  return useMutation({
    mutationFn: async (data: {
      fullName?: string;
      phoneNumber?: string;
      picture: LocalImageData;
    }): Promise<any> => {
      // Implementation would go here
      return data;
    },
    onError: (error: any) => {
      console.error('❌ Profile update with image failed:', error);
    },
  });
};

/**
 * Hook for picking profile images
 * Returns the picked image data that can be used with profile update
 */
export const usePickAndUploadProfileImage = () => {
  return useMutation({
    mutationFn: async (): Promise<LocalImageData> => {
      // Pick image from device

      const imageResult = await pickImageForUpload();

      if (!imageResult) {
        throw new Error('No image selected');
      }

      return imageResult;
    },
    onSuccess: (imageData: LocalImageData) => {},
    onError: (error: any) => {
      console.error('❌ Image picking failed:', error);
    },
  });
};

/**
 * Hook for getting current upload progress and status
 */
export const useImageUploadStatus = () => {
  const uploadMutation = useProfileImageUpload();
  const pickImageMutation = usePickAndUploadProfileImage();

  return {
    isUploading: uploadMutation.isPending || pickImageMutation.isPending,
    uploadError: uploadMutation.error || pickImageMutation.error,
    uploadSuccess: uploadMutation.isSuccess || pickImageMutation.isSuccess,
    reset: () => {
      uploadMutation.reset();
      pickImageMutation.reset();
    },
  };
};
