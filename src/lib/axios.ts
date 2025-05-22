import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://backend-practice.eurisko.me/api',
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && // or 403 if your API uses that for expired tokens
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If refresh is in progress, queue requests
        return new Promise(function (resolve, reject) {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(
          'https://backend-practice.eurisko.me/api/auth/refresh-token',
          {refreshToken},
        );

        const newAccessToken = response.data.data.accessToken;
        await AsyncStorage.setItem('accessToken', newAccessToken);

        API.defaults.headers.common['Authorization'] =
          'Bearer ' + newAccessToken;
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;

        processQueue(null, newAccessToken);

        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Optionally logout user here if refresh token fails
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // you might want to update your AuthContext state here
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
