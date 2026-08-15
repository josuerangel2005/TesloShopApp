import { prisma } from "../../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { UserAddressSaveCommand } from "../../../../domain/model/commands/user-address-save-command";
import { UserAddress } from "../../../../domain/model/user-address";
import { ForHandleUserAddress } from "../../../../domain/ports/driven/for-handle-user-address";
import { UserAddressPersistenceErrorException } from "../../../../domain/error/user-address-persistence-error-exception";
import { toDomainUserAddress } from "./mappers/user-address-mapper";

export class PrismaUserAddressHandler implements ForHandleUserAddress {
  private readonly prismaClient: typeof prisma;

  constructor(prismaClient: typeof prisma) {
    this.prismaClient = prismaClient;
  }

  async getUserAddressByUserId(userId: string): Promise<UserAddress | null> {
    try {
      const data = await this.prismaClient.userAddress.findFirst({
        where: {
          userId,
        },
        include: {
          country: true,
        },
      });

      if (!data) return null;

      return toDomainUserAddress(data);
    } catch (error) {
      throw new UserAddressPersistenceErrorException(
        `Failed to get user address by userId: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async saveUserAddress(userAddress: UserAddressSaveCommand): Promise<void> {
    try {
      await this.prismaClient.userAddress.upsert({
        where: {
          userId: userAddress.getUserId(),
        },
        create: {
          firstName: userAddress.getFirstName(),
          lastName: userAddress.getLastName(),
          address: userAddress.getAddress(),
          address2: userAddress.getAddress2(),
          postalCode: userAddress.getPostalCode(),
          city: userAddress.getCity(),
          phone: userAddress.getPhone(),
          country: {
            connect: {
              countryId: userAddress.getCountryId(),
            },
          },
          user: {
            connect: {
              id: userAddress.getUserId(),
            },
          },
        },
        update: {
          firstName: userAddress.getFirstName(),
          lastName: userAddress.getLastName(),
          address: userAddress.getAddress(),
          address2: userAddress.getAddress2(),
          postalCode: userAddress.getPostalCode(),
          city: userAddress.getCity(),
          phone: userAddress.getPhone(),
          country: {
            connect: {
              countryId: userAddress.getCountryId(),
            },
          },
        },
      });
    } catch (error) {
      throw new UserAddressPersistenceErrorException(
        `Failed to save user address: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteUserAddressByUserId(userId: string): Promise<void> {
    try {
      await this.prismaClient.userAddress.deleteMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new UserAddressPersistenceErrorException(
        `Failed to delete user address by userId: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
