import { get, put, post, del } from "./apiService";
import { API_CONSTANTS } from "../constants/apiConstants";
import { ProjectInfo } from "../types/Project";
import { ResponseModel } from "../models/ResponseModel";
import { ProjectSearch } from "../components/UserComponents/ModalAddNewClaim";
export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

export interface SearchConditionProject {
  keyword: string;
  project_start_date: string;
  project_end_date: string;
  user_id: string;
  is_delete: boolean;
}

export interface ProjectSearchRequest {
  searchCondition: SearchConditionProject;
  pageInfo: PageInfo;
}

export const getAllProject = async ({
  searchCondition,
  pageInfo,
}: ProjectSearchRequest): Promise<
  ResponseModel<{ pageData: ProjectInfo[]; pageInfo: PageInfo }>
> => {
  const response = await post(API_CONSTANTS.PROJECT.GET_ALLPROJECT, {
    searchCondition,
    pageInfo,
  });
  return response as ResponseModel<{
    pageData: ProjectInfo[];
    pageInfo: PageInfo;
  }>;
};
export const searchProject = async ({
  searchCondition,
  pageInfo,
}: ProjectSearchRequest): Promise<
  ResponseModel<{ pageData: ProjectSearch[]; pageInfo: PageInfo }>
> => {
  const response = await post(API_CONSTANTS.PROJECT.GET_ALLPROJECT, {
    searchCondition,
    pageInfo,
  });
  return response as ResponseModel<{
    pageData: ProjectSearch[];
    pageInfo: PageInfo;
  }>;
};

export const getInfoProject = async (
  ProjectInfo: ProjectInfo,
  pageInfo: PageInfo
): Promise<ResponseModel<ProjectInfo>> => {
  const response = await post(API_CONSTANTS.PROJECT.GET_ALLPROJECT, {
    ProjectInfo,
    pageInfo,
  });
  return response as ResponseModel<ProjectInfo>;
};

export const getEditProject = async (
  ProjectInfo: ProjectInfo,
  id: string
): Promise<ResponseModel<ProjectInfo>> => {
  const response = await put(
    API_CONSTANTS.PROJECT.UPDATE_PROJECT.replace("${id}", id),
    ProjectInfo
  );
  return response as ResponseModel<ProjectInfo>;
};

export const getAllRoleProject = async (): Promise<
  { name: string; value: string }[]
> => {
  const response = await get(API_CONSTANTS.PROJECT.GET_ALLROLEPROJECT);
  return response.data as { name: string; value: string }[];
};

export const createProject = async (
  project: ProjectInfo
): Promise<ResponseModel<ProjectInfo>> => {
  const response = await post(API_CONSTANTS.PROJECT.CREATE_PROJECT, project);
  return response as ResponseModel<ProjectInfo>;
};

export const getProjectById = async (
  id: string
): Promise<ResponseModel<ProjectInfo>> => {
  const response = await get(
    API_CONSTANTS.PROJECT.GET_PROJECT_BY_ID.replace("${id}", id)
  );
  return response as ResponseModel<ProjectInfo>;
};

export const deleteProject = async (
  id: string
): Promise<ResponseModel<null>> => {
  await del<ResponseModel<null>>(
    API_CONSTANTS.PROJECT.DELETE_PROJECT.replace("${id}", id)
  );
  return {
    success: true,
    message: "Project deleted successfully",
    data: null,
  };
};
