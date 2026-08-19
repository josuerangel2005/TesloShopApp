import { ForHandlePendingNumberOrders } from "../../domain/ports/for-handle-pending-number-orders";

export class HandlePendingNumberOrdes {
  private readonly forHandlePendingNumberOrders: ForHandlePendingNumberOrders;

  constructor(forHandlePendingNumberOrders: ForHandlePendingNumberOrders) {
    this.forHandlePendingNumberOrders = forHandlePendingNumberOrders;
  }

  public getTotalPendigOrders(): number {
    return this.forHandlePendingNumberOrders.getTotalPendingOrders();
  }

  public addPendingOrder(): void {
    this.forHandlePendingNumberOrders.addPendingOrder();
  }

  public deletePendingOrder(): void {
    this.forHandlePendingNumberOrders.deletePendingOrder();
  }

  public subscribe(listener: () => void): () => void {
    return this.forHandlePendingNumberOrders.subscribe(listener);
  }

  public setPendingOrders(pendingOrders: number): void {
    this.forHandlePendingNumberOrders.setPendingOrders(pendingOrders);
  }
}
