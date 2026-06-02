import { API_ERROR_MESSAGES } from '@/constants/error-message-api';
import { clearAuthTokens, getRefreshToken, isTokenExpired, setAuthTokens } from '@/utils/localstorage';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Gắn interceptor xử lý lỗi API chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        toast.error(API_ERROR_MESSAGES.code400);
        break;

      case 401:
        toast.error(API_ERROR_MESSAGES.code401);
        break;

      case 403:
        toast.error(API_ERROR_MESSAGES.code403);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
        break;

      case 404:
        toast.error(API_ERROR_MESSAGES.code404);
        break;

      case 500:
        toast.error(API_ERROR_MESSAGES.code500);
        break;

      case 502:
        toast.error(API_ERROR_MESSAGES.code502);
        break;

      case 504:
        toast.error(API_ERROR_MESSAGES.code504);
        break;

      default:
        if (!status) {
          toast.error(API_ERROR_MESSAGES.code0);
        }
        break;
    }

    return Promise.reject(error);
  }
);

// Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isLoginPage = window.location.pathname === '/login';
    const isRefreshRequest = original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original._retry && !isRefreshRequest) {
      original._retry = true;
      const refresh_token = getRefreshToken();

      if (!refresh_token || isTokenExpired(refresh_token)) {
        if (!isLoginPage) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<{ access_token: string }>(
          `${api.defaults.baseURL}/auth/refresh`,
          { refresh_token }
        );
        
        setAuthTokens(data.access_token, refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        clearAuthTokens();
        if (!isLoginPage) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
