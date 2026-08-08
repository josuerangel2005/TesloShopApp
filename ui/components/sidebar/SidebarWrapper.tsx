"use client";

import { useSyncExternalStore } from "react";
import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state";
import { Sidebar } from "./Sidebar";

export const SidebarWrapper = () => {
  const storeApi = getHandleSidebarStateUseCase();

  const isSidebarOpen = useSyncExternalStore(
    (listener) => storeApi.subscribe(listener),
    () => storeApi.isSidebarOpen(),
    () => false,
  );

  return <Sidebar hidden={!isSidebarOpen} />;
};
