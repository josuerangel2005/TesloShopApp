import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full rounded-2xl bg-white px-8 py-10 shadow-sm ring-1 ring-slate-200 sm:w-[380px]">
        {children}
      </div>
    </main>
  );
}