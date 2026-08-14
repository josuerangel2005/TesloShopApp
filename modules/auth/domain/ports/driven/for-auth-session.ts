import { AuthSession } from "../../model/auth-session";
import { LoginCredential } from "../../model/login-credentials";

export interface ForAuthSession {
  login(credentials: LoginCredential): Promise<void>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  isAuthenticated(): Promise<boolean>;
}
