import { create } from 'zustand';
import { API_CONTANTS } from '../constants/apiContants';

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
  skipUrls: [`${API_CONTANTS.ROLES.GET_ALL}`], // Add any API endpoints you want to exclude from loading
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
