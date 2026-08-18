"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleOrdersUseCase } from "../../../../modules/orders/infrastructure/config/factory/handle-orders-use-case-factory";
import { OrderNotBelongsUserException } from "../../../../modules/orders/domain/error/order-not-belongs-user-exception";
import { Order } from "../interfaces/order";
import { orderToOrder } from "../mapper/order.mapper";

export const getOrderByIdAction = async (orderId: string): Promise<Order> => {
  try {
    const handleAuth = getHandleAuthUseCase();
    const session = await handleAuth.getSession();

    if (!session) throw new OrderNotBelongsUserException();

    const handleOrders = getHandleOrdersUseCase();
    const order = await handleOrders.getOrderById(orderId);

    const currentUser = await handleAuth.getCurrentUser();
    const isAdmin = currentUser?.getRole().toString() === "ADMIN";

    if (!isAdmin && order.getUserId() !== session.getId())
      throw new OrderNotBelongsUserException();

    return orderToOrder(order);
  } catch (error) {
    console.log(orderId);
    throw error;
  }
};
