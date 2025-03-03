import { post, get } from "./apiService";
import { API_CONTANTS } from "../constants/apiContants";
import { ClaimSearchResponse, ClaimDetailResponse, SearchCondition, PageInfoRequest } from "../types/ClaimType";

export const getClaimerSearch = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfoRequest
): Promise<ClaimSearchResponse> => {
  const response = await post(API_CONTANTS.CLAIMS.CLAIMER_SEARCH, { 
    searchCondition, 
    pageInfo 
  });
  return response as ClaimSearchResponse;
};


export const getClaimDetail = async (id: string): Promise<ClaimDetailResponse> => {
  const response = await get(`${API_CONTANTS.CLAIMS.CLAIM_DETAIL}/${id}`); 
  return response as ClaimDetailResponse;
};