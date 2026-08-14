"use client";

import { useSyncExternalStore } from "react";
import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state";
import { Sidebar } from "./Sidebar";

interface Props {
  isAuthenticated: boolean;
  rol: string;
}

export const SidebarWrapper = ({ isAuthenticated, rol }: Props) => {
  const storeApi = getHandleSidebarStateUseCase();

  const isSidebarOpen = useSyncExternalStore(
    (listener) => storeApi.subscribe(listener),
    () => storeApi.isSidebarOpen(),
    () => false,
  );

  return (
    <Sidebar
      hidden={!isSidebarOpen}
      isAuthenticated={isAuthenticated}
      rol={rol}
    />
  );
};
