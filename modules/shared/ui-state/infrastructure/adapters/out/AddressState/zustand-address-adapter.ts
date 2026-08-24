import { Address } from "../../../../domain/model/address";
import { ForAddressState } from "../../../../domain/ports/for-address-state";
import { addressStore } from "./address-state";
import { toAddressDomain } from "./utils/mapper/toAddressDomain";
import { toAddressState } from "./utils/mapper/toAddressState";

export class ZustandAddressAdapter implements ForAddressState {
  private addressState: typeof addressStore;
  private lastState:
    ReturnType<typeof addressStore.getState>["address"] | undefined;
  private lastDomain: Address | null;

  constructor(addressState: typeof addressStore) {
    this.addressState = addressState;
    this.lastState = undefined;
    this.lastDomain = null;
  }

  subscribe(listener: () => void): () => void {
    return this.addressState.subscribe(listener);
  }

  getAddress(): Address | null {
    const state = this.addressState.getState().getAddress();

    // Cache de la referencia: solo se reconstruye el dominio si el estado del
    // store cambió. Sin esto, getSnapshot devuelve una referencia nueva siempre
    // y useSyncExternalStore entra en loop infinito.
    if (state !== this.lastState) {
      this.lastState = state;
      this.lastDomain = state === null ? null : toAddressDomain(state);
    }

    return this.lastDomain;
  }

  saveAddress(address: Address): void {
    this.addressState.getState().setAddress(toAddressState(address));
  }

  deleteAddress(): void {
    this.addressState.getState().deleteAddress();
  }
}
