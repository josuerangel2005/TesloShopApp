import { AuthSession } from "../../domain/model/auth-session";
import { UserSaveCommand } from "../../domain/model/commands/user-save-command";
import { LoginCredential } from "../../domain/model/login-credentials";
import { User } from "../../domain/model/user";
import { ForAuth } from "../../domain/ports/driven/for-auth";
import { ForAuthSession } from "../../domain/ports/driven/for-auth-session";
import { VerificationTokenExpiredException } from "../../domain/error/verification-token-expired-exception";
import { VerificationTokenInvalidException } from "../../domain/error/verification-token-invalid-exception";

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
}
