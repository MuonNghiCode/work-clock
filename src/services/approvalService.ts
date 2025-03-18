import { post } from "./apiService";
import { API_CONSTANTS } from "../constants/apiConstants";
import { ResponseModel } from "../models/ResponseModel";
import { ClaimInfo } from "../types/ClaimType";
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
    totalPage?: number;
    totalItems?: number;
}

interface ApprovalSearchRequest {
    searchCondition: SearchCondition;
    pageInfo: PageInfo;
}

interface ApprovalSearchResponse {
    pageData: ClaimInfo[];
    pageInfo: PageInfo;
}

export const searchApprovalClaims = async (request: ApprovalSearchRequest): Promise<ResponseModel<ApprovalSearchResponse>> => {
    const response = await post<ApprovalSearchResponse>(API_CONSTANTS.APPROVAL.GET_CLAIM_APPROVAL, request);
    return response;
};