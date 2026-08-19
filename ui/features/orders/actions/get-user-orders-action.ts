"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { OrdersResponse } from "../interfaces/orders-response";

interface Params {
  page: number;
  take?: number;
}

export const getUserOrdersAction = async (
  { page = 1, take = 6 }: Params = {} as Params,
): Promise<OrdersResponse[]> => {
  try {
    if (!page || page < 1) page = 1;
    if (!take || take < 0) take = 6;
    const handleAuthUseCase = getHandleAuthUseCase();
    const session = await handleAuthUseCase.getSession();

    if (!session) return [];

    const handleOrdersUseCase = getHandleOrdersUseCase();

    return (
      await handleOrdersUseCase.getOrdersByUserId(session.getId(), page, take)
    ).map((order) => ({
      id: order.getId(),
      name: `${order.getOrderAddress()?.getFirstName()} ${order.getOrderAddress()?.getLastName()}`,
      paid: order.getIsPaid(),
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
