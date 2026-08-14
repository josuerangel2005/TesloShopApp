import { Role } from "./role";

export class AuthSession {
  private readonly id: string;
  private readonly email: string;
  private readonly name: string;
  private readonly image: string;
  private readonly role: Role;
  private readonly emailVerified: Date | null;
  private readonly expiresAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    image: string,
    role: Role,
    emailVerified: Date | null,
    expiresAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.image = image;
    this.role = role;
    this.emailVerified = emailVerified;
    this.expiresAt = expiresAt;
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getImage(): string {
    return this.image;
  }

  public getRole(): Role {
    return this.role;
  }

  public getEmailVerified(): Date | null {
    return this.emailVerified;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }
}