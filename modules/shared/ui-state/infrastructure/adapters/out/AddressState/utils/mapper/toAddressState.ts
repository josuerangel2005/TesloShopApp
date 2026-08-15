import { Address } from "../../../../../../domain/model/address";

export const toAddressState = (address: Address) => ({
  firstName: address.getFirstName(),
  lastName: address.getLastName(),
  address: address.getAddress(),
  address2: address.getAddress2() ?? undefined,
  postalCode: address.getPostalCode(),
  city: address.getCity(),
  country: address.getCountry(),
  phone: address.getPhone(),
});
