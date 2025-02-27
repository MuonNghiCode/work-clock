import { get, post, put } from "./apiService";

import { ResponseModel } from "../models/ResponseModel";
import { API_CONTANTS } from "../constants/apiContants";

interface AuthResponse {
  token: string;
}

interface UserInfo {
  id: string;
  email: string;
  role_code: string;
}

interface Role {
  id: string;
  name: string;
}

export const login = async (email: string, password: string): Promise<ResponseModel<AuthResponse>> => {
  const response = await post<AuthResponse>(API_CONTANTS.AUTH.LOGIN, { email, password });
  if (response.success) {
    localStorage.setItem("token", response.data.token);
  }
  return response;
};

export const getUserInfobyToken = async (): Promise<ResponseModel<UserInfo>> => {
  const response = await get<UserInfo>(API_CONTANTS.AUTH.USER_INFO);
  if (response.success) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

export const getAllRoles = async (keyword?: string): Promise<ResponseModel<Role[]>> => {
  const response = await get<Role[]>(API_CONTANTS.ROLES.GET_ALL, { keyword });
  return response;
};

export const logoutApi = async (): Promise<void> => {
  await post(API_CONTANTS.AUTH.LOGOUT, {});
};

export const forgotPassword = async (email: string): Promise<ResponseModel<null>> => {
  return await put<null>(API_CONTANTS.AUTH.FORGOT_PASSWORD, { email });
};
