"use server";

import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleUserAddressUseCase } from "../../../../modules/user/infrastructure/config/factory/handle-user-address-use-case-factory";
import { AddressActionResponse } from "../interface/address-action-response";

export const getAddressByUserIdAction =
  async (): Promise<AddressActionResponse | null> => {
    const session = await getHandleAuthUseCase().getSession();
    if (!session) return null;

    const userAddress =
      await getHandleUserAddressUseCase().getUserAddressByUserId(
        session.getId(),
      );
    if (!userAddress) return null;

    return {
      firstName: userAddress.getFirstName(),
      lastName: userAddress.getLastName(),
      address: userAddress.getAddress(),
      address2: userAddress.getAddress2(),
      postalCode: userAddress.getPostalCode(),
      city: userAddress.getCity(),
      countryId: userAddress.getCountryId(),
      phone: userAddress.getPhone(),
    };
  };

