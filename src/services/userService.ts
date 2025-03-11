import { put } from "./apiService";

import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";
import axiosInstance from "../config/axiosUser";

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


// Interface for Employee
export interface Employee {
    _id: string;
    user_id: string;
    job_rank: string;
    contract_type: string;
    account: string;
    address: string;
    phone: string;
    full_name: string;
    avatar_url: string;
    department_code: string;
    salary: number;
    start_date: string | null;
    end_date: string | null;
    updated_by: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

// Get employee by UserID
export const getEmployeeByUserId = async (userId: string): Promise<Employee> => {
    try {
        const response = await axiosInstance.get(`/employees/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching employee:", error);
        throw error;
    }
};

// Update employee
export const updateEmployee = async (employeeId: string, employeeData: Partial<Employee>) => {
    try {
        const requestBody: Partial<Employee> = {
            ...employeeData,
            updated_by: JSON.parse(localStorage.getItem("user") || "{}").id
        };

        const response = await axiosInstance.put(`/employees/${employeeId}`, requestBody);
        return response.data;
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
};
