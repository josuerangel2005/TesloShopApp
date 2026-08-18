import { Address } from "../../../../modules/shared/ui-state/domain/model/address";
import { CheckoutAddress } from "../interface/checkout-address";

export const addressToCheckoutAddress = (
  address: Address,
): CheckoutAddress => ({
  firstName: address.getFirstName(),
  lastName: address.getLastName(),
  address: address.getAddress(),
  address2: address.getAddress2(),
  postalCode: address.getPostalCode(),
  city: address.getCity(),
  country: address.getCountry(),
  phone: address.getPhone(),
});