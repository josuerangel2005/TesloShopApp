import { OrderAddressSaveCommand } from "./order-address-save-command";
import { OrderItemSaveCommand } from "./order-item-save-command";

export class OrderSaveCommand {
  private subTotal: number;
  private tax: number;
  private total: number;
  private itemsInOrder: number;
  private isPaid: boolean;
  private paidAt: Date | null;
  private userId: string;
  private orderItems: OrderItemSaveCommand[];
  private orderAddress: OrderAddressSaveCommand | null;

  constructor(
    subTotal: number,
    tax: number,
    total: number,
    itemsInOrder: number,
    isPaid: boolean,
    paidAt: Date | null,
    userId: string,
    orderItems: OrderItemSaveCommand[],
    orderAddress: OrderAddressSaveCommand | null,
  ) {
    this.subTotal = subTotal;
    this.tax = tax;
    this.total = total;
    this.itemsInOrder = itemsInOrder;
    this.isPaid = isPaid;
    this.paidAt = paidAt;
    this.userId = userId;
    this.orderItems = orderItems;
    this.orderAddress = orderAddress;
  }

  public getSubTotal(): number {
    return this.subTotal;
  }

  public getTax(): number {
    return this.tax;
  }

  public getTotal(): number {
    return this.total;
  }

  public getItemsInOrder(): number {
    return this.itemsInOrder;
  }

  public getIsPaid(): boolean {
    return this.isPaid;
  }

  public getPaidAt(): Date | null {
    return this.paidAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getOrderItems(): OrderItemSaveCommand[] {
    return this.orderItems;
  }

  public getOrderAddress(): OrderAddressSaveCommand | null {
    return this.orderAddress;
  }
}