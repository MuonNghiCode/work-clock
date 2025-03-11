import { get, put } from "./apiService";

import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";
import axiosInstance from "../config/axiosUser";
import { EmployeeInfo } from "../types/Employee";

interface ChangePassword {
    old_password: string;
    new_password: string;
}
export const changePassword = async (old_password: string, new_password: string): Promise<ResponseModel<ChangePassword>> => {
    const response = await put<ChangePassword>(API_CONSTANTS.USERS.CHANGE_PASSWORD, { old_password, new_password });

    if (response.success) {
        localStorage.setItem("lastChangedPassword", JSON.stringify({ old_password, new_password }));
    }

    return response;
};


// export interface Employee {
//   _id: string;
//   user_id: string;
//   job_rank: string;
//   contract_type: string;
//   account: string;
//   address: string;
//   phone: string;
//   full_name: string;
//   avatar_url: string;
//   department_code: string;
//   salary: number;
//   start_date: string | null;
//   end_date: string | null;
//   updated_by: string;
//   created_at: string;
//   updated_at: string;
//   is_deleted: boolean;
// }

// Hàm lấy tất cả jobs
export const getAllJobs = async () => {
  try {
    const response = await get(API_CONSTANTS.EMPLOYEE.GET_ALL_JOB, null);
    
    if (response.data && response.success && Array.isArray(response.data)) {
      // Remove duplicates using Set
      const uniqueJobs = Array.from(new Set(response.data.map(job => job.job_rank)))
        .map(job_rank => ({
          job_rank,
          // Add any other properties you need
        }));

      return { 
        success: true, 
        data: uniqueJobs 
      };
    }
    
    return { 
      success: false, 
      message: "Invalid jobs data format",
      data: [] 
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { 
      success: false, 
      message: "Failed to fetch jobs",
      data: [] 
    };
  }
};

// Hàm lấy tất cả departments
export const getAllDepartments = async () => {
  try {
    const response = await axiosInstance.get(API_CONSTANTS.EMPLOYEE.GET_ALL_DEPARTMENT);
    console.log('Departments API response:', response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return { success: true, data: response.data.data };
    }
    
    return { 
      success: false, 
      message: "Invalid departments data format",
      data: [] 
    };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return { 
      success: false, 
      message: "Failed to fetch departments",
      data: [] 
    };
  }
};

// Hàm lấy tất cả contracts
export const getAllContracts = async () => {
  try {
    const response = await axiosInstance.get(API_CONSTANTS.EMPLOYEE.GET_ALL_CONTRACT);
    console.log('Contracts API response:', response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return { success: true, data: response.data.data };
    }
    
    return { 
      success: false, 
      message: "Invalid contracts data format",
      data: [] 
    };
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return { 
      success: false, 
      message: "Failed to fetch contracts",
      data: [] 
    };
  }
};

// Hàm lấy employee theo userId
export const getEmployeeByUserId = async (userId: string) => {
  try {
    console.log("Fetching employee for userId:", userId);
    const url = API_CONSTANTS.EMPLOYEE.GET_EMPLOYEE_BY_USER_ID.replace(
      "${id}",
      userId
    );
    console.log("API URL:", url);
    
    const response = await axiosInstance.get(url);
    
    // Kiểm tra response có phải là HTML không
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error("Received HTML instead of JSON data");
      return { 
        success: false, 
        message: "Invalid API response format",
        data: null
      };
    }
    
    console.log("Employee API response:", response.data);
    
    // Nếu response.data đã có cấu trúc {success, data} thì trả về đúng dữ liệu
    if (response.data && response.data.success && response.data.data) {
      return response.data;
    }
    
    // Nếu không, bọc dữ liệu vào cấu trúc chuẩn
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching employee:", error);
    return { 
      success: false, 
      message: "Failed to fetch employee",
      data: null
    };
  }
};

// Hàm cập nhật employee
export const updateEmployee = async ( id: string, data: EmployeeInfo): Promise<ResponseModel<EmployeeInfo>> => {
    // Format the data according to API requirements
    // if(data){
    //     const formattedData = {
    //   _id: data._id, // Include _id in request body
    //   user_id: data.user_id,
    //   full_name: data.full_name || '',
    //   phone: data.phone || '',
    //   address: data.address || '',
    //   job_rank: data.job_rank || '',
    //   department_code: data.department_code || '',
    //   contract_type: data.contract_type || '',
    //   salary: Number(data.salary) || 0,
    //   start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
    //   end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
    //   updated_by: JSON.parse(localStorage.getItem('user') || '{}')._id || '',
    //   account: data.account || ''
    // };
    const response = await put(API_CONSTANTS.EMPLOYEE.UPDATE_EMPLOYEE.replace("${id}", id), data);
    return response as ResponseModel<EmployeeInfo>;
}
