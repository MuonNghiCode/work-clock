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
  }
  
  export interface PageInfo {
    pageNum: number;
    pageSize: number;
    totalItems: number;
  }
  

  export interface ClaimSearchResponse {
    success: boolean;
    data: {
      pageData: ClaimItem[];
      pageInfo: PageInfo;
    };
  }
  
  export interface ClaimDetailResponse {
    success: boolean;
    data: ClaimItem;
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
  }