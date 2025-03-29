import axiosInstance from "../config/axiosConfig";
import { useLoadingStore } from "../config/zustand";
import { ResponseModel } from "../models/ResponseModel";

export const get = async <T>(url: string, params?: any, loading?: boolean): Promise<ResponseModel<T>> => {
  try {
    useLoadingStore.getState().setIsLoadingFlag(loading ?? true); // Set loading flag
    const response = await axiosInstance.get<ResponseModel<T>>(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const post = async <T>(url: string, data: any, loading?: boolean): Promise<ResponseModel<T>> => {
  try {
    useLoadingStore.getState().setIsLoadingFlag(loading ?? true); // Set loading flag
    const response = await axiosInstance.post<ResponseModel<T>>(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${url}:`, error);
    throw error;
  }
};

export const put = async <T>(url: string, data: any, loading?: boolean): Promise<ResponseModel<T>> => {
  try {
    useLoadingStore.getState().setIsLoadingFlag(loading ?? true); // Set loading flag
    const response = await axiosInstance.put<ResponseModel<T>>(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${url}:`, error);
    throw error;
  }
};

export const del = async <T>(url: string, loading?: boolean): Promise<ResponseModel<T>> => {
  try {
    useLoadingStore.getState().setIsLoadingFlag(loading ?? true); // Set loading flag
    const response = await axiosInstance.delete<ResponseModel<T>>(url);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${url}:`, error);
    throw error;
  }
};
