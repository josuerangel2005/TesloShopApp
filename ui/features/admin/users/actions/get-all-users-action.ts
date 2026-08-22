"use server";

import { getHandleAuthUseCase } from "../../../../../modules/auth";
import { UserNotExistsException } from "../../../../../modules/auth/domain/error/user-not-exists-exception";
import { UserResponse } from "../interfaces/user-response";
import { userToResponse } from "../mappers/user.mapper";

interface GetAllUsersParams {
  page?: number;
  take?: number;
}

export const getAllUsersAction = async ({
  page = 1,
  take = 6,
}: GetAllUsersParams = {}): Promise<UserResponse[]> => {
  try {
    const handleAuth = getHandleAuthUseCase();
    const session = await handleAuth.getSession();

    if (!session) throw new UserNotExistsException("");

    const currentUser = await handleAuth.getCurrentUser();
    if (currentUser?.getRole().toString() !== "ADMIN")
      throw new UserNotExistsException(session.getEmail());

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(take) || take < 1) take = 6;

    const users = await handleAuth.getAllUsers(page, take);

    return users.map(userToResponse);
  } catch (error) {
    console.log(error);
    throw error;
  }
};