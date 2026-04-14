import axios from "axios";
import { getToken, getRefreshToken, storeToken, storeRefreshToken, clearAuthStorage } from "../utils/LocalStorge";

const Instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Flag to prevent multiple concurrent refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach the current access token
Instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and automatic token refresh
Instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and the specific code is TOKEN_EXPIRED
    // Ensure we don't end up in an infinite loop if the refresh itself fails
    if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.code === "TOKEN_EXPIRED") {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return Instance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Must use a raw axios call to avoid interceptor loops
        const { data } = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/v1/user/refresh-token`, {
          refreshToken
        });

        await storeToken(data.token);
        await storeRefreshToken(data.refreshToken);

        Instance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        
        processQueue(null, data.token);
        
        return Instance(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        // Force logout if refresh fails
        await clearAuthStorage();
        // Zustand store cannot be directly updated from here without circular import, 
        // rely on next app reload or AppState check to clear UI state
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default Instance;
