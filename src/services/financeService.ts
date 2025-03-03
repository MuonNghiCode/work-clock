import { post } from "./apiService";
import { ResponseModel } from "../models/ResponseModel";
import { API_CONTANTS } from "../constants/apiContants";

interface EmployeeInfo {
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

interface ApprovalInfo {
  _id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  is_blocked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectInfo {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_members: {
    user_id: string;
    project_role: string;
    _id: string;
  }[];
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  updated_by: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface FinanceData {
  _id: string;
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_role: string | null;
  employee_info: EmployeeInfo;
  approval_info: ApprovalInfo;
  project_info: ProjectInfo;
  role_in_project: string | null;
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  claim_status: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface FinanceResponse {
  pageData: FinanceData[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface FinanceRequest {
  searchCondition: {
    keyword: string;
    claim_status: string;
    claim_start_date: string;
    claim_end_date: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export const getFinanceData = async (request: FinanceRequest): Promise<ResponseModel<FinanceResponse>> => {
  const response = await post<FinanceResponse>(API_CONTANTS.FINANCE.FINANCE_SEARCH, request);
  return response;
}