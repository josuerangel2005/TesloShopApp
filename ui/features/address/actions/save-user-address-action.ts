"use server";

import { redirect } from "next/navigation";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { UserAddressSaveCommand } from "../../../../modules/user/domain/model/commands/user-address-save-command";
import { getHandleUserAddressUseCase } from "../../../../modules/user/infrastructure/config/factory/handle-user-address-use-case-factory";
import { userAddressSchema } from "../../../../modules/shared/validation/domain/model/schemas";

export const saveUserAddressAction = async (
  formData: FormData,
): Promise<void> => {
  const session = await getHandleAuthUseCase().getSession();

  if (!session) {
    redirect("/checkout");
  }

  const parsed = userAddressSchema.safeParse({
    firstName: formData.get("firstName")?.toString() ?? "",
    lastName: formData.get("lastName")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    address2: formData.get("address2")?.toString() ?? "",
    postalCode: formData.get("postalCode")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    country: formData.get("country")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
  });

  if (!parsed.success) {
    console.error(parsed.error);
    redirect("/checkout");
  }

  // upsert: crea la dirección si no existe o actualiza la existente (userId @unique)
  await getHandleUserAddressUseCase().saveUserAddress(
    new UserAddressSaveCommand(
      parsed.data.firstName,
      parsed.data.lastName,
      parsed.data.address,
      parsed.data.address2 || null,
      parsed.data.postalCode,
      parsed.data.city,
      parsed.data.phone,
      parsed.data.country,
      session.getId(),
    ),
  );

  redirect("/checkout");
};
