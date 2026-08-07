import {
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShareOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { SidebarCloseButton } from "./SidebarCloseButton";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div>
      {/* Background Black */}
      <div className="fixed top-0 w-screen h-screen z-60 bg-black opacity-30 animate-[fadeIn_0.25s_ease-out]" />

      {/* Blur */}
      <div className="fade-in fixed top-0 left-0 w-screen h-screen z-60 backdrop-filter backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]" />

      {/* sideMenu */}
      <nav className="fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-60 shadow-2xl transform transition-all duration-300 animate-[slideIn_0.3s_ease-out]">
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
          <span className="ml-3 text-xl">Perfil</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoTicketOutline size={30} />
          <span className="ml-3 text-xl">Órdenes</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogInOutline size={30} />
          <span className="ml-3 text-xl">Ingresar</span>
        </Link>

        <Link
          href={"/"}
          className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogOutOutline size={30} />
          <span className="ml-3 text-xl">Salir</span>
        </Link>

        {/* Line Separator */}
        <div className="w-full h-px bg-gray-200 my-10">
          <Link
            href={"/"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoShareOutline size={30} />
            <span className="ml-3 text-xl">Products</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Órdenes</span>
          </Link>

          <Link
            href={"/"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPeopleOutline size={30} />
            <span className="ml-3 text-xl">Usuarios</span>
          </Link>
        </div>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          nav, div[class*="animate-"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
