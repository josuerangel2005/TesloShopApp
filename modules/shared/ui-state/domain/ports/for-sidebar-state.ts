export interface SidebarStatePort {
  isSidebarOpen: () => boolean;
  toggleSidebar: () => boolean;
  subscribe: (listener: () => void) => () => void;
}
