export const API_CONTANTS = {
  AUTH: {
    LOGIN: "/auth",
    LOGOUT: "/auth/logout",
    USER_INFO: "/auth",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_TOKEN: "/auth/verify-token",
  },
  ROLES: {
    GET_ALL: "/roles/get-all",
  },
  PROJECT: {
    CREATE_PROJECT: "/projects",
    GET_ALLPROJECT: "/projects/search",
    UPDATE_PROJECT: "/project/${id}"
  },
  APPROVAL: {
    GET_CLAIM_APPROVAL: "/claims/approval-search",
  },
  CLAIMS: {
    CLAIMS_SEARCH: "/claims/search",
    CLAIMERS_SEARCH: "/claims/claimer-search",
    CLAIM_DETAIL: "/claims",
  },
  USERS: {
    CHANGE_PASSWORD: "/users/change-password",
    GET_ALL: "/users/get-all",
    CREATE_USER: "/users",
    UPDATE_USER: "/users/${id}",
    DELETE_USER: "/users/${id}",
    CHANGE_STATUS: "/users/change-status",
    SEARCH_USER: "/users/search",
  },
};
  
  
  