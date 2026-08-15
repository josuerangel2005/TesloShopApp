import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  } | null;

  //Methods
  setAddress: (address: State["address"]) => void;
  getAddress: () => State["address"];
}

export const addressStore = create<State>()(
  persist(
    (set, get) => ({
      address: null,
      setAddress: (address: State["address"]): void => {
        set({ address });
      },
      getAddress: (): State["address"] => get().address,
    }),
    {
      name: "address-storage",
    },
  ),
);
