// userAuth.ts
import axiosInstance from "../config/axiosUser"; // Giả sử file axiosInstance.ts nằm cùng thư mục
import { API_CONTANTS } from "../constants/apiContants";
import { ResponseModel } from "../models/ResponseModel";
import { post } from "./apiService";

// Interface cho user data
interface UserData {
  user_name: string;
  email: string;
  password: string;
  role_code: string;
  is_blocked?: boolean;
  is_verified?: boolean;
  verification_token?: string;
}

// Lấy danh sách người dùng với phân trang và tìm kiếm
export const getUsers = async (searchCondition: any, pageInfo: any) => {
  try {
    const response = await axiosInstance.post("/users/search", {
      searchCondition,
      pageInfo,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user list:", error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (userData: UserData):Promise<ResponseModel<null>> => {
    const response = await post(API_CONTANTS.USER.CREATE_USER, {
      ...userData,
      is_blocked: userData.is_blocked ?? true,
      is_verified: userData.is_verified ?? false,
    });
    return response as ResponseModel<null>;
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  userId: string,
  userData: Partial<UserData>
) => {
  try {
    // Kiểm tra userId tồn tại
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Error Updating User:", error);
    throw error.response?.data || error;
  }
};

// Xóa người dùng (soft delete)
export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.put(`users/${userId}/delete`, {
      is_deleted: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error while deleting user:", error);
    throw error;
  }
};

// Thay đổi trạng thái khóa/mở khóa người dùng
export const changeUserStatus = async (userId: string, isLocked: boolean) => {
  try {
    const response = await axiosInstance.put("/users/change-status", {
      user_id: userId,
      is_blocked: isLocked,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing user status:", error);
    throw error;
  }
};

// Gửi email xác thực
export const triggerVerifyToken = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/trigger-verify-token", {
      email,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    throw error.response?.data || error;
  }
};

// // Xác thực token từ email
// export const verifyToken = async (token: string | undefined) => {
//   try {
//     // Gọi API verify token với flag unlock
//     const response = await axiosInstance.post("/auth/verify-token", {
//       verification_token: token,
//       unlock: true, // BE sẽ tự động unlock user
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error("Error while authenticating token:", error);
//     throw error.response?.data || error;
//   }
// };
