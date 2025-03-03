import { post } from "./apiService";
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

interface ApprovalSearchResponse {
    pageData: ClaimRequest[];
    pageInfo: PageInfo;
}

export const searchApprovalClaims = async (request: ApprovalSearchRequest): Promise<ResponseModel<ApprovalSearchResponse>> => {
    // const { setLoading } = useLoadingStore.getState();
    // setLoading(true);
    // try {
    const response = await post<ApprovalSearchResponse>(API_CONTANTS.APPROVAL.GET_CLAIM_APPROVAL, request);
    return response;
    // }
    // finally {
    //     setLoading(false);
    // }
};