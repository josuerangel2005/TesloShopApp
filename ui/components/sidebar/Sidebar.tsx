import {
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShareOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { SidebarBackdrop } from "./SidebarBackdrop";
import { SidebarCloseButton } from "./SidebarCloseButton";
import Link from "next/link";

interface SidebarProps {
  hidden?: boolean;
}

export const Sidebar = ({ hidden = false }: SidebarProps) => {
  return (
    <div inert={hidden} aria-hidden={hidden}>
      <SidebarBackdrop hidden={hidden} />

      {/* sideMenu */}
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Menú lateral"
        className={`fixed right-0 top-0 z-60 h-dvh w-full max-w-[500px] overflow-y-auto bg-white p-5 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out sm:w-[500px] ${
          hidden ? "translate-x-full pointer-events-none" : "translate-x-0"
        }`}
      >
        <SidebarCloseButton />

        {/* Input */}
        <div className="relative mt-14 flex items-center">
          <IoSearchOutline
            size={20}
            className="absolute top-2 left-2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 transition-colors focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Menu */}
        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoPersonOutline size={30} />
          <span className="ml-5 text-xl">Perfil</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoTicketOutline size={30} />
          <span className="ml-5 text-xl">Órdenes</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogInOutline size={30} />
          <span className="ml-5 text-xl">Ingresar</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogOutOutline size={30} />
          <span className="ml-5 text-xl">Salir</span>
        </Link>

        {/* Line Separator */}
        <div className="w-full h-px bg-gray-200 my-10" />
        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoShareOutline size={30} />
          <span className="ml-5 text-xl">Products</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoTicketOutline size={30} />
          <span className="ml-5 text-xl">Órdenes</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoPeopleOutline size={30} />
          <span className="ml-5 text-xl">Usuarios</span>
        </Link>
      </nav>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          nav, div[class*="fixed"] {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};