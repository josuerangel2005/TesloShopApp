"use server";

import { redirect } from "next/navigation";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { getHandleUserAddressUseCase } from "../../../../modules/user/infrastructure/config/factory/handle-user-address-use-case-factory";

export const deleteUserAddressAction = async (): Promise<void> => {
  const session = await getHandleAuthUseCase().getSession();

  // Sin sesión no hay userId para eliminar: igual se avanza al checkout
  if (!session) {
    redirect("/checkout");
  }

  await getHandleUserAddressUseCase().deleteUserAddressByUserId(
    session.getId(),
  );

  redirect("/checkout");
};