import { create } from 'zustand';

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
