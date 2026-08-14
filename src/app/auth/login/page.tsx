import type { Metadata } from "next";
import Link from "next/link";
import { titleFont } from "@/config/fonts";
import { LoginForm } from "../../../../ui";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Ingresa a tu cuenta para continuar tus compras.",
};

const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function () {
  return (
    <div className="auth-card flex w-full flex-col">
      <div className="mb-8 text-center">
        <p
          className={`${titleFont.className} text-3xl font-bold text-slate-800`}
        >
          Teslo
          <span className="text-primary"> | Shop</span>
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      <LoginForm fieldClass={fieldClass} />

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
