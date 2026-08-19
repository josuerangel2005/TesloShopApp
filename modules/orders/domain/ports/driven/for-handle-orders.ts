import { OrderSaveCommand } from "../../model/commands/order-save-command";
import { Order } from "../../model/order";

export interface ForHandleOrders {
  getAllOrders: (page: number, take: number) => Promise<Order[]>;
  getNumberOfAllOrders: () => Promise<number>;
  saveOrder: (order: OrderSaveCommand) => Promise<string>;
  deleteAllOrders: () => Promise<void>;
  deleteAllOrderAddress: () => Promise<void>;
  deleteAllOrderItems: () => Promise<void>;
  getOrdersByUserId: (
    userId: string,
    page: number,
    take: number,
  ) => Promise<Order[]>;
  getNumberOfOrdersByUserId: (userId: string) => Promise<number>;
  getPendingOrdersCountByUserId: (userId: string) => Promise<number>;
  getOrderById: (orderId: string) => Promise<Order>;
  deleteOrderById: (orderId: string) => Promise<void>;
  setTransactionId: (orderId: string, transactionId: string) => Promise<void>;
  updatePaymentStatus: (orderId: string) => Promise<void>;
  getAllPendingOrdersByUserId: (
    userId: string,
    page: number,
    take: number,
  ) => Promise<Order[]>;
  getPaidOrdersByUserId: (
    userId: string,
    page: number,
    take: number,
  ) => Promise<Order[]>;
}
