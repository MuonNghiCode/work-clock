import { logoutApi } from "../services/authService";
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
  };
  
  export const getRole = (): string | null => {
    let user = localStorage.getItem("user");
    let parseUser = JSON.parse(user || "{}");
    return parseUser.role_code;
  };
  
  export const checkRole = (role: string): boolean => {
    return getRole() === role;
  };
  
  export const hasAnyRole = (...roles: string[]): boolean => {
    return roles.includes(getRole() || "");
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // sessionStorage.setItem("toastMessage", JSON.stringify({
    //   type: "success",
    //   message: "Logout Successfully!",
    // }));
    logoutApi();
    window.location.href = "/";
  };
  