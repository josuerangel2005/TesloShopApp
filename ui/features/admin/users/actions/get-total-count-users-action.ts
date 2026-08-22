"use server";

import { getHandleAuthUseCase } from "../../../../../modules/auth";
import { UserNotExistsException } from "../../../../../modules/auth/domain/error/user-not-exists-exception";

export const getTotalCountUsersAction = async (): Promise<number> => {
  try {
    const handleAuth = getHandleAuthUseCase();
    const session = await handleAuth.getSession();

    if (!session) throw new UserNotExistsException("");

    const currentUser = await handleAuth.getCurrentUser();
    if (currentUser?.getRole().toString() !== "ADMIN")
      throw new UserNotExistsException(session.getEmail());

    return await handleAuth.getNumberOfAllUsers();
  } catch (error) {
    console.log(error);
    throw error;
  }
};