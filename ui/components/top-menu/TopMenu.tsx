import { titleFont } from "@/config/fonts";
import Link from "next/link";
import { ScrollShadow } from "./ScrollShadow";
import { OpenMenuButton } from "./OpenMenuButton";
import { TopMenuCartCount } from "./TopMenuCartCount";
import { TopMenuSearch } from "./TopMenuSearch";
import { getHandleAuthUseCase } from "../../../modules/auth";
import { TopMenuPendingOrdersBadge } from "./TopMenuPendingOrdersBadge";

const categories = [
  { label: "Todos", href: "/" },
  { label: "Hombres", href: "/category/men" },
  { label: "Mujeres", href: "/category/women" },
  { label: "Niños", href: "/category/kid" },
];

export const TopMenu = async ({
  pendingOrdersCount,
  role,
}: {
  pendingOrdersCount?: number;
  role: string;
}) => {
  const user = await getHandleAuthUseCase().getCurrentUser();

  return (
    <ScrollShadow>
      <nav className="flex flex-wrap md:flex-nowrap justify-between items-center w-full gap-x-2 gap-y-1 min-h-16 py-2 md:py-0 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={"/"}
          className="group flex items-center gap-1.5 sm:gap-2 shrink-0"
        >
          <span
            className={`${titleFont.className} antialiased font-bold text-lg sm:text-xl transition-transform duration-300 ease-out group-hover:-translate-y-0.5`}
          >
            Teslo
          </span>
          <span className="text-lg sm:text-xl font-light text-slate-500 transition-colors group-hover:text-slate-700">
            | Shop
          </span>
        </Link>

        {/* Search, Cart, Menu */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 order-2 md:order-3">
          <TopMenuSearch />
          {user?.getRole() !== "ADMIN" && (
            <TopMenuPendingOrdersBadge
              pendingOrders={pendingOrdersCount ?? 0}
            />
          )}
          {role !== "ADMIN" && <TopMenuCartCount />}
          <span
            className="mx-1 hidden sm:block h-5 w-px bg-slate-200"
            aria-hidden="true"
          />
          <OpenMenuButton />
        </div>

        {/* Center Menu */}
        <div className="no-scrollbar order-3 flex w-full items-center gap-0.5 overflow-x-auto md:order-2 md:w-auto md:flex-1 md:justify-center md:overflow-visible lg:gap-1">
          {categories.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group relative m-1 shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {label}
              <span className="pointer-events-none absolute left-3 right-3 -bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </nav>

      <style>{`
        @keyframes cartPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); }
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </ScrollShadow>
  );
};
