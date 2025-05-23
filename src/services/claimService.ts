import { get, post, put } from "./apiService";
import { ResponseModel } from "../models/ResponseModel";
import { API_CONSTANTS } from "../constants/apiConstants";
import {
  ClaimInfo,
  ClaimItem,
  ClaimsRequest,
  ClaimsResponse,
  PageInfoRequest,
  SearchCondition,
  ClaimLogResponse,
} from "../types/ClaimType";
import { ClaimRequestDataField } from "../components/UserComponents/ModalAddNewClaim";

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

interface UpdateClaimStatusPayload {
  _id: string;
  claim_status: string;
  comment: string;
}
export interface ClaimSearchRequest {
  searchCondition: SearchConditionClaim;
  pageInfo: PageInfo;
}

export interface SearchConditionClaim {
  keyword: string;
  claim_status: string;
  project_start_date: string;
  project_end_date: string;
  is_delete: boolean;
}

// Hàm để gọi API lấy dữ liệu yêu cầu
export const getClaimsData = async (
  request: ClaimsRequest
): Promise<ResponseModel<ClaimsResponse>> => {
  const response = await post<ClaimsResponse>(
    API_CONSTANTS.CLAIMS.CLAIMS_SEARCH,
    request
  );
  return response;
};

export const getUserClaimsData = async (
  request: ClaimsRequest
): Promise<ResponseModel<ClaimsResponse>> => {
  const response = await post<ClaimsResponse>(
    API_CONSTANTS.CLAIMS.CLAIMERS_SEARCH,
    request
  );
  return response;
};

export const getClaimerSearch = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfoRequest
): Promise<
  ResponseModel<{ pageData: ClaimItem[]; pageInfo: PageInfoRequest }>
> => {
  const response = await post<{
    pageData: ClaimItem[];
    pageInfo: PageInfoRequest;
  }>(API_CONSTANTS.CLAIMS.CLAIMERS_SEARCH, {
    searchCondition,
    pageInfo,
  });
  return response;
};

export const getAllClaims = async ({
  searchCondition,
  pageInfo,
}: ClaimSearchRequest, loading: boolean): Promise<
  ResponseModel<{ pageData: ClaimInfo[]; pageInfo: PageInfo }>
> => {

  const filteredSearchCondition = {
    ...searchCondition,
    claim_status: searchCondition.claim_status || "",
  };

  const response = await post(API_CONSTANTS.CLAIMS.CLAIMS_SEARCH, {
    searchCondition: filteredSearchCondition,
    pageInfo,
  }, loading);
  return response as ResponseModel<{
    pageData: ClaimInfo[];
    pageInfo: PageInfo;
  }>;
};

export const getClaimDetail = async (
  id: string
): Promise<ResponseModel<ClaimItem>> => {
  const response = await get<ClaimItem>(
    `${API_CONSTANTS.CLAIMS.GET_BY_ID}/${id}`
  );
  return response;
};

export const updateClaim = async (
  id: string,
  data: Partial<ClaimItem>,
  loading?: boolean
): Promise<ResponseModel<ClaimItem>> => {
  const response = await put<ClaimItem>(
    `${API_CONSTANTS.CLAIMS.UPDATE_CLAIM}/${id}`,
    data, loading
  );
  return response;
};

export const updateClaimStatus = async (
  payload: UpdateClaimStatusPayload,
  loading?: boolean
): Promise<ResponseModel<null>> => {
  const response = await put<null>(API_CONSTANTS.CLAIMS.UPDATE_STATUS, payload, loading);
  return response;
};

export const createClaimRequest = async (
  data: ClaimRequestDataField
): Promise<ResponseModel<ClaimItem>> => {
  const response = await post<ClaimItem>(
    API_CONSTANTS.CLAIMS.CLAIM_DETAIL,
    data
  );
  return response;
};

export const getClaimLog = async (
  claimId: string,
  pageInfo: PageInfo
): Promise<ResponseModel<ClaimLogResponse>> => {
  const response = await post<ClaimLogResponse>(
    API_CONSTANTS.CLAIMS.CLAIM_LOG,
    {
      searchCondition: {
        claim_id: claimId,
        is_deleted: false
      },
      pageInfo
    }
  );
  return response;
};
