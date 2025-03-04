import { post, get } from "./apiService";
import { API_CONTANTS } from "../constants/apiContants";
import { SearchCondition, PageInfoRequest, ClaimItem, PageInfo } from "../types/ClaimType";
import { ResponseModel } from "../models/ResponseModel";

export const getClaimerSearch = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfoRequest
): Promise<ResponseModel<{ pageData: ClaimItem[], pageInfo: PageInfo }>> => {
  const response = await post<{ pageData: ClaimItem[], pageInfo: PageInfo }>(API_CONTANTS.CLAIMS.CLAIMER_SEARCH, { 
    searchCondition, 
    pageInfo 
  });
  return response;
};

export const getClaimDetail = async (id: string): Promise<ResponseModel<ClaimItem>> => {
  const response = await get<ClaimItem>(`${API_CONTANTS.CLAIMS.CLAIM_DETAIL}/${id}`); 
  return response;
};