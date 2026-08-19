import { ForHandlePendingNumberOrders } from "../../../../domain/ports/for-handle-pending-number-orders";
import { pendingOrdersStore } from "./pending-orders-store";

export class ZustandPendingOrdersAdapter implements ForHandlePendingNumberOrders {
  private readonly zustandStore: typeof pendingOrdersStore;

  constructor(zustandStore: typeof pendingOrdersStore) {
    this.zustandStore = zustandStore;
  }

  getTotalPendingOrders(): number {
    return this.zustandStore.getState().getTotalPendigOrders();
  }

  addPendingOrder(): void {
    this.zustandStore.getState().addPendingOrder();
  }

  deletePendingOrder(): void {
    this.zustandStore.getState().deletePendingOrder();
  }

  subscribe(listener: () => void): () => void {
    return this.zustandStore.subscribe(listener);
  }

  setPendingOrders(pendingOrders: number): void {
    this.zustandStore.getState().setPendingOrders(pendingOrders);
  }
}
