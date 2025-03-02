import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "../config/axiosConfig";
import { ResponseModel } from "../models/ResponseModel";

export const get = async <T>(url: string, params?: any): Promise<ResponseModel<T>> => {
  try {
    const response = await axiosInstance.get<ResponseModel<T>>(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const post = async <T>(url: string, data: any): Promise<ResponseModel<T>> => {
  try {
    const response = await axiosInstance.post<ResponseModel<T>>(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const put = async <T>(url: string, data: any): Promise<ResponseModel<T>> => {
  try {
    const response = await axiosInstance.put<ResponseModel<T>>(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const del = async <T>(url: string): Promise<ResponseModel<T>> => {
  try {
    const response = await axiosInstance.delete<ResponseModel<T>>(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
