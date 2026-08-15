import { prisma } from "../../../../shared/ui-state/infrastructure/adapters/out/persistence/prisma/prisma";
import { HandleCountriesUseCase } from "../../../application/usecases/handle-countries-use-case";
import { PrismaCountryHandler } from "../../adapters/out/HandleCountries/prisma-country-handler";

const prismaCountryHandler = new PrismaCountryHandler(prisma);

export const getHandleCountriesUseCase = () =>
  new HandleCountriesUseCase(prismaCountryHandler);
