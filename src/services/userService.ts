import { put } from "./apiService";

import { ResponseModel } from "../models/ResponseModel";
import { API_CONTANTS } from "../constants/apiContants";
import axiosInstance from "../config/axiosUser";

interface ChangePassword {
    old_password: string;
    new_password: string;
}
export const changePassword = async (old_password: string, new_password: string): Promise<ResponseModel<ChangePassword>> => {
    const response = await put<ChangePassword>(API_CONTANTS.USERS.CHANGE_PASSWORD, { old_password, new_password });

    if (response.success) {
        localStorage.setItem("lastChangedPassword", JSON.stringify({ old_password, new_password }));
    }

    return response;
};


// Interface for Employee
interface Employee {
    _id: string;
    user_id: string;
    job_rank: string;
    contract_type: string;
    account: string;
    address: string;
    phone: string;
    full_name: string;
    avatar_url: string;
    department_name: string;
    salary: number;
    start_date: string;
    end_date: string | null;
    updated_by: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

// Get employee by UserID
export const getEmployeeByUserId = async (
    userId: string
): Promise<Employee> => {
    const response = await axiosInstance.get(`/employees/${userId}`);
    return response.data.data;
};

// Update employee
export const updateEmployee = async (
    employeeId: string,
    employeeData: Partial<Employee>
) => {
    try {
        const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");

        // Only include fields that have changed and are not null/undefined
        const requestBody: Partial<Employee> = {};

        // Add fields only if they exist in employeeData
        if (employeeData.full_name) requestBody.full_name = employeeData.full_name;
        if (employeeData.job_rank) requestBody.job_rank = employeeData.job_rank;
        if (employeeData.contract_type)
            requestBody.contract_type = employeeData.contract_type;
        if (employeeData.address) requestBody.address = employeeData.address;
        if (employeeData.phone) requestBody.phone = employeeData.phone;
        if (employeeData.avatar_url)
            requestBody.avatar_url = employeeData.avatar_url;
        if (employeeData.department_name)
            requestBody.department_name = employeeData.department_name;
        if (typeof employeeData.salary === "number")
            requestBody.salary = employeeData.salary;

        // Format dates if present
        if (employeeData.start_date) {
            requestBody.start_date = new Date(employeeData.start_date)
                .toISOString()
                .split("T")[0];
        }

        if (employeeData.end_date) {
            requestBody.end_date = new Date(employeeData.end_date)
                .toISOString()
                .split("T")[0];
        }

        // Add required fields
        requestBody.user_id = employeeData.user_id;
        requestBody.updated_by = currentAdmin._id;

        // Use the correct endpoint with employeeId
        const response = await axiosInstance.put(
            `/employees/${employeeId}`,
            requestBody
        );
        return response.data;
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
};

