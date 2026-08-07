"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state/infrastructure/config/factory/handle-sidebar-state-use-case-factory";
import { Sidebar } from "./Sidebar";

const EXIT_ANIMATION_MS = 320;

export const SidebarWrapper = () => {
  const storeApi = getHandleSidebarStateUseCase();

  const isSidebarOpen = useSyncExternalStore(
    (listener) => storeApi.subscribe(listener),
    () => storeApi.isSidebarOpen(),
    () => false,
  );

  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!isSidebarOpen) {
      if (mounted) {
        setHidden(true);
        const timer = setTimeout(() => setMounted(false), EXIT_ANIMATION_MS);
        return () => clearTimeout(timer);
      }
      return;
    }

    setMounted(true);
    setHidden(true);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setHidden(false));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isSidebarOpen, mounted]);

  if (!mounted) return null;

  return <Sidebar hidden={hidden} />;
};
