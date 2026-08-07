import type { ReactNode } from "react";
import { Sidebar, TopMenu } from "../../../ui";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <main className=" min-h-screen">
      <Sidebar />
      <TopMenu />
      <div className="px-0 sm:px-10">{children}</div>
    </main>
  );
}
