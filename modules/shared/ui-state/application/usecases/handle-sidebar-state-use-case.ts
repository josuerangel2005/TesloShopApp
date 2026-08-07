import { SidebarStatePort } from "../../domain/ports/for-sidebar-state";

export class HandleSidebarStateUseCase {
  private readonly sidebarStatePort: SidebarStatePort;

  constructor(sidebarStatePort: SidebarStatePort) {
    this.sidebarStatePort = sidebarStatePort;
  }

  public isSidebarOpen(): boolean {
    return this.sidebarStatePort.isSidebarOpen();
  }

  public toggleSidebar(): boolean {
    return this.sidebarStatePort.toggleSidebar();
  }

  public subscribe(listener: () => void): () => void {
    return this.sidebarStatePort.subscribe(listener);
  }
}
