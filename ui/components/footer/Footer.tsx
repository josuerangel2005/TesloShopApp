import Link from "next/link";
import { titleFont } from "@/config/fonts";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
        <Link href={"/"} className="flex items-baseline gap-1.5 group">
          <span
            className={`${titleFont.className} antialiased text-base font-bold text-slate-800 transition-colors group-hover:text-primary`}
          >
            Teslo
          </span>
          <span className="text-xs font-medium text-slate-400">| Shop</span>
          <span className="text-xs text-slate-400">
            © {new Date().getFullYear()}
          </span>
        </Link>

        <nav
          aria-label="Legal"
          className="flex items-center gap-6 text-sm text-slate-500"
        >
          <Link
            href={"/politicas"}
            className="transition-colors hover:text-primary"
          >
            Privacidad
          </Link>
          <Link
            href={"/terminos"}
            className="transition-colors hover:text-primary"
          >
            Términos y Condiciones
          </Link>
        </nav>
      </div>
    </footer>
  );
};