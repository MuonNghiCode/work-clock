import { useUserStore } from "../config/zustand";
import { logoutApi } from "../services/authService";
export const isAuthenticated = (): boolean => {
  const token = useUserStore.getState().user?.token;
  return !!token;
};

export const getRole = (): string | null => {
  const userData = useUserStore.getState().user?.role_code;
  let user = userData ?? null;
  return user;
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
  sessionStorage.setItem("toastMessage", JSON.stringify({
    type: "success",
    message: "Logout Successfully!",
  }));
  logoutApi();
  window.location.href = "/";
};
