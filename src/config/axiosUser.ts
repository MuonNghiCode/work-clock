import axios from 'axios';
import { toast } from 'react-toastify';

// Create an instance of axios
const axiosInstances = axios.create({
  baseURL: 'https://management-claim-request.vercel.app/api',
  timeout: 30000, // Tăng timeout lên 30s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstances.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstances.interceptors.response.use(
  (response) => {
    // Nếu có thông báo thành công từ BE, hiển thị toast
    if (response.data?.success && response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const { config, response } = error;
    
    // Hiển thị lỗi từ BE nếu có
    if (response?.data?.message) {
      toast.error(response.data.message);
    }
    
    // Retry nếu lỗi network hoặc timeout
    if (!error.code || (error.code !== 'ECONNABORTED' && !error.message.includes('Network Error'))) {
      console.log('Error Response:', {
        status: response?.status,
        message: response?.data?.message,
        error: response?.data
      });
      return Promise.reject(error);
    }

    // Retry tối đa 3 lần
    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= 3) {
      return Promise.reject(error);
    }

    config.retryCount += 1;
    console.log(`Retrying request (${config.retryCount}/3)...`);

    // Delay trước khi retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    return axiosInstances(config);
  }
);

export default axiosInstances;