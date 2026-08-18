import { prisma } from "../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { HandleOrdersUseCase } from "../../../application/usecases/handle-orders-use-case";
import { PrismaOrdersHandler } from "../../adapters/out/HandleOrders/prisma-orders-handler";

const prismaOrdersHandler = new PrismaOrdersHandler(prisma);

export const getHandleOrdersUseCase = () =>
  new HandleOrdersUseCase(prismaOrdersHandler);
