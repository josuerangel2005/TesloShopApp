import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { NextAuthAuthorize } from "./modules/auth/infrastructure/adapters/out/auth/next-auth-authorize";
import { PrismaUserHandler } from "./modules/auth/infrastructure/adapters/out/auth/prisma-users-handler";
import { prisma } from "./modules/shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { getEncryptPasswordUseCase } from "./modules/shared/ui-state/infrastructure/config/factory/encrypt-password-use-case-factory";

const prismaUserHandler = new PrismaUserHandler(
  prisma,
  getEncryptPasswordUseCase(),
);
const nextAuthAuthorize = new NextAuthAuthorize(prismaUserHandler);

export const auth = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        return nextAuthAuthorize.execute(credentials);
      },
    }),
  ],
});
