import axios, { InternalAxiosRequestConfig } from "axios";
import { useLoadingStore } from "./zustand"; // Adjust path
import { toast } from "react-toastify";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean; // Allow requests to override loading behavior
}

const axiosInstance = axios.create({
  baseURL: "https://management-claim-request.vercel.app/api/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig) => {
    const { addRequest, skipUrls } = useLoadingStore.getState();

    // If showLoading is explicitly false, don't show loading
    if (config.showLoading !== false && !skipUrls.includes(config.url ?? "")) {
      addRequest(config.url ?? "");
    }

    // Attach token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().removeRequest(error.config?.url || "");
    return Promise.reject(
      new Error(error.response?.data?.message || "An error occurred")
    );
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().removeRequest(response.config.url ?? "");
    return response;
  },

  (error) => {
    useLoadingStore.getState().removeRequest(error.config?.url || "");
    toast.error(error.response?.data?.message || "An error occurred");
    return Promise.reject(
      new Error(error.response?.data?.message || "An error occurred")
    );
  }
);

export default axiosInstance;
