"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

export const getPendingOrdersCountAction = async (): Promise<number> => {
  try {
    const handleAuthUseCase = getHandleAuthUseCase();
    const session = await handleAuthUseCase.getSession();

    if (!session) return 0;

    const handleOrdersUseCase = getHandleOrdersUseCase();

    return await handleOrdersUseCase.getPendingOrdersCountByUserId(
      session.getId(),
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};