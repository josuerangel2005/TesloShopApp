"use server";

import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

export const getTotalCountOrdersActions = async (): Promise<number> => {
  const ordersHandler = getHandleOrdersUseCase();
  try {
    return await ordersHandler.getNumberOfAllOrders();
  } catch (error) {
    throw error;
  }
};
