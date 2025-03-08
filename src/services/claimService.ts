import { get, post, put } from "./apiService";
import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";
import { ClaimItem, ClaimsRequest, ClaimsResponse, PageInfoRequest, SearchCondition } from "../types/ClaimType";


interface UpdateClaimStatusPayload {
  _id: string;
  claim_status: string;
  comment: string;
}

// Hàm để gọi API lấy dữ liệu yêu cầu
export const getClaimsData = async (request: ClaimsRequest): Promise<ResponseModel<ClaimsResponse>> => {
  const response = await post<ClaimsResponse>(API_CONSTANTS.CLAIMS.CLAIMS_SEARCH, request);
  return response;
}

export const getUserClaimsData = async (request: ClaimsRequest): Promise<ResponseModel<ClaimsResponse>> => {
  const response = await post<ClaimsResponse>(API_CONSTANTS.CLAIMS.CLAIMERS_SEARCH, request);
  return response;
}

export const getClaimerSearch = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfoRequest
): Promise<ResponseModel<{ pageData: ClaimItem[], pageInfo: PageInfoRequest }>> => {
  const response = await post<{ pageData: ClaimItem[], pageInfo: PageInfoRequest }>(API_CONSTANTS.CLAIMS.CLAIMERS_SEARCH, {
    searchCondition,
    pageInfo
  });
  return response;
};

export const getClaimDetail = async (id: string): Promise<ResponseModel<ClaimItem>> => {
  const response = await get<ClaimItem>(`${API_CONSTANTS.CLAIMS.GET_BY_ID}/${id}`); 
  return response;
};

export const updateClaim = async (id: string, data: Partial<ClaimItem>): Promise<ResponseModel<ClaimItem>> => {
  const response = await put<ClaimItem>(`${API_CONSTANTS.CLAIMS.UPDATE_CLAIM}/${id}`, data);
  return response;
};

export const updateClaimStatus = async (payload: UpdateClaimStatusPayload): Promise<ResponseModel<null>> => {
  const response = await put<null>(API_CONSTANTS.CLAIMS.UPDATE_STATUS, payload);
  return response;
};
