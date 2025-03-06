import { ApprovalInfo } from "../types/Approval";
import { EmployeeInfo } from "../types/Employee";
import { ProjectInfo } from "../types/Project";
export interface ClaimItem {
  _id: string;
  project_info: {
    project_name: string;
  };
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time?: number;
  claim_status: string;
  project_id: string;
  approval_id: string;
}
export interface SearchCondition {
  keyword: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  is_delete: boolean;
}
export interface PageInfoRequest {
  pageNum: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

export interface ClaimInfo {
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


export interface ClaimsResponse {
  pageData: ClaimInfo[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ClaimsRequest {
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

