import { apiService, post } from "./apiService";
import { API_CONTANTS } from "../constants/apiContants";
import { ResponseModel } from "../models/ResponseModel";
import { ClaimRequest } from "../types/ClaimRequest";

interface SearchCondition {
    keyword: string;
    claim_status: string;
    claim_start_date: string;
    claim_end_date: string;
    is_delete: boolean;
}

interface PageInfo {
    pageNum: number;
    pageSize: number;
}

interface ApprovalSearchRequest {
    searchCondition: SearchCondition;
    pageInfo: PageInfo;
}

interface Claim {
    _id: string;
    staff_id: string;
    staff_name: string;
    staff_email: string;
    staff_role: string | null;
    role_in_project: string;
    claim_name: string;
    claim_start_date: string;
    claim_end_date: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

interface ApprovalSearchResponse {
    pageData: ClaimRequest[];
    pageInfo: PageInfo;
}

export const searchApprovalClaims = async (request: ApprovalSearchRequest): Promise<ApprovalSearchResponse> => {
    const response = await apiService.post<ResponseModel<ApprovalSearchResponse>>(API_CONTANTS.APPROVAL.GET_CLAIM_APPROVAL, request);
    return response.data;
};