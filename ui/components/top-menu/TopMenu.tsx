import { titleFont } from "@/config/fonts";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { ScrollShadow } from "./ScrollShadow";
import { OpenMenuButton } from "./OpenMenuButton";
import { TopMenuCartCount } from "./TopMenuCartCount";

const categories = [
  { label: "Todos", href: "/" },
  { label: "Hombres", href: "/category/men" },
  { label: "Mujeres", href: "/category/women" },
  { label: "Niños", href: "/category/kid" },
];

export const TopMenu = () => {
  return (
    <ScrollShadow>
      <nav className="flex px-5 sm:px-8 justify-between items-center w-full min-h-16">
        {/* Logo */}
        <Link href={"/"} className="group flex items-center gap-2">
          <span
            className={`${titleFont.className} antialiased font-bold text-xl transition-transform duration-300 ease-out group-hover:-translate-y-0.5`}
          >
            Teslo
          </span>
          <span className="text-xl font-light transition-colors group-hover:text-slate-700">
            | Shop
          </span>
        </Link>

        {/* Center Menu */}
        <div className="hidden sm:flex items-center gap-1">
          {categories.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group relative m-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {label}
              <span className="pointer-events-none absolute left-3 right-3 -bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        {/* Search, Cart, Menu */}
        <div className="flex items-center gap-1">
          <Link
            href={"/search"}
            aria-label="Buscar"
            className="p-2 rounded-md text-slate-600 transition-all duration-200 hover:bg-gray-100 hover:text-slate-900 active:scale-90"
          >
            <IoSearchOutline className="w-5 h-5" />
          </Link>

          <TopMenuCartCount />

          <OpenMenuButton />
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
