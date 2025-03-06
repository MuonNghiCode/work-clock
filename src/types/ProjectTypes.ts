export interface ProjectMember {
    project_role: string;
    user_id: string;
    employee_id: string;
    user_name: string;
    full_name: string;
  }
  
  export interface ProjectItem {
    _id: string;
    project_name: string;
    project_code: string;
    project_department: string;
    project_description: string;
    project_status: string;
    project_start_date: string;
    project_end_date: string;
    updated_by: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    project_comment?: string | null;
    project_members: ProjectMember[];
  }
  
  export interface PageInfo {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
  
  export interface ProjectSearchResponse {
    success: boolean;
    data: {
      pageData: ProjectItem[];
      pageInfo: PageInfo;
    };
  }
  
  export interface ProjectDetailResponse {
    success: boolean;
    data: ProjectItem;
  }
  
  export interface SearchCondition {
    keyword: string;
    project_start_date: string;
    project_end_date: string;
    user_id: string;
    is_delete: boolean;
  }
  
  export interface PageInfoRequest {
    pageNum: number;
    pageSize: number;
  }
  
  export interface ProjectSearchRequest {
    searchCondition: SearchCondition;
    pageInfo: PageInfoRequest;
  }

  export interface ProjectEditRespone {
    success: boolean;
    data: ProjectItem;
  }


  