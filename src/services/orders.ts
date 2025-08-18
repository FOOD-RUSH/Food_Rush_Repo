import api from './http';

export const Orders = {
  create: (body: any) => api.post('/api/v1/orders', body),
  listForMyRestaurant: () => api.get('/api/v1/orders/my-restaurant'),
  listForRestaurant: (restaurantId: string) => api.get(`/api/v1/orders/restaurant/${restaurantId}`),
  listMy: () => api.get('/api/v1/orders/my'),
  listByCustomer: (customerId: string) => api.get(`/api/v1/orders/customer/${customerId}`),
  getById: (id: string) => api.get(`/api/v1/orders/${id}`),
  confirmReceived: (id: string) => api.post(`/api/v1/orders/${id}/confirm-received`),
  customerConfirm: (id: string) => api.post(`/api/v1/orders/${id}/customer-confirm`),
  restaurantConfirm: (id: string) => api.post(`/api/v1/orders/${id}/confirm`),
  restaurantReject: (id: string, body?: { reason?: string }) =>
    api.post(`/api/v1/orders/${id}/reject`, body),
};

export default Orders;


