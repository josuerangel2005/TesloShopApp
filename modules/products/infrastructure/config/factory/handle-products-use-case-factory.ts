import { HandleProductsUseCase } from "../../../application/usecases/handle-products-use-case";
import { prisma } from "../../adapters/out/HandleProducts/persistence/prisma/prisma";
import { PrismaProductsHandler } from "../../adapters/out/HandleProducts/prisma-products-handler";

const prismaProductssHandler = new PrismaProductsHandler(prisma);

export const getHandleProductsUseCase = () =>
  new HandleProductsUseCase(prismaProductssHandler);
