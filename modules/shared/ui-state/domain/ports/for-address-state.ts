import { Address } from "../model/address";

export interface ForAddressState {
  subscribe: (listener: () => void) => () => void;
  getAddress: () => Address;
  saveAddress: (address: Address) => void;
}
