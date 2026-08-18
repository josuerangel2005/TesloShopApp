import type { Prisma } from "@/generated/prisma/client";
import { OrderAddressSaveCommand } from "../../../../../../domain/model/commands/order-address-save-command";

export const toPrismaOrderAddressMapper = (
  address: OrderAddressSaveCommand,
): Prisma.OrderAddressCreateWithoutOrderInput => ({
  firstName: address.getFirstName(),
  lastName: address.getLastName(),
  address: address.getAddress(),
  address2: address.getAddress2(),
  postalCode: address.getPostalCode(),
  city: address.getCity(),
  phone: address.getPhone(),
  country: { connect: { countryId: address.getCountryId() } },
});