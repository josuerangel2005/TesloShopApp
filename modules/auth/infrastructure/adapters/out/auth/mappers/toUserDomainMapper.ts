import { Prisma } from "@/generated/prisma/client";
import { User } from "../../../../../domain/model/user";
import { Role } from "../../../../../domain/model/role";

export const toUserDomainMapper = (row: Prisma.UserGetPayload<{}>): User =>
  new User(
    row.id,
    row.name,
    row.email,
    row.role as Role,
    row.image,
    row.emailVerified,
    row.emailVerificationToken,
    row.emailVerificationExpires,
  );
