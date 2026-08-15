import { Address } from "../../domain/model/address";
import { ForAddressState } from "../../domain/ports/for-address-state";

export class HandleAddressStateUseCase {
  private readonly forAddressState: ForAddressState;

  constructor(forAddressState: ForAddressState) {
    this.forAddressState = forAddressState;
  }

  public subscribe(listener: () => void): () => void {
    return this.forAddressState.subscribe(listener);
  }

  public getAddress(): Address | null {
    return this.forAddressState.getAddress();
  }

  public saveAddress(address: Address): void {
    this.forAddressState.saveAddress(address);
  }
}
