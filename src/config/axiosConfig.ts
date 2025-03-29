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
    const { isLoadingFlag, setLoading } = useLoadingStore.getState();

    // Ensure isLoadingFlag is defined
    if (isLoadingFlag === undefined) {
      console.error("isLoadingFlag is undefined. Initializing to false.");
      useLoadingStore.getState().setIsLoadingFlag(false);
    }

    // Always set loading to true when a request starts
    if (isLoadingFlag && config.showLoading !== false) {
      setLoading(true);
    }

    // Attach token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    const { isLoadingFlag, setLoading } = useLoadingStore.getState();
    if (isLoadingFlag) {
      setLoading(false);
    }
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const { isLoadingFlag, setLoading } = useLoadingStore.getState();
    if (isLoadingFlag) {
      setLoading(false);
    }

    // Only show error toast if there are errors and response is not successful
    if (response.data.errors && !response.data.success) {
      toast.error(response.data.errors[0].message);
    }
    return response;
  },
  (error) => {
    const { isLoadingFlag, setLoading } = useLoadingStore.getState();
    if (isLoadingFlag) {
      setLoading(false);
    }

    // Handle error response
    if (error.response) {
      // Don't show error toast for 400 status - let the component handle it
      if (error.response.status !== 400) {
        if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.response.data?.errors) {
          error.response.data.errors.forEach((err: any) => {
            toast.error(err.message);
          });
        } else {
          toast.error("An error occurred");
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error("No response from server");
    } else {
      // Something else happened
      toast.error("An error occurred");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
