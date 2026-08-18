import type { Metadata } from "next";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { Title } from "../../../../ui";
import { getAllOrders } from "../../../../ui/features/orders/actions/get-all-orders";
import { OrdersTable } from "../../../../ui/features/orders/components/OrdersTable";
import { getUserOrdersAction } from "../../../../ui/features/orders/actions/get-user-orders-action";

export const metadata: Metadata = {
  title: "Mis órdenes",
  description: "Consulta el historial de tus órdenes de compra.",
};

export default async function () {
  const user = await getHandleAuthUseCase().getCurrentUser();
  const isAdmin = user?.getRole() === "ADMIN";

  const orders = isAdmin ? await getAllOrders() : await getUserOrdersAction();
  return (
    <div className="mb-20 flex flex-col items-center px-4 sm:px-0">
      <div className="flex w-full max-w-[900px] flex-col">
        <Title title="Mis Órdenes" subTitle="Historial de tus compras" />
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
