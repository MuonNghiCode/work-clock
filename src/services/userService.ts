import { Contract } from './../pages/EditProfilePage/EditProfilePage';
import { get, put } from "./apiService";

import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";
import { EmployeeInfo, JobRank } from "../types/Employee";
import { Department } from "../pages/EditProfilePage/EditProfilePage";

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


// Hàm lấy tất cả departments
export const getAllDepartments = async (loading?: boolean): Promise<ResponseModel<Department[]>> => {
    const response = await get(API_CONSTANTS.EMPLOYEE.GET_ALL_DEPARTMENT, "", loading);
    if (response && response.data) {
        return response as ResponseModel<Department[]>;
    } else {
        throw new Error("Failed to fetch departments");
    }
};

// Hàm lấy tất cả contracts
export const getAllContracts = async (loading?: boolean): Promise<ResponseModel<Contract[]>> => {
    const response = await get(API_CONSTANTS.EMPLOYEE.GET_ALL_CONTRACT, "", loading);
    if (response && response.data) {
        return response as ResponseModel<Contract[]>;
    } else {
        throw new Error("Failed to fetch contracts");
    }
};
export const getAllJobs = async (loading?: boolean): Promise<ResponseModel<JobRank[]>> => {
    const response = await get(API_CONSTANTS.EMPLOYEE.GET_ALL_JOB, "", loading);
    return response as ResponseModel<JobRank[]>;
};
// Hàm lấy employee theo userId
export const getEmployeeByUserId = async (userId: string, loading?: boolean): Promise<ResponseModel<EmployeeInfo>> => {
    const response = await get<EmployeeInfo>(`${API_CONSTANTS.EMPLOYEE.GET_EMPLOYEE_BY_USER_ID.replace("${id}", userId)}`, "", loading);
    if (response && response.data) {
        return response as ResponseModel<EmployeeInfo>;
    } else {
        throw new Error("Failed to fetch employee data");
    }
};

// Hàm cập nhật employee
export const updateEmployee = async (id: string, data: EmployeeInfo): Promise<ResponseModel<EmployeeInfo>> => {
    const response = await put(API_CONSTANTS.EMPLOYEE.UPDATE_EMPLOYEE.replace("${id}", id), data);
    return response as ResponseModel<EmployeeInfo>;
}
