import api from './http';

export const Restaurants = {
  registerAndCreate: (payload: any) =>
    api.post('/api/v1/restaurants/auth/register-and-create', payload),

  like: (id: string) => api.post(`/api/v1/restaurants/${id}/like`),
  unlike: (id: string) => api.delete(`/api/v1/restaurants/${id}/like`),
  liked: () => api.get('/api/v1/restaurants/liked'),

  create: (payload: any) => api.post('/api/v1/restaurants', payload),
  list: (params?: Record<string, any>) => api.get('/api/v1/restaurants', { params }),
  nearby: (params: { latitude: number; longitude: number; radiusKm?: number }) =>
    api.get('/api/v1/restaurants/nearby', { params }),
  browse: (params?: Record<string, any>) => api.get('/api/v1/restaurants/browse', { params }),
  getById: (id: string) => api.get(`/api/v1/restaurants/${id}`),

  updateLocation: (id: string, body: { latitude: number; longitude: number }) =>
    api.patch(`/api/v1/restaurants/${id}/location`, body),
  updateMenuSettings: (id: string, body: { menuMode: string; timezone: string }) =>
    api.patch(`/api/v1/restaurants/${id}/menu-settings`, body),
  updateStatus: (id: string, body: { status: 'OPEN' | 'CLOSED' }) =>
    api.patch(`/api/v1/restaurants/${id}/status`, body),

  ownerRegister: (body: any) => api.post('/api/v1/restaurants/auth/register', body),
  ownerLogin: (body: { emailOrPhone: string; password: string }) =>
    api.post('/api/v1/restaurants/auth/login', body),
};

export default Restaurants;


