import api from "./axios.config";
import { getAccessToken } from "../utils/localstorage";

// Gắn token vào header mỗi request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
