import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://foodrush-be.onrender.com',
  timeout: 10000,
  headers: { 'Content-type': 'application/json ' },
  withCredentials: true

});

// request interceptors

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('request accepted');
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
