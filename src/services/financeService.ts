import { post } from "./apiService";
import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";
import { ApprovalInfo } from "../types/Approval";
import { EmployeeInfo } from "../types/Employee";
import { ProjectInfo } from "../types/Project";


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
  const response = await post<FinanceResponse>(API_CONSTANTS.FINANCE.FINANCE_SEARCH, request);
  return response;
}
