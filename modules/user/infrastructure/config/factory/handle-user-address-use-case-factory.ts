import { prisma } from "../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { HandleUserAddressUseCase } from "../../../application/usecases/handle-user-address-use-case";
import { PrismaUserAddressHandler } from "../../adapters/out/HandleUserAddress/prisma-user-address-handler";

const prismaUserAddressHandler = new PrismaUserAddressHandler(prisma);

export const getHandleUserAddressUseCase = () =>
  new HandleUserAddressUseCase(prismaUserAddressHandler);
