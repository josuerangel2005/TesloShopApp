import type { ReactNode } from "react";
import { TopMenu, SidebarWrapper } from "../../../ui";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <SidebarWrapper />
      <TopMenu />
      <div className="px-0 sm:px-10">{children}</div>
    </main>
  );
}
