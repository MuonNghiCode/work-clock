import { get, put, post } from './apiService';
import { API_CONTANTS } from '../constants/apiContants';
import { PageInfo, ProjectEditRespone, ProjectSearchResponse, SearchCondition } from '../types/ProjectTypes';
import { ProjectInfo } from '../types/Project';

export const getAllProject = async (
  searchCondition: SearchCondition,
  pageInfo: PageInfo
): Promise<ProjectSearchResponse> => {
  const response = await post(API_CONTANTS.PROJECT.GET_ALLPROJECT, {
    searchCondition,
    pageInfo
  });
  return response as ProjectSearchResponse;
};

export const getInfoProject = async (
  ProjectInfo: ProjectInfo,
  pageInfo: PageInfo
): Promise<ProjectSearchResponse> => {
  const response = await post(API_CONTANTS.PROJECT.GET_ALLPROJECT, {
    ProjectInfo,
    pageInfo
  });
  return response as ProjectSearchResponse;
};

export const getEditProject = async (
  ProjectInfo: ProjectInfo,
  id: string
): Promise<ProjectEditRespone> => {
  const response = await put(API_CONTANTS.PROJECT.UPDATE_PROJECT.replace("${id}", id), ProjectInfo);
  return response as ProjectEditRespone;
};

export const createNewProject = async (
  ProjectInfo: ProjectInfo
): Promise<ProjectSearchResponse> => {
  const response = await post(API_CONTANTS.PROJECT.CREATE_PROJECT, ProjectInfo);
  return response as ProjectSearchResponse;
}