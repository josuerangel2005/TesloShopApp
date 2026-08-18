import { Size } from "../../../../shared/ui-state/domain/model/size";

export class OrderItemSaveCommand {
  private productId: string;
  private quantity: number;
  private size: Size;

  constructor(
    productId: string,
    quantity: number,
    size: Size,
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.size = size;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getSize(): Size {
    return this.size;
  }
}