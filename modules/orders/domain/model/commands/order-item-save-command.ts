import { Size } from "../../../../shared/ui-state/domain/model/size";

export class OrderItemSaveCommand {
  private productId: string;
  private quantity: number;
  private price: number;
  private size: Size;

  constructor(
    productId: string,
    quantity: number,
    price: number,
    size: Size,
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
    this.size = size;
  }

  public getProductId(): string {
    return this.productId;
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
}