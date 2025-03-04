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
