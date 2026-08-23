import type { ReactNode } from "react";
import { TopMenu, SidebarWrapper, Footer } from "../../../ui";
import { getHandleAuthUseCase } from "../../../modules/auth";
import { getPendingOrdersCountAction } from "../../../ui/features/orders/actions/get-pending-orders-count-action";

export default async function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getHandleAuthUseCase().getSession();
  const isAuthenticated = !!session;

  const userRol =
    (await getHandleAuthUseCase().getCurrentUser())?.getRole() ?? "USER";

  const pendingOrdersCount = await getPendingOrdersCountAction();

  return (
    <main className="flex min-h-screen flex-col">
      <SidebarWrapper isAuthenticated={isAuthenticated} rol={userRol} />
      <TopMenu role={userRol} pendingOrdersCount={pendingOrdersCount} />
      <div className="flex-1 px-0 sm:px-10">{children}</div>
      <Footer />
    </main>
  );
}
