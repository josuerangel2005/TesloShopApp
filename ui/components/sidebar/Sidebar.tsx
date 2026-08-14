import { IoSearchOutline } from "react-icons/io5";
import { SidebarBackdrop } from "./SidebarBackdrop";
import { MenuButtons } from "./MenuBottons";

interface SidebarProps {
  hidden?: boolean;
  isAuthenticated: boolean;
  rol: string;
}

export const Sidebar = ({
  hidden = false,
  isAuthenticated,
  rol,
}: SidebarProps) => {
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

        <MenuButtons isAuthenticated={isAuthenticated} rol={rol} />
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
