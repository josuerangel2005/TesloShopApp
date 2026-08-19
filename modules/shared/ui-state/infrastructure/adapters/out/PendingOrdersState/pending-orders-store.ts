import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  pendingOrders: number;

  setPendingOrders: (pendigOrders: number) => void;
  getTotalPendigOrders: () => number;
  addPendingOrder: () => void;
  deletePendingOrder: () => void;
}

export const pendingOrdersStore = create<State>()(
  persist(
    (set, get) => ({
      pendingOrders: 0,

      setPendingOrders: (pendingOrders: number) => set({ pendingOrders }),
      getTotalPendigOrders: () => get().pendingOrders,
      addPendingOrder: () => {
        const newPendingOrders = get().getTotalPendigOrders() + 1;
        set({
          pendingOrders: newPendingOrders,
        });
      },
      deletePendingOrder: () => {
        const newPendingOrders = get().getTotalPendigOrders() - 1;
        set({
          pendingOrders: newPendingOrders,
        });
      },
    }),
    {
      name: "pendig-orders",
    },
  ),
);
