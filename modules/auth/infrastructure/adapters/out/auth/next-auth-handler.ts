import { AuthError } from "next-auth";
import { auth } from "../../../../../../auth";
import { LoginCredential } from "../../../../domain/model/login-credentials";
import { ForAuthSession } from "../../../../domain/ports/driven/for-auth-session";
import { InvalidCredentialsException } from "../../../../domain/error/invalid-credentials-exception";
import { AuthSession } from "../../../../domain/model/auth-session";
import { User } from "../../../../domain/model/user";
import { Role } from "../../../../domain/model/role";
import { AuthException } from "../../../../domain/error/auth-exception";

export class NextAuthHandler implements ForAuthSession {
  private readonly authentication: typeof auth;

  constructor(authentication: typeof auth) {
    this.authentication = authentication;
  }

  async login(credentials: LoginCredential): Promise<void> {
    try {
      await this.authentication.signIn("credentials", {
        email: credentials.getEmail(),
        password: credentials.getPassword(),
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin")
          throw new InvalidCredentialsException();
        else throw new AuthException("Unknown authentication error");
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authentication.signOut({ redirect: false });
    } catch (error) {
      if (error instanceof AuthError)
        throw new AuthException("Unknown logout error");
      throw error;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const session = await this.authentication.auth();

    if (!session?.user) return null;

const user = new User(
        session.user.id ?? "",
        session.user.name ?? "",
        session.user.email ?? "",
        Role.user,
        session.user.image ?? "",
        session.user.emailVerified ?? null,
        null,
        null,
      );

    return new AuthSession(user, new Date(session.expires));
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
