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
      <nav className="flex flex-col px-4 sm:px-6 lg:px-8 gap-2 w-full min-h-16">
        {/* Top row: Logo + Actions */}
        <div className="flex flex-row items-center justify-between w-full min-h-16 gap-2">
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
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
        </div>

        {/* Bottom row: Categories */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 md:overflow-visible md:gap-0.5 lg:gap-1 whitespace-nowrap">
          {categories.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group relative m-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0"
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
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </ScrollShadow>
  );
};
