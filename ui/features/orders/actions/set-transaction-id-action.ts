"use server";

import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";

export const setTransactionIdAction = async (
  orderId: string,
  transactionId: string,
): Promise<void> => {
  try {
    const handleOrdersUseCase = getHandleOrdersUseCase();

    await handleOrdersUseCase.setTransactionId(orderId, transactionId);
  } catch (error) {
    throw error;
  }
};
