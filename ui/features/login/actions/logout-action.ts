"use server";

import { redirect } from "next/navigation";
import { getHandleAuthUseCase } from "../../../../modules/auth";

export const logout = async () => {
  const handleAuthUseCase = getHandleAuthUseCase();

  await handleAuthUseCase.logout();
  redirect("/");
};
