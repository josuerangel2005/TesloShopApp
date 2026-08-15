import { Prisma } from "../../../../../../../src/generated/prisma/client";
import { UserAddress } from "../../../../../domain/model/user-address";

type UserAddressWithCountry = Prisma.UserAddressGetPayload<{
  include: { country: true };
}>;

export const toDomainUserAddress = (
  data: UserAddressWithCountry,
): UserAddress =>
  new UserAddress(
    data.id,
    data.firstName,
    data.lastName,
    data.address,
    data.address2,
    data.postalCode,
    data.city,
    data.phone,
    data.country.countryId,
    data.userId,
  );