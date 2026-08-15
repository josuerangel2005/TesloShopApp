import { prisma } from "../../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { EncryptPasswordUseCase } from "../../../../../shared/ui-state/application/usecases/encrypt-password-use-case";
import { UserSaveCommand } from "../../../../domain/model/commands/user-save-command";
import { User } from "../../../../domain/model/user";
import { ForAuth } from "../../../../domain/ports/driven/for-auth";
import { InvalidCredentialsException } from "../../../../domain/error/invalid-credentials-exception";
import { Role } from "../../../../domain/model/role";
import { Prisma } from "@/generated/prisma/client";
import { UserNotExistsException } from "../../../../domain/error/user-not-exists-exception";
import { UserPersistenceException } from "../../../../domain/error/user-persistence-exception";
import { toUserDomainMapper } from "./mappers/toUserDomainMapper";
import { UserAlreadyExistsException } from "../../../../domain/error/user-already-exists-exception";
import { VerificationTokenInvalidException } from "../../../../domain/error/verification-token-invalid-exception";
import { UserSeedSaveCommand } from "../../../../domain/model/commands/user-seed-save-command";

export class PrismaUserHandler implements ForAuth {
  private readonly prismaClient: typeof prisma;
  private readonly encryptPasswordUseCase: EncryptPasswordUseCase;

  constructor(
    prismaClient: typeof prisma,
    encryptPasswordUseCase: EncryptPasswordUseCase,
  ) {
    this.prismaClient = prismaClient;
    this.encryptPasswordUseCase = encryptPasswordUseCase;
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    try {
      const data = await this.prismaClient.user.findFirstOrThrow({
        where: {
          email,
        },
      });

      if (!(await this.encryptPasswordUseCase.compare(password, data.password)))
        throw new InvalidCredentialsException();

      return new User(
        data.id,
        data.name,
        data.email,
        data.role as Role,
        data.image,
        data.emailVerified,
        data.emailVerificationToken,
        data.emailVerificationExpires,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new UserNotExistsException(email);
      if (error instanceof InvalidCredentialsException) throw error;
      throw new UserPersistenceException(
        `Failed verify credentials: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async register(saveCommand: UserSaveCommand): Promise<User> {
    try {
      const data = await this.prismaClient.user.create({
        data: {
          name: saveCommand.getName(),
          email: saveCommand.getEmail(),
          password: await this.encryptPasswordUseCase.encrypt(
            saveCommand.getPassword(),
          ),
          role: saveCommand.getRole(),
          image: saveCommand.getImage(),
        },
      });

      return toUserDomainMapper(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new UserAlreadyExistsException(saveCommand.getEmail());
      throw new UserPersistenceException(
        `Failed to save user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const data = await this.prismaClient.user.findFirstOrThrow({
        where: {
          email,
        },
      });

      return toUserDomainMapper(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new UserNotExistsException(email);
      throw new UserPersistenceException(
        `Failed to find user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findUserByVerificationToken(token: string): Promise<User> {
    try {
      const data = await this.prismaClient.user.findFirstOrThrow({
        where: {
          emailVerificationToken: token,
        },
      });

      return toUserDomainMapper(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new VerificationTokenInvalidException();
      throw new UserPersistenceException(
        `Failed to find user by verification token: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async saveEmailVerificationToken(
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    try {
      await this.prismaClient.user.update({
        where: { email },
        data: {
          emailVerificationToken: token,
          emailVerificationExpires: expiresAt,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new UserNotExistsException(email);
      throw new UserPersistenceException(
        `Failed to save verification token: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async verifyEmail(token: string): Promise<User> {
    try {
      const data = await this.prismaClient.user.update({
        where: { emailVerificationToken: token },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });

      return toUserDomainMapper(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new VerificationTokenInvalidException();
      throw new UserPersistenceException(
        `Failed to verify email: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async saveAllUsersSeed(users: UserSeedSaveCommand[]): Promise<void> {
    try {
      await this.prismaClient.user.createMany({
        data: users.map((user) => ({
          name: user.getName(),
          email: user.getEmail(),
          password: user.getPassword(),
          role: user.getRole().toString() as Role,
          image: user.getImage(),
          emailVerified: user.getEmailVerified(),
          emailVerificationToken: user.getEmailVerificationToken(),
          emailVerificationExpires: user.getEmailVerificationExpires(),
        })),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new UserAlreadyExistsException(
          users.map((user) => user.getName()).join(", "),
        );
      throw new UserPersistenceException(
        `Failed to save categories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteAllUsers(): Promise<void> {
    try {
      await this.prismaClient.user.deleteMany();
    } catch (error) {
      throw new UserPersistenceException(
        `Failed to save categories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
