import { get, post, put } from "./apiService";
import { ResponseModel } from "../models/ResponseModel";
import { API_CONTANTS } from "../constants/apiContants";
import { ApprovalInfo } from "../types/Approval";
import { EmployeeInfo } from "../types/Employee";
import { ProjectInfo } from "../types/Project";
import { SearchCondition, PageInfoRequest, ClaimItem, PageInfo } from "../types/ClaimType";


interface ClaimInfo {
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


interface ClaimsResponse {
  pageData: ClaimInfo[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface ClaimsRequest {
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

// Hàm để gọi API lấy dữ liệu yêu cầu
export const getClaimsData = async (request: ClaimsRequest): Promise<ResponseModel<ClaimsResponse>> => {
  const response = await post<ClaimsResponse>(API_CONTANTS.CLAIMS.CLAIMS_SEARCH, request);
  return response;
}

export const getUserClaimsData = async (request: ClaimsRequest): Promise<ResponseModel<ClaimsResponse>> => {
  const response = await post<ClaimsResponse>(API_CONTANTS.CLAIMS.CLAIMERS_SEARCH, request);
  return response;
}

export const getClaimerSearch = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfoRequest
): Promise<ResponseModel<{ pageData: ClaimItem[], pageInfo: PageInfo }>> => {
  const response = await post<{ pageData: ClaimItem[], pageInfo: PageInfo }>(API_CONTANTS.CLAIMS.CLAIMERS_SEARCH, { 
    searchCondition, 
    pageInfo 
  });
  return response;
};

export const getClaimDetail = async (id: string): Promise<ResponseModel<ClaimItem>> => {
  const response = await get<ClaimItem>(`${API_CONTANTS.CLAIMS.GET_BY_ID}/${id}`); 
  return response;
};

export const updateClaim = async (id: string, data: Partial<ClaimItem>): Promise<ResponseModel<ClaimItem>> => {
  const response = await put<ClaimItem>(`${API_CONTANTS.CLAIMS.UPDATE_CLAIM}/${id}`, data);
  return response;
};