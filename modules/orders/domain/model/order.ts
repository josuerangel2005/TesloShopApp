import { OrderAddress } from "./order-address";
import { OrderItem } from "./order-item";

export class Order {
  private readonly id: string;
  private subTotal: number;
  private tax: number;
  private total: number;
  private itemsInOrder: number;
  private isPaid: boolean;
  private paidAt: Date | null;
  private createdAt: Date;
  private updatedAt: Date;
  private userId: string;
  private orderItems: OrderItem[];
  private orderAddress: OrderAddress | null;

  constructor(
    id: string,
    subTotal: number,
    tax: number,
    total: number,
    itemsInOrder: number,
    isPaid: boolean,
    paidAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
    orderItems: OrderItem[],
    orderAddress: OrderAddress | null,
  ) {
    this.id = id;
    this.subTotal = subTotal;
    this.tax = tax;
    this.total = total;
    this.itemsInOrder = itemsInOrder;
    this.isPaid = isPaid;
    this.paidAt = paidAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.orderItems = orderItems;
    this.orderAddress = orderAddress;
  }

  public getId(): string {
    return this.id;
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

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getOrderItems(): OrderItem[] {
    return this.orderItems;
  }

  public getOrderAddress(): OrderAddress | null {
    return this.orderAddress;
  }
}
