// userAuth.ts
import { API_CONTANTS } from "../constants/apiContants";
import { ResponseModel } from "../models/ResponseModel";
import { SearchCondition } from "../types/ProjectTypes";
import { post, put, del } from "./apiService";

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
export const getUsers = async (searchCondition: SearchCondition, pageInfo: any): Promise<ResponseModel<any>> => {
  return post(API_CONTANTS.USERS.SEARCH_USER, {
    searchCondition,
    pageInfo,
  });
};

// Tạo người dùng mới
export const createUser = async (userData: UserData): Promise<ResponseModel<null>> => {
  return post(API_CONTANTS.USERS.CREATE_USER, {
    ...userData,
    is_blocked: userData.is_blocked ?? true,
    is_verified: userData.is_verified ?? false,
  });
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  userId: string,
  userData: Partial<UserData>
): Promise<ResponseModel<any>> => {
  // Kiểm tra userId tồn tại
  if (!userId) {
    throw new Error("User ID is required");
  }

  return put(API_CONTANTS.USERS.UPDATE_USER.replace("${id}", userId), userData);
};

// Xóa người dùng (soft delete)
export const deleteUser = async (userId: string): Promise<ResponseModel<any>> => {
  return del(API_CONTANTS.USERS.DELETE_USER.replace("${id}", userId));
};

// Thay đổi trạng thái khóa/mở khóa người dùng
export const changeUserStatus = async (userId: string, isLocked: boolean): Promise<ResponseModel<any>> => {
  return put(API_CONTANTS.USERS.CHANGE_STATUS, {
    user_id: userId,
    is_blocked: isLocked,
  });
};

// Gửi email xác thực


// // Xác thực token từ email
// export const verifyToken = async (token: string | undefined): Promise<ResponseModel<any>> => {
//   // Gọi API verify token với flag unlock
//   return post(API_CONTANTS.AUTH.VERIFY_TOKEN, {
//     verification_token: token,
//     unlock: true, // BE sẽ tự động unlock user
//   });
// };
