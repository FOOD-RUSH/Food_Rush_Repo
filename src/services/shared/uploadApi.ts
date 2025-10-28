import { apiClient } from './apiClient';

export interface UploadImageResponse {
  status_code: number;
  message: string;
  data: { pictureUrl: string };
}

export const uploadApi = {
  uploadImage: async (file: { uri: string; name: string; type: string }) => {
    const form = new FormData();
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const res = await apiClient.post<UploadImageResponse>('/uploads/image', form, {
      headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    });
    return res.data.data.pictureUrl;
  },
};
