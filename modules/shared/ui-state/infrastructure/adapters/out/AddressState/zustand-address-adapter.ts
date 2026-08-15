import { Address } from "../../../../domain/model/address";
import { ForAddressState } from "../../../../domain/ports/for-address-state";
import { addressStore } from "./address-state";
import { toAddressDomain } from "./utils/mapper/toAddressDomain";
import { toAddressState } from "./utils/mapper/toAddressState";

export class ZustandAddressAdapter implements ForAddressState {
  private addressState: typeof addressStore;

  constructor(addressState: typeof addressStore) {
    this.addressState = addressState;
  }

  subscribe(listener: () => void): () => void {
    return this.addressState.subscribe(listener);
  }

  getAddress(): Address {
    return toAddressDomain(this.addressState.getState().getAddress());
  }

  saveAddress(address: Address): void {
    this.addressState.getState().setAddress(toAddressState(address));
  }
}
