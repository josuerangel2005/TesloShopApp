import { HandleAddressStateUseCase } from "../../../application/usecases/handle-address-state-use-case";
import { addressStore } from "../../adapters/out/AddressState/address-state";
import { ZustandAddressAdapter } from "../../adapters/out/AddressState/zustand-address-adapter";

const zustandAddressAdapter = new ZustandAddressAdapter(addressStore);

export const getHandleAddressStateUseCase = () =>
  new HandleAddressStateUseCase(zustandAddressAdapter);
