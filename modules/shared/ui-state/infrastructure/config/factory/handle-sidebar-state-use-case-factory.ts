import { HandleSidebarStateUseCase } from "../../../application/usecases/handle-sidebar-state-use-case";
import { sidebarStore } from "../../adapters/out/SidebarState/sidebar-store";
import { ZustandSidebarAdapter } from "../../adapters/out/SidebarState/zustand-sidebar-adapter";

const zustandSidebarAdapter = new ZustandSidebarAdapter(sidebarStore);

export const getHandleSidebarStateUseCase = () =>
  new HandleSidebarStateUseCase(zustandSidebarAdapter);
