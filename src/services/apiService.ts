import axiosInstance from "../config/axiosConfig";

export const get = async (url: string, params?: any) => {
    try {
        const response = await axiosInstance.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}

export const post = async (url: string, data: any) => {
    try {
        const response = await axiosInstance.post(url, data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}

export const put = async (url: string, data: any) => {
    try {
        const response = await axiosInstance.put(url, data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}

export const del = async (url: string) => {
    try {
        const response = await axiosInstance.delete(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}
    