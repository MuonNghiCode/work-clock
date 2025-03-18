export const API_CONSTANTS = {
  AUTH: {
    LOGIN: "/auth",
    LOGOUT: "/auth/logout",
    USER_INFO: "/auth",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_TOKEN: "/auth/verify-token",
    RESEND_TOKEN: "/auth/resend-token",

  },
  ROLES: {
    GET_ALL: "/roles/get-all",
  },
  PROJECT: {
    CREATE_PROJECT: "/projects",
    GET_ALLPROJECT: "/projects/search",
    UPDATE_PROJECT: "/projects/${id}",
    GET_ALLROLEPROJECT: "/projects/roles",
    GET_PROJECT_BY_ID: "/projects/${id}",
    DELETE_PROJECT: "/projects/${id}"
  },
  APPROVAL: {
    GET_CLAIM_APPROVAL: "/claims/approval-search",
  },
  FINANCE: {
    FINANCE_SEARCH: "/claims/finance-search",
  },
  CLAIMS: {
    CLAIMS_SEARCH: "/claims/search",
    CLAIMERS_SEARCH: "/claims/claimer-search",
    CLAIM_DETAIL: "/claims",
    GET_BY_ID: "/claims",
    UPDATE_CLAIM: "/claims",
    UPDATE_STATUS: "/claims/change-status",
    CLAIM_LOG: "/claim-logs/search",
  },
  USERS: {
    CHANGE_PASSWORD: "/users/change-password",
    GET_ALL: "/users/get-all",
    CREATE_USER: "/users",
    UPDATE_USER: "/users/${id}",
    DELETE_USER: "/users/${id}",
    GET_USER_BY_ID: "/users/${id}",
    CHANGE_STATUS: "/users/change-status",
    SEARCH_USER: "/users/search",
    CHANGE_ROLE: "/users/change-role",
  },
  EMPLOYEE: {
    GET_EMPLOYEE_BY_USER_ID: "/employees/${id}",
    UPDATE_EMPLOYEE: "/employees/${id}",
    CREATE_EMPLOYEE: "/employees",
    GET_ALL_JOB: "/jobs/get-all",
    GET_ALL_DEPARTMENT: "/departments/get-all",
    GET_ALL_CONTRACT: "/contracts/get-all",
  },
};
