import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { SaveCountryCommand } from "../../../../domain/model/commands/save-country-command";
import { Country } from "../../../../domain/model/country";
import { ForHandleCountries } from "../../../../domain/ports/driven/for-handle-countries";
import { CountryAlreadyExistsException } from "../../../../domain/error/country-already-exists-exception";
import { CountryPersistenceErrorException } from "../../../../domain/error/country-persistence-error-exception";

export class PrismaCountryHandler implements ForHandleCountries {
  private readonly prismaClient: typeof prisma;

  constructor(prismaClient: typeof prisma) {
    this.prismaClient = prismaClient;
  }

  async saveAllCountries(countries: SaveCountryCommand[]): Promise<void> {
    try {
      await this.prismaClient.country.createMany({
        data: countries.map((country) => ({
          name: country.getName(),
          countryId: country.getCountryId(),
        })),
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new CountryAlreadyExistsException(
          countries.map((country) => country.getName()).join(", "),
          countries.map((country) => country.getCountryId()).join(", "),
        );

      throw new CountryPersistenceErrorException(
        `Failed to save all countries: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getAllCountries(): Promise<Country[]> {
    try {
      const data = await this.prismaClient.country.findMany();
      return data.map(
        (country) => new Country(country.id, country.name, country.countryId),
      );
    } catch (error) {
      throw new CountryPersistenceErrorException(
        `Failed to get all countries: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getCountryByCode(countryId: string): Promise<Country | null> {
    try {
      const data = await this.prismaClient.country.findUnique({
        where: { countryId },
      });
      return data ? new Country(data.id, data.name, data.countryId) : null;
    } catch (error) {
      throw new CountryPersistenceErrorException(
        `Failed to get country by code: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteAllCountries(): Promise<void> {
    try {
      await this.prismaClient.country.deleteMany();
    } catch (error) {
      throw new CountryPersistenceErrorException(
        `Failed to delete all countries: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
