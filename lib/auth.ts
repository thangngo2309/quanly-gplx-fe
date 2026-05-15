import api from "./axios.config";
import { toast } from 'react-toastify';
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens, isTokenExpired } from "./localstorage";

// Gắn token vào header mỗi request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi 401 để tự động refresh token
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
        const { data } = await api.post<{ access_token: string }>('/auth/refresh', { refresh_token });
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

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { username, password });
  return res.data;
}

export async function refresh(refresh_token: string): Promise<{ access_token: string }> {
  const res = await api.post<{ access_token: string }>('/auth/refresh', { refresh_token });
  return res.data;
}

export async function getProfile(): Promise<{
  user_id: number;
  username: string;
  fullname: string | null;
  role: string;
}> {
  const res = await api.get('/auth/profile');
  return res.data;
}
