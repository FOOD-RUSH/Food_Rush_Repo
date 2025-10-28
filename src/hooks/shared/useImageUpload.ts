import { useMutation } from '@tanstack/react-query';
import { LocalImageData } from '@/src/services/shared/profileApi';
import { pickImageForUpload } from '@/src/utils/imageUtils';
import { uploadApi } from '@/src/services/shared/uploadApi';

/**
 * Upload a picked image to backend and return the hosted pictureUrl
 */
export const useProfileImageUpload = () => {
  return useMutation({
    mutationFn: async (image: LocalImageData): Promise<string> => {
      const pictureUrl = await uploadApi.uploadImage({
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
      return pictureUrl;
    },
    onError: (error: any) => {
      console.error('❌ Profile image upload failed:', error);
    },
  });
};

/**
 * Pick an image from device
 */
export const usePickAndUploadProfileImage = () => {
  return useMutation({
    mutationFn: async (): Promise<LocalImageData> => {
      const imageResult = await pickImageForUpload();
      if (!imageResult) {
        throw new Error('No image selected');
      }
      return imageResult;
    },
    onError: (error: any) => {
      console.error('❌ Image picking failed:', error);
    },
  });
};

/**
 * Helper to track upload status across pick+upload flows
 */
export const useImageUploadStatus = () => {
  const uploadMutation = useProfileImageUpload();
  const pickImageMutation = usePickAndUploadProfileImage();

  return {
    isUploading: uploadMutation.isPending || pickImageMutation.isPending,
    uploadError: (uploadMutation.error as any) || (pickImageMutation.error as any),
    uploadSuccess: uploadMutation.isSuccess || pickImageMutation.isSuccess,
    reset: () => {
      uploadMutation.reset();
      pickImageMutation.reset();
    },
  };
};