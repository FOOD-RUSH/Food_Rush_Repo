import { useMutation } from '@tanstack/react-query';
import { profileApi, LocalImageData } from '@/src/services/shared/profileApi';
import { pickImageForUpload } from '@/src/utils/imageUtils';

/**
 * Hook for uploading profile pictures
 * Returns a URL that can be used in profile updates
 */
export const useProfileImageUpload = () => {
  return useMutation({
    mutationFn: async (imageData: LocalImageData): Promise<string> => {
      console.log('📤 Uploading profile picture...');
      const imageUrl = await profileApi.uploadProfilePicture({ picture: imageData });
      console.log('✅ Profile picture uploaded successfully:', imageUrl);
      return imageUrl;
    },
    onError: (error: any) => {
      console.error('❌ Profile picture upload failed:', error);
    },
  });
};

/**
 * Hook for picking and uploading profile pictures in one step
 * Combines image picker with upload functionality
 */
export const usePickAndUploadProfileImage = () => {
  const uploadMutation = useProfileImageUpload();

  return useMutation({
    mutationFn: async (): Promise<string> => {
      // Step 1: Pick image from device
      console.log('📱 Opening image picker...');
      const imageResult = await pickImageForUpload();
      
      if (!imageResult) {
        throw new Error('No image selected');
      }

      // Step 2: Upload the picked image
      console.log('📤 Uploading selected image...');
      const imageUrl = await profileApi.uploadProfilePicture({ picture: imageResult });
      
      return imageUrl;
    },
    onSuccess: (imageUrl: string) => {
      console.log('✅ Image picked and uploaded successfully:', imageUrl);
    },
    onError: (error: any) => {
      console.error('❌ Pick and upload failed:', error);
    },
  });
};

/**
 * Hook for getting current upload progress and status
 */
export const useImageUploadStatus = () => {
  const uploadMutation = useProfileImageUpload();
  const pickAndUploadMutation = usePickAndUploadProfileImage();

  return {
    isUploading: uploadMutation.isPending || pickAndUploadMutation.isPending,
    uploadError: uploadMutation.error || pickAndUploadMutation.error,
    uploadSuccess: uploadMutation.isSuccess || pickAndUploadMutation.isSuccess,
    reset: () => {
      uploadMutation.reset();
      pickAndUploadMutation.reset();
    },
  };
};