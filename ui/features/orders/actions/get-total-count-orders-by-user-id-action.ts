"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

export const getTotalCountOrdersByUserIdAction = async (): Promise<number> => {
  const ordersHandler = getHandleOrdersUseCase();
  const handleAuthUseCase = getHandleAuthUseCase();
  try {
    const session = await handleAuthUseCase.getSession();
    if (!session) return 0;
    return await ordersHandler.getNumberOfOrdersByUserId(session.getId());
  } catch (error) {
    throw error;
  }
};
