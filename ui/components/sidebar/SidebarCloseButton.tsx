"use client";

import { IoCloseOutline } from "react-icons/io5";
import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state";

export const SidebarCloseButton = () => {
  const handleOnClick = () => {
    getHandleSidebarStateUseCase().toggleSidebar();
  };

  return (
    <IoCloseOutline
      size={50}
      className="absolute top-5 right-[max(1.25rem,env(safe-area-inset-right))] cursor-pointer rounded-full p-1 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 active:scale-90"
      onClick={() => handleOnClick()}
    />
  );
};
