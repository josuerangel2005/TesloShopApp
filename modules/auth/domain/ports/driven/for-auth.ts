import { UserSaveCommand } from "../../model/commands/user-save-command";
import { UserSeedSaveCommand } from "../../model/commands/user-seed-save-command";
import { User } from "../../model/user";

export interface ForAuth {
  verifyCredentials(email: string, password: string): Promise<User>;
  register(saveCommand: UserSaveCommand): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
  findUserByVerificationToken: (token: string) => Promise<User>;
  saveEmailVerificationToken: (
    email: string,
    token: string,
    expiresAt: Date,
  ) => Promise<void>;
  verifyEmail: (token: string) => Promise<User>;

  //for seed
  saveAllUsersSeed: (users: UserSeedSaveCommand[]) => Promise<void>;
  deleteAllUsers: () => Promise<void>;
  deleteAllUserAddresses: () => Promise<void>;
}
