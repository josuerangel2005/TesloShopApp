"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { OrdersResponse } from "../interfaces/orders-response";

interface Params {
  page?: number;
  take?: number;
}

export const getAllPendingOrdersByUserIdAction = async ({
  page = 1,
  take = 6,
}: Params = {}): Promise<OrdersResponse[]> => {
  const ordersHandler = getHandleOrdersUseCase();

  if (!page || page < 1) page = 1;
  if (!take || take < 0) take = 6;

  try {
    const session = await getHandleAuthUseCase().getSession();

    const orders = await ordersHandler.getAllPendingOrdersByUserId(
      session?.getId() ?? "",
      page,
      take,
    );

    return orders.map((order) => ({
      id: order.getId(),
      name: `${order.getOrderAddress()?.getFirstName()} ${order.getOrderAddress()?.getLastName()}`,
      paid: order.getIsPaid(),
    }));
  } catch (error) {
    throw error;
  }
};
