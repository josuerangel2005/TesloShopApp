import type { Metadata } from "next";
import Link from "next/link";
import { titleFont } from "@/config/fonts";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta y empieza a comprar en la tienda.",
};

const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function () {
  return (
    <div className="auth-card flex w-full flex-col pt-10">
      <div className="mb-8 text-center">
        <p
          className={`${titleFont.className} text-3xl font-bold text-slate-800`}
        >
          Teslo
          <span className="text-primary"> | Shop</span>
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Crea tu cuenta y empieza a comprar
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-name"
            className="text-sm font-medium text-slate-700"
          >
            Nombre Completo
          </label>
          <input
            id="signup-name"
            type="text"
            placeholder="Juan Pérez"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-slate-700"
          >
            Correo electrónico
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="tu@correo.com"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-password"
            className="text-sm font-medium text-slate-700"
          >
            Contraseña
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            className={fieldClass}
          />
        </div>

        <button className="btn-primary mt-2 w-full justify-center text-center">
          Crear Cuenta
        </button>

        {/* Divisor */}
        <div className="my-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-wider text-slate-400">
            O
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Link
          href="/auth/login"
          className="btn-secondary w-full justify-center text-center"
        >
          Iniciar Sesión
        </Link>
      </div>

      <style>{`
        .auth-card {
          animation: authFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-card { animation: none; }
        }
      `}</style>
    </div>
  );
}
