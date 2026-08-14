import type { ReactNode } from "react";
import AuthHero from "./auth-hero";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 md:grid md:grid-cols-2">
      <AuthHero />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full rounded-2xl bg-white px-8 py-10 shadow-sm ring-1 ring-slate-200 sm:w-[380px]">
          {children}
        </div>
      </div>
    </main>
  );
}
