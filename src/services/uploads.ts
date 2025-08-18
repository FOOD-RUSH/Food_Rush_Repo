import api from './http';

export const Uploads = {
  image: (file: { uri: string; name: string; type: string }) => {
    const data = new FormData();
    data.append('file', file as any);
    return api.post('/api/v1/uploads/image', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default Uploads;


