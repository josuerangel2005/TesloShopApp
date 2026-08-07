"use client";

import { IoMenuOutline } from "react-icons/io5";
import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state/infrastructure/config/factory/handle-sidebar-state-use-case-factory";

export const OpenMenuButton = () => {
  return (
    <button
      className=" cursor-pointer p-2 rounded-md text-slate-600 transition-all duration-200 hover:bg-gray-100 hover:text-slate-900 active:scale-90"
      aria-label="Abrir menú"
      onClick={() => getHandleSidebarStateUseCase().toggleSidebar()}
    >
      <IoMenuOutline className="w-5 h-5" />
    </button>
  );
};
