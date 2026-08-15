import { auth } from "../../../../../auth";
import { prisma } from "../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { getEncryptPasswordUseCase } from "../../../../shared/ui-state/infrastructure/config/factory/encrypt-password-use-case-factory";
import { HandleAuthUseCase } from "../../../application/usecases/handle-auth-use-case";
import { NextAuthHandler } from "../../adapters/out/auth/next-auth-handler";
import { PrismaUserHandler } from "../../adapters/out/auth/prisma-users-handler";

const nextAuthHandler = new NextAuthHandler(auth);
const prismaUsersHandler = new PrismaUserHandler(
  prisma,
  getEncryptPasswordUseCase(),
);

export const getHandleAuthUseCase = () =>
  new HandleAuthUseCase(nextAuthHandler, prismaUsersHandler);
