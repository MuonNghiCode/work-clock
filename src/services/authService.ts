import { get, post, put } from "./apiService";
import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";

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
  const response = await post<AuthResponse>(API_CONSTANTS.AUTH.LOGIN, { email, password });
  if (response.success) {
    localStorage.setItem("token", response.data.token);
  }
  console.log(response.data.token);
  return response;
};

export const getUserInfobyToken = async (): Promise<ResponseModel<UserInfo>> => {
  const response = await get<UserInfo>(API_CONSTANTS.AUTH.USER_INFO);
  if (response.success) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

export const getAllRoles = async (keyword?: string): Promise<ResponseModel<Role[]>> => {
  const response = await get<Role[]>(API_CONSTANTS.ROLES.GET_ALL, { keyword });
  return response;
};

export const logoutApi = async (): Promise<void> => {
  await post(API_CONSTANTS.AUTH.LOGOUT, {});
};

export const forgotPassword = async (email: string): Promise<ResponseModel<null>> => {
  return await put<null>(API_CONSTANTS.AUTH.FORGOT_PASSWORD, { email });
};

export const verifyToken = async (token: string): Promise<ResponseModel<null>> => {
  return await post<null>(API_CONSTANTS.AUTH.VERIFY_TOKEN, { token });
};
export const triggerVerifyToken = async (email: string): Promise<ResponseModel<any>> => {
  return post(API_CONSTANTS.AUTH.VERIFY_TOKEN, {
    email,
  });
};
export const resendToken = async (email: string): Promise<ResponseModel<any>> => {
  return post(API_CONSTANTS.AUTH.RESEND_TOKEN, {
    email,
  });
}