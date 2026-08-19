import { OrderSaveCommand } from "../../domain/model/commands/order-save-command";
import { Order } from "../../domain/model/order";
import { ForHandleOrders } from "../../domain/ports/driven/for-handle-orders";
import { OrderAlreadyPaidException } from "../../domain/error/order-already-paid-exception";
import { OrderNotBelongsUserException } from "../../domain/error/order-not-belongs-user-exception";

export class HandleOrdersUseCase {
  private readonly forHandleOrders: ForHandleOrders;

  constructor(forHandleOrders: ForHandleOrders) {
    this.forHandleOrders = forHandleOrders;
  }

  public getAllOrders(page: number, take: number): Promise<Order[]> {
    return this.forHandleOrders.getAllOrders(page, take);
  }

  public getNumberOfAllOrders(): Promise<number> {
    return this.forHandleOrders.getNumberOfAllOrders();
  }

  public saveOrder(order: OrderSaveCommand): Promise<string> {
    return this.forHandleOrders.saveOrder(order);
  }

  public deleteAllOrders(): Promise<void> {
    return this.forHandleOrders.deleteAllOrders();
  }

  public deleteAllOrderAddress(): Promise<void> {
    return this.forHandleOrders.deleteAllOrderAddress();
  }

  public deleteAllOrderItems(): Promise<void> {
    return this.forHandleOrders.deleteAllOrderItems();
  }

  public getOrdersByUserId(
    userId: string,
    page: number,
    take: number,
  ): Promise<Order[]> {
    return this.forHandleOrders.getOrdersByUserId(userId, page, take);
  }

  public getNumberOfOrdersByUserId(userId: string): Promise<number> {
    return this.forHandleOrders.getNumberOfOrdersByUserId(userId);
  }

  public getPendingOrdersCountByUserId(userId: string): Promise<number> {
    return this.forHandleOrders.getPendingOrdersCountByUserId(userId);
  }

  public getOrderById(orderId: string): Promise<Order> {
    return this.forHandleOrders.getOrderById(orderId);
  }

  public async deleteOrderById(
    orderId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void> {
    const order = await this.forHandleOrders.getOrderById(orderId);
    if (!isAdmin && order.getUserId() !== userId) {
      throw new OrderNotBelongsUserException();
    }
    if (order.getIsPaid()) {
      throw new OrderAlreadyPaidException();
    }
    await this.forHandleOrders.deleteOrderById(orderId);
  }

  public setTransactionId(
    orderId: string,
    transactionId: string,
  ): Promise<void> {
    return this.forHandleOrders.setTransactionId(orderId, transactionId);
  }

  public updatePaymentStatus(orderId: string): Promise<void> {
    return this.forHandleOrders.updatePaymentStatus(orderId);
  }

  public getAllPendingOrdersByUserId(
    userId: string,
    page: number,
    take: number,
  ): Promise<Order[]> {
    return this.forHandleOrders.getAllPendingOrdersByUserId(
      userId,
      page,
      take,
    );
  }

  public getPaidOrdersByUserId(
    userId: string,
    page: number,
    take: number,
  ): Promise<Order[]> {
    return this.forHandleOrders.getPaidOrdersByUserId(userId, page, take);
  }
}
