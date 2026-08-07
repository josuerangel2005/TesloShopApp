import { create } from "zustand";

type Store = {
  isSidebarOpen: boolean;
  toggleSidebar: () => boolean;
};

export const sidebarStore = create<Store>()((set, get) => ({
  isSidebarOpen: false,
  toggleSidebar: () => {
    const newState = !get().isSidebarOpen;
    set({
      isSidebarOpen: newState,
    });
    return newState;
  },
}));
