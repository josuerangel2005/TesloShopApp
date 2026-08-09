import type { ReactNode } from "react";
import { TopMenu, SidebarWrapper, Footer } from "../../../ui";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col">
      <SidebarWrapper />
      <TopMenu />
      <div className="flex-1 px-0 sm:px-10">{children}</div>
      <Footer />
    </main>
  );
}
