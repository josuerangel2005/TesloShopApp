"use client";

import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShareOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { getHandleSidebarStateUseCase } from "../../../modules/shared/ui-state";
import Link from "next/link";
import { logout } from "../../features/login/actions/logout-action";

interface Props {
  isAuthenticated: boolean;
  rol: string;
}

export const MenuButtons = ({ isAuthenticated, rol }: Props) => {
  const handleOnClick = () => {
    getHandleSidebarStateUseCase().toggleSidebar();
  };

  const isAdmin = rol === "ADMIN";

  return (
    <>
      <IoCloseOutline
        size={50}
        className="absolute top-5 right-[max(1.25rem,env(safe-area-inset-right))] cursor-pointer rounded-full p-1 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 active:scale-90"
        onClick={() => handleOnClick()}
      />
      <Link
        href={"/profile"}
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        onClick={() => handleOnClick()}
      >
        <IoPersonOutline size={30} />
        <span className="ml-5 text-xl">Perfil</span>
      </Link>
      <Link
        href={"/"}
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"

        onClick={() => handleOnClick()}
      >
        <IoTicketOutline size={30} />
        <span className="ml-5 text-xl">Órdenes</span>
      </Link>
      {isAuthenticated ? (
        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"

          onClick={() => {
            handleOnClick();
            logout();
          }}
        >
          <IoLogOutOutline size={30} />
          <span className="ml-5 text-xl">Salir</span>
        </Link>
      ) : (
        <Link
          href={"/auth/login"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"

          onClick={() => handleOnClick()}
        >
          <IoLogInOutline size={30} />
          <span className="ml-5 text-xl">Ingresar</span>
        </Link>
      )}
      {isAdmin && (
        <>
          <div className="w-full h-px bg-gray-200 my-10" />
          <Link
            href={"/"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"

            onClick={() => handleOnClick()}
          >
            <IoShareOutline size={30} />
            <span className="ml-5 text-xl">Products</span>
          </Link>
          <Link
            href={"/"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"

            onClick={() => handleOnClick()}
          >
            <IoTicketOutline size={30} />
            <span className="ml-5 text-xl">Órdenes</span>
          </Link>
          <Link
            href={"/"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"

            onClick={() => handleOnClick()}
          >
            <IoPeopleOutline size={30} />
            <span className="ml-5 text-xl">Usuarios</span>
          </Link>{" "}
        </>
      )}
    </>
  );
};
