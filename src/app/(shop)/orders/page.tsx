import type { Metadata } from "next";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { Title } from "../../../../ui";
import { getAllOrders } from "../../../../ui/features/orders/actions/get-all-orders";
import { OrdersTable } from "../../../../ui/features/orders/components/OrdersTable";
import { getTotalCountOrdersActions } from "../../../../ui/features/orders/actions/get-total-count-orders-action";
import { getPendingOrdersCountAction } from "../../../../ui/features/orders/actions/get-pending-orders-count-action";
import { getAllPendingOrdersByUserIdAction } from "../../../../ui/features/orders/actions/get-all-pending-orders-by-user-id-action";

export const metadata: Metadata = {
  title: "Mis órdenes",
  description: "Consulta el historial de tus órdenes de compra.",
};

interface Props {
  searchParams: Promise<{ page: string }>;
}

export default async function ({ searchParams }: Props) {
  const page = +(await searchParams).page;

  const user = await getHandleAuthUseCase().getCurrentUser();
  const isAdmin = user?.getRole() === "ADMIN";

  const orders = isAdmin
    ? await getAllOrders({ page })
    : await getAllPendingOrdersByUserIdAction({ page });

  const totalOrders = isAdmin
    ? await getTotalCountOrdersActions()
    : await getPendingOrdersCountAction();
  return (
    <div className="mb-20 flex flex-col items-center px-4 sm:px-0">
      <div className="flex w-full max-w-[900px] flex-col">
        <Title title="Mis Órdenes" subTitle="Historial de tus compras" />
        <OrdersTable orders={orders} totalOrders={totalOrders} />
      </div>
    </div>
  );
}
