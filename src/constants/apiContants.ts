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
  APPROVAL: {
    GET_CLAIM_APPROVAL: "/claims/approval-search",
  },
  USER : {
    CREATE_USER: "/users",
    UPDATE_USER: "/users/{id}",
    CHANGE_STATUS_USER: "/users/change-status",
  }
};
