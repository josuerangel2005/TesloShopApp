"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { OrdersResponse } from "../interfaces/orders-response";

export const getUserOrdersAction = async (): Promise<OrdersResponse[]> => {
  try {
    const handleAuthUseCase = getHandleAuthUseCase();
    const session = await handleAuthUseCase.getSession();

    if (!session) return [];

    const handleOrdersUseCase = getHandleOrdersUseCase();

    return (await handleOrdersUseCase.getOrdersByUserId(session.getId())).map(
      (order) => ({
        id: order.getId(),
        name: `${order.getOrderAddress()?.getFirstName()} ${order.getOrderAddress()?.getLastName()}`,
        paid: order.getIsPaid(),
      }),
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};