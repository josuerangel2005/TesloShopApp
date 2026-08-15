import { Address } from "../model/address";

export interface ForAddressState {
  subscribe: (listener: () => void) => () => void;
  getAddress: () => Address | null;
  saveAddress: (address: Address) => void;
}
