import { AuthSession } from "../../domain/model/auth-session";
import { UserSaveCommand } from "../../domain/model/commands/user-save-command";
import { LoginCredential } from "../../domain/model/login-credentials";
import { User } from "../../domain/model/user";
import { ForAuth } from "../../domain/ports/driven/for-auth";
import { ForAuthSession } from "../../domain/ports/driven/for-auth-session";
import { VerificationTokenExpiredException } from "../../domain/error/verification-token-expired-exception";
import { VerificationTokenInvalidException } from "../../domain/error/verification-token-invalid-exception";
import { UserNotExistsException } from "../../domain/error/user-not-exists-exception";
import { UserSeedSaveCommand } from "../../domain/model/commands/user-seed-save-command";

export class HandleAuthUseCase {
  private readonly forAuthSession: ForAuthSession;
  private readonly forAuth: ForAuth;

  constructor(forAuthSession: ForAuthSession, forAuth: ForAuth) {
    this.forAuthSession = forAuthSession;
    this.forAuth = forAuth;
  }

  public login(credentials: LoginCredential): Promise<void> {
    return this.forAuthSession.login(credentials);
  }

  public logout(): Promise<void> {
    return this.forAuthSession.logout();
  }

  public getSession(): Promise<AuthSession | null> {
    return this.forAuthSession.getSession();
  }

  public async getCurrentUser(): Promise<User | null> {
    const session = await this.forAuthSession.getSession();
    const email = session?.getEmail();
    if (!email) return null;

    try {
      return await this.forAuth.findUserByEmail(email);
    } catch (error) {
      if (error instanceof UserNotExistsException) return null;
      throw error;
    }
  }

  public isAuthenticated(): Promise<boolean> {
    return this.forAuthSession.isAuthenticated();
  }

  public verifyCredentials(email: string, password: string): Promise<User> {
    return this.forAuth.verifyCredentials(email, password);
  }

  public register(saveCommand: UserSaveCommand): Promise<User> {
    return this.forAuth.register(saveCommand);
  }

  public findUserByEmail(email: string): Promise<User> {
    return this.forAuth.findUserByEmail(email);
  }

  public saveEmailVerification(
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    return this.forAuth.saveEmailVerificationToken(email, token, expiresAt);
  }

  public async verifyEmail(token: string): Promise<User> {
    const user = await this.forAuth.findUserByVerificationToken(token);

    if (user.getEmailVerified()) return user;

    const expiresAt = user.getEmailVerificationExpires();
    if (expiresAt && expiresAt < new Date())
      throw new VerificationTokenExpiredException();

    return this.forAuth.verifyEmail(token);
  }

  //seed
  public saveAllUsersSeed(users: UserSeedSaveCommand[]): Promise<void> {
    return this.forAuth.saveAllUsersSeed(users);
  }

  public deleteAllUsers(): Promise<void> {
    return this.forAuth.deleteAllUsers();
  }
}
