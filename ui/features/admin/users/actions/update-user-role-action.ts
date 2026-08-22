"use server";

import { revalidatePath } from "next/cache";
import { getHandleAuthUseCase } from "../../../../../modules/auth";

export const updateUserRoleAction = async (
  userId: string,
  newRol: string,
): Promise<void> => {
  const handleAuthUseCase = getHandleAuthUseCase();
  try {
    await handleAuthUseCase.updateRolByUserId(userId, newRol);
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/admin/users");
};
