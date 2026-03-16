import axios from 'axios';
import { clearSession } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('q6_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    if (statusCode === 401 && !requestUrl.includes('/api/v1/users/login/')) {
      clearSession();
      window.dispatchEvent(new Event('auth-changed'));
    }

    return Promise.reject(error);
  }
);

export default api;
