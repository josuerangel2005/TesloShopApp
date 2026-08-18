import type { Prisma } from "@/generated/prisma/client";
import { OrderAddress } from "../../../../../../domain/model/order-address";

type OrderAddressWithCountry = Prisma.OrderAddressGetPayload<{
  include: { country: true };
}>;

type OrderAddressPlainRow = Prisma.OrderAddressGetPayload<{}>;

export const toOrderAddressDomainMapper = (
  data: OrderAddressWithCountry | OrderAddressPlainRow,
) =>
  new OrderAddress(
    data.id,
    data.firstName,
    data.lastName,
    data.address,
    data.address2,
    data.postalCode,
    data.city,
    data.phone,
    data.countryId,
    data.orderId,
  );