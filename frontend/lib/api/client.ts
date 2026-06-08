import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach access token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kloset_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('kloset_refresh_token');

      const hasAccessToken = typeof window !== 'undefined' && !!localStorage.getItem('kloset_access_token');

      if (!refreshToken) {
        // No refresh token — force logout
        localStorage.removeItem('kloset_access_token');
        localStorage.removeItem('kloset_refresh_token');
        localStorage.removeItem('kloset_user');
        localStorage.removeItem('kloset-auth');
        if (typeof window !== 'undefined') {
          document.cookie = 'kloset-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          const pathname = window.location.pathname;
          const protectedPaths = ['/renter', '/seller', '/admin', '/booking', '/outfit/new'];
          const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
          if (isProtected) {
            window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
          } else if (hasAccessToken) {
            window.location.reload();
          }
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = data.data.access_token;
        const newRefreshToken = data.data.refresh_token;

        localStorage.setItem('kloset_access_token', newAccessToken);
        localStorage.setItem('kloset_refresh_token', newRefreshToken);
        localStorage.setItem('kloset_user', JSON.stringify(data.data.user));

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        localStorage.removeItem('kloset_access_token');
        localStorage.removeItem('kloset_refresh_token');
        localStorage.removeItem('kloset_user');
        localStorage.removeItem('kloset-auth');
        if (typeof window !== 'undefined') {
          document.cookie = 'kloset-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          const pathname = window.location.pathname;
          const protectedPaths = ['/renter', '/seller', '/admin', '/booking', '/outfit/new'];
          const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
          if (isProtected) {
            window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
          } else if (hasAccessToken) {
            window.location.reload();
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
