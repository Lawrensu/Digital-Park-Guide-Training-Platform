import axios from 'axios';

/**
 * API Client - Centralized Axios instance for all backend communication.
 * Handles:
 * 1. Base URL configuration
 * 2. Authorization headers (Bearer tokens)
 * 3. 401 Unauthorized interceptors for token refresh
 */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for refresh token cookies
});

// Request Interceptor: Attach access token from memory
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, retrieve the token from your AuthContext/Store
    const token = window.sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops and only handle 401s on non-login requests
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = res.data;

        // Store new token in memory
        window.sessionStorage.setItem('access_token', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear memory and redirect to login
        window.sessionStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
