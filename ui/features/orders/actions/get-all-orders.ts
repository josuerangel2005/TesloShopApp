import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { OrdersResponse } from "../interfaces/orders-response";

export const getAllOrders = async (): Promise<OrdersResponse[]> => {
  try {
    const ordersHandler = getHandleOrdersUseCase();

    return (await ordersHandler.getAllOrders()).map((order) => ({
      id: order.getId(),
      name: `${order.getOrderAddress()?.getFirstName()} ${order.getOrderAddress()?.getLastName()}`,
      paid: order.getIsPaid(),
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
