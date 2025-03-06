// userAuth.ts
import { API_CONSTANTS } from "../constants/apiConstants";
import { ResponseModel } from "../models/ResponseModel";
import { post, put, del } from "./apiService";
// Interface cho user data
export interface UserData {
  _id: string;
  user_name: string;
  email: string;
  password: string;
  role_code: string;
  is_blocked?: boolean;
  is_verified?: boolean;
  verification_token?: string;
  is_deleted: boolean;
}

interface SearchCondition {
  keyword: string;
  role_code?: string;
  user_id?: string;
  is_blocked?: boolean;
  is_verified?: boolean;
  search_by?: "username" | "email";
}

interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems?: number;
}

interface UserResponse {
  pageData: UserData[];
  pageInfo: PageInfo;
}

// Lấy danh sách người dùng với phân trang và tìm kiếm
export const getUsers = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfo
): Promise<ResponseModel<UserResponse>> => {
  return post(API_CONSTANTS.USERS.SEARCH_USER, {
    searchCondition,
    pageInfo,
  });
};

// Tạo người dùng mới
export const createUser = async (
  userData: Omit<UserData, '_id' | 'is_deleted'>
): Promise<ResponseModel<null>> => {
  return post(API_CONSTANTS.USERS.CREATE_USER, {
    ...userData,
    is_blocked: userData.is_blocked ?? true,
    is_verified: userData.is_verified ?? false,
  });
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  userId: string,
  userData: Partial<UserData>
): Promise<ResponseModel<UserData>> => {
  if (!userId) throw new Error("User ID is required");

  try {
    const updateData = {
      user_id: userId,
      user_name: userData.user_name,
      email: userData.email
    };

    const response = await put<ResponseModel<UserData>>(
      API_CONSTANTS.USERS.UPDATE_USER.replace("${id}", userId),
      updateData
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update user");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update user");
  }
};

// Xóa người dùng
export const deleteUser = async (userId: string): Promise<ResponseModel<null>> => {
  try {
    if (!userId) throw new Error("User ID is required");

    const response = await del<ResponseModel<null>>(
      API_CONSTANTS.USERS.DELETE_USER.replace("${id}", userId)
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete user");
    }

    return {
      success: true,
      message: "User deleted successfully",
      data: null
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete user");
  }
};

// Thay đổi trạng thái khóa/mở khóa người dùng
export const changeUserStatus = async (
  userId: string,
  isLocked: boolean
): Promise<ResponseModel<null>> => {
  return put(API_CONSTANTS.USERS.CHANGE_STATUS, {
    user_id: userId,
    is_blocked: isLocked,
  });
};

// Gửi email xác thực

// // Xác thực token từ email
// export const verifyToken = async (token: string | undefined): Promise<ResponseModel<any>> => {
//   // Gọi API verify token với flag unlock
//   return post(API_CONSTANTS.AUTH.VERIFY_TOKEN, {
//     verification_token: token,
//     unlock: true, // BE sẽ tự động unlock user
//   });
// };

// Add change password function
export const changePassword = async (oldPassword: string, newPassword: string): Promise<ResponseModel<null>> => {
  try {
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error("User information not found");
    }

    const userData = JSON.parse(user);
    const userId = userData._id;

    const response = await put<ResponseModel<null>>(
      API_CONSTANTS.USERS.CHANGE_PASSWORD,
      {
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to change password");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to change password");
  }
};

// Cập nhật role cho user
export const updateUserRole = async (
  userId: string,
  roleCode: string
): Promise<ResponseModel<UserData>> => {
  try {
    if (!userId) throw new Error("User ID is required");

    const response = await put<ResponseModel<UserData>>(
      API_CONSTANTS.USERS.CHANGE_ROLE,
      {
        user_id: userId,
        role_code: roleCode
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update user role");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update user role");
  }
};
