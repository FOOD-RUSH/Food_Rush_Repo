import api from './http';

export const Menu = {
  listForRestaurant: (restaurantId: string) =>
    api.get(`/api/v1/restaurants/${restaurantId}/menu`),

  createItem: (restaurantId: string, body: any) =>
    api.post(`/api/v1/restaurants/${restaurantId}/menu`, body),

  getEffective: (restaurantId: string) =>
    api.get(`/api/v1/restaurants/${restaurantId}/menu/effective`),

  createWeekly: (restaurantId: string, body: any) =>
    api.post(`/api/v1/restaurants/${restaurantId}/menu/weekly`, body),

  uploadPicture: (restaurantId: string, file: { uri: string; name: string; type: string }) => {
    const data = new FormData();
    data.append('file', file as any);
    return api.post(`/api/v1/restaurants/${restaurantId}/menu/picture`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadPictures: (restaurantId: string, files: { uri: string; name: string; type: string }[]) => {
    const data = new FormData();
    files.forEach((f) => data.append('files', f as any));
    return api.post(`/api/v1/restaurants/${restaurantId}/menu/pictures`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  allPublic: (params?: Record<string, any>) => api.get('/api/v1/menu/all', { params }),
  allNearbyPublic: (params: { latitude: number; longitude: number; radiusKm?: number }) =>
    api.get('/api/v1/menu/all/nearby', { params }),
  browsePublic: (params?: Record<string, any>) => api.get('/api/v1/menu/browse', { params }),
};

export default Menu;


