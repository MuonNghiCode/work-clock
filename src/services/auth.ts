export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
  };
  
  export const getRole = (): string | null => {
    return localStorage.getItem("role");
  };
  
  export const checkRole = (role: string): boolean => {
    return getRole() === role;
  };
  
  export const hasAnyRole = (...roles: string[]): boolean => {
    return roles.includes(getRole() || "");
  };
  