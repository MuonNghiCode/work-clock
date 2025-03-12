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
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export const login = async (email: string, password: string): Promise<ResponseModel<AuthResponse>> => {
  const response = await post<AuthResponse>(API_CONSTANTS.AUTH.LOGIN, { email, password });
  if (response.success) {
    const token = response.data.token;
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);
    if (decoded && decoded.id) {
      localStorage.setItem("userId", decoded.id);
    } else {
      console.error("User ID not found in token payload.");
    }
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