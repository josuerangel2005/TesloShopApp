import { OrderAddressSaveCommand } from "./order-address-save-command";
import { OrderItemSaveCommand } from "./order-item-save-command";

export class OrderSaveCommand {
  private userId: string;
  private orderItems: OrderItemSaveCommand[];
  private orderAddress: OrderAddressSaveCommand;

  constructor(
    userId: string,
    orderItems: OrderItemSaveCommand[],
    orderAddress: OrderAddressSaveCommand,
  ) {
    this.userId = userId;
    this.orderItems = orderItems;
    this.orderAddress = orderAddress;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getOrderItems(): OrderItemSaveCommand[] {
    return this.orderItems;
  }

  public getOrderAddress(): OrderAddressSaveCommand {
    return this.orderAddress;
  }
}