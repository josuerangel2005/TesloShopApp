import { SidebarStatePort } from "../../../../domain/ports/for-sidebar-state";
import { sidebarStore } from "./sidebar-store";

export class ZustandSidebarAdapter implements SidebarStatePort {
  private sideStore: typeof sidebarStore;

  constructor(sideStore: typeof sidebarStore) {
    this.sideStore = sideStore;
  }

  public isSidebarOpen(): boolean {
    return this.sideStore.getState().isSidebarOpen;
  }

  public toggleSidebar(): boolean {
    return this.sideStore.getState().toggleSidebar();
  }

  public subscribe(listener: () => void): () => void {
    return this.sideStore.subscribe(listener);
  }
}
