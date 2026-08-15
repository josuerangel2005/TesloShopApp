import { Size } from "../../../shared/ui-state/domain/model/size";

export class OrderItem {
  private readonly id: string;
  private quantity: number;
  private price: number;
  private size: Size;
  private orderId: string;
  private productId: string;

  constructor(
    id: string,
    quantity: number,
    price: number,
    size: Size,
    orderId: string,
    productId: string,
  ) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
    this.size = size;
    this.orderId = orderId;
    this.productId = productId;
  }

  public getId(): string {
    return this.id;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getPrice(): number {
    return this.price;
  }

  public getSize(): Size {
    return this.size;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getProductId(): string {
    return this.productId;
  }
}
