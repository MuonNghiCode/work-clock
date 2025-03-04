import {get, put, post} from './apiService'
import { API_CONTANTS } from '../constants/apiContants'
import { PageInfo, ProjectSearchResponse, SearchCondition } from '../types/ProjectTypes'

export const getAllProject = async (
    searchCondition: SearchCondition,
    pageInfo: PageInfo
):Promise <ProjectSearchResponse> => {
    const response = await post (API_CONTANTS.PROJECT.GET_ALLPROJECT, {
        searchCondition, 
        pageInfo
    });
    return response as ProjectSearchResponse;
}

