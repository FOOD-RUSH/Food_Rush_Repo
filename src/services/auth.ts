import api from './http';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Auth = {
  ownerRegister: (body: any) => api.post('/api/v1/restaurants/auth/register', body),
  ownerLogin: async (body: { emailOrPhone: string; password: string }) => {
    const res = await api.post('/api/v1/restaurants/auth/login', body);
    const token = (res.data as any)?.token || (res.data as any)?.accessToken;
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    }
    return res;
  },
  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
  },
};

export default Auth;


