import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'https://management-claim-request.vercel.app/api/', 
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
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

// // Add a response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Do something with response data
//     return response;
//   },
//   (error) => {
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;