"use client";

import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state";

export const SidebarBackdrop = ({ hidden = false }: { hidden?: boolean }) => {
  const handleClose = () => {
    getHandleSidebarStateUseCase().toggleSidebar();
  };

  return (
    <>
      {/* Background Black */}
      <div
        onClick={handleClose}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-60 bg-black transition-opacity duration-300 ease-out cursor-pointer ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-30"
        }`}
      />

      {/* Blur */}
      <div
        onClick={handleClose}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-60 backdrop-filter backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
    </>
  );
};