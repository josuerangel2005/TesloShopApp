import type { ReactNode } from "react";
import { Sidebar, TopMenu } from "../../../ui";
import { SidebarWrapper } from "../../../ui/components/sidebar/SidebarWrapper";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <SidebarWrapper />
      <TopMenu />
      <div className="px-0 sm:px-10">{children}</div>
    </main>
  );
}
