import { API_CONSTANTS } from './../constants/apiConstants';
import { create } from 'zustand';

// import { API_CONTANTS } from '../constants/apiContants';

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isSidebarOpen: false,
  toggleSidebar: () => {
    const { isSidebarOpen } = get();
    set({ isSidebarOpen: !isSidebarOpen });
  },
  closeSidebar: () => set({ isSidebarOpen: false }),
}));


type LoadingState = {
  isLoading: boolean;
  addRequest: (url: string) => void;
  removeRequest: (url: string) => void;
  skipUrls: string[];
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  skipUrls: [`${API_CONSTANTS.EMPLOYEE.GET_ALL_CONTRACT}`, `${API_CONSTANTS.EMPLOYEE.GET_ALL_DEPARTMENT}`, `${API_CONSTANTS.EMPLOYEE.GET_ALL_JOB}, ${API_CONSTANTS.USERS.GET_ALL}`], // Add any API endpoints you want to exclude from loading
  addRequest: (url) =>
    set((state) => {
      if (state.skipUrls.includes(url)) return state;
      return { isLoading: true };
    }),
  removeRequest: (url) =>
    set((state) => {
      if (state.skipUrls.includes(url)) return state;
      return { isLoading: false };
    }),
}));
interface UserState {
  user: {
    token: string | null;
    id: string;
    username: string;
    email: string;
    role_code: string;
    avatarUrl: string;
  } | null;
  setUser: (user: { id: string; email: string; role_code: string; token: string, username: string, avatarUrl: string }) => void;
  clearUser: () => void;
  getToken: () => string | null; // Add this function to get the token
}

export const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
  getToken: () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.token || null;
  },
}));

