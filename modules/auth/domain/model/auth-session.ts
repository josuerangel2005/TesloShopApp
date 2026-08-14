import { User } from "./user";

export class AuthSession {
  private readonly user: User;
  private readonly expiresAt: Date;

  constructor(user: User, expiresAt: Date) {
    this.user = user;
    this.expiresAt = expiresAt;
  }

  public getUser(): User {
    return this.user;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }
}
