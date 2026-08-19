export interface ForHandlePendingNumberOrders {
  getTotalPendingOrders: () => number;
  addPendingOrder: () => void;
  deletePendingOrder: () => void;
  subscribe: (listener: () => void) => () => void;
  setPendingOrders: (pendingOrders: number) => void;
}
