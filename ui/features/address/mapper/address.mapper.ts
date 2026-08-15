import { Address } from "../../../../modules/shared/ui-state/domain/model/address";
import { AddressActionResponse } from "../interface/address-action-response";

export const addressResponseToAddress = (
  address: AddressActionResponse,
): Address =>
  new Address(
    address.firstName,
    address.lastName,
    address.address,
    address.address2 ?? "",
    address.postalCode,
    address.city,
    address.countryId,
    address.phone,
  );