import { Address } from "../../../../../../domain/model/address";

export const toAddressDomain = (address: {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}) =>
  new Address(
    address.firstName,
    address.lastName,
    address.address,
    address.address2 ?? null,
    address.postalCode,
    address.city,
    address.country,
    address.phone,
  );
